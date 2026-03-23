#!/usr/bin/env python3
"""
=====================================================
  THE JUDY & RON ENDEMAN TRAVEL LEGACY
  Photo Scanner — v2.0

  Scans BOTH:
    1. JPEG folders on Desktop (already converted)
    2. Apple Photos Library (via osxphotos)

  Extracts GPS, date, creates thumbnails,
  and generates data/photos.json for the web app.

  Usage:
    pip install Pillow osxphotos tqdm
    python3 scan_photos.py

  Then serve:
    cd .. && python3 -m http.server 8080
    Open: http://localhost:8080
=====================================================
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

# ─── Dependency check ────────────────────────────────────────────────────────
def check_and_install(package):
    try:
        __import__(package)
        return True
    except ImportError:
        print(f"  Installing {package}...")
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', package, '-q'],
                                capture_output=True)
        if result.returncode != 0:
            return False
        try:
            __import__(package)
            return True
        except Exception:
            return False
    except Exception:
        return False

print("🌍 Endeman Travel Legacy — Photo Scanner")
print("=" * 55)
print()
print("Checking dependencies...")

has_pillow = check_and_install('PIL')
has_osxphotos = check_and_install('osxphotos')
has_tqdm = check_and_install('tqdm')

if has_pillow:
    from PIL import Image, ImageOps
    from PIL.ExifTags import TAGS, GPSTAGS
    print("  ✅ Pillow (JPEG/PNG reader)")
    # Enable HEIC/HEIF support if available
    try:
        import pillow_heif
        pillow_heif.register_heif_opener()
        print("  ✅ pillow-heif (HEIC/HEIF support)")
    except ImportError:
        print("  ⚠️  pillow-heif not installed — HEIC thumbnails disabled")
else:
    print("  ❌ Pillow not available — JPEG scanning disabled")

if has_osxphotos:
    import osxphotos
    print("  ✅ osxphotos (Apple Photos library reader)")
else:
    print("  ⚠️  osxphotos not available — Apple Photos scanning disabled")

if has_tqdm:
    from tqdm import tqdm
    print("  ✅ tqdm (progress bars)")
else:
    def tqdm(x, **kw): return x

print()

# ─── Paths ───────────────────────────────────────────────────────────────────
DESKTOP      = Path.home() / "Desktop"
PROJECT_DIR  = Path(__file__).parent.parent
PHOTOS_DIR   = PROJECT_DIR / "photos"
DATA_DIR     = PROJECT_DIR / "data"
THUMB_SIZE   = (900, 750)
FULL_SIZE    = (1800, 1500)

# ─── Trip folder → trip_id mapping (Desktop folders) ─────────────────────────
DESKTOP_FOLDERS = {
    "AFRICA1":               "africa",
    "AFRICA_2":              "africa",
    "ALASKA":                "alaska",
    "ANTARTICA":             "antarctica",
    "ASIA":                  "asia",
    "AUSTRALIA_&_NEW_ZELAND_": "australia_nz",
    "BAJA":                  "baja_mexico",
    "EGYPT":                 "egypt",
    "European Cruise":       "european_cruise",
    "ISRAEL":                "mediterranean",
    "PANAMA TO PARADISE":    "central_america",
}

# ─── GPS coordinate bounding boxes for Apple Photos matching ─────────────────
# Format: trip_id -> list of (lat_min, lat_max, lng_min, lng_max)
TRIP_REGIONS = {
    "european_cruise": [
        (49.0, 52.0, -2.0, 4.0),    # London/Paris area
        (40.0, 44.0, -10.0, 4.0),   # Spain/Compostela
        (40.0, 46.0, 8.0, 17.0),    # Italy/Monaco
    ],
    "mediterranean": [
        (29.0, 35.0, 33.0, 37.0),   # Israel
        (34.0, 42.0, 14.0, 30.0),   # Balkans/Greece/Turkey/Albania
        (44.0, 47.0, 11.0, 14.0),   # Venice
    ],
    "egypt": [
        (20.0, 32.0, 28.0, 36.0),   # Egypt
    ],
    "africa": [
        (-30.0, 1.0, 24.0, 38.0),   # East/South Africa
    ],
    "alaska": [
        (47.0, 72.0, -170.0, -120.0), # Alaska + Seattle
    ],
    "baja_mexico": [
        (15.0, 33.0, -115.0, -98.0), # Baja + Acapulco
    ],
    "central_america": [
        (7.0, 16.0, -92.0, -77.0),  # Central America + Panama
    ],
    "cuba": [
        (22.0, 27.0, -85.0, -74.0), # Cuba + Miami
    ],
    "asia": [
        (1.0, 2.0, 103.0, 105.0),   # Singapore
        (9.0, 23.0, 100.0, 120.0),  # Vietnam/HK/Taiwan
        (30.0, 36.0, 129.0, 142.0), # Japan
    ],
    "australia_nz": [
        (-44.0, -10.0, 140.0, 178.0), # Australia + NZ
    ],
    "argentina": [
        (-56.0, -30.0, -75.0, -50.0), # Argentina
    ],
    "antarctica": [
        (-90.0, -60.0, -180.0, 180.0), # Antarctica
    ],
}

def guess_trip_from_gps(lat, lng):
    """Try to match GPS coordinates to a trip region."""
    if lat is None or lng is None:
        return None
    for trip_id, regions in TRIP_REGIONS.items():
        for (lat_min, lat_max, lng_min, lng_max) in regions:
            if lat_min <= lat <= lat_max and lng_min <= lng <= lng_max:
                return trip_id
    return None

# ─── EXIF helpers ─────────────────────────────────────────────────────────────
def get_exif_gps(image):
    """Extract GPS from PIL Image object."""
    try:
        exif_data = image._getexif()
        if not exif_data:
            return None, None
        gps_info = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "GPSInfo":
                for gps_id, gps_val in value.items():
                    gps_tag = GPSTAGS.get(gps_id, gps_id)
                    gps_info[gps_tag] = gps_val
        if not gps_info:
            return None, None
        lat = dms_to_decimal(gps_info.get("GPSLatitude"))
        lng = dms_to_decimal(gps_info.get("GPSLongitude"))
        if lat is None or lng is None:
            return None, None
        if gps_info.get("GPSLatitudeRef") == "S":
            lat = -lat
        if gps_info.get("GPSLongitudeRef") == "W":
            lng = -lng
        return round(lat, 6), round(lng, 6)
    except Exception:
        return None, None

def dms_to_decimal(dms):
    """Convert DMS tuple to decimal degrees."""
    if not dms:
        return None
    try:
        d, m, s = dms
        return float(d) + float(m) / 60 + float(s) / 3600
    except Exception:
        return None

def get_exif_date(image):
    """Extract date from PIL Image EXIF."""
    try:
        exif_data = image._getexif()
        if not exif_data:
            return None
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag in ("DateTimeOriginal", "DateTime", "DateTimeDigitized"):
                dt = datetime.strptime(str(value), "%Y:%m:%d %H:%M:%S")
                return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    return None

# ─── Thumbnail creation ───────────────────────────────────────────────────────
def make_thumbnail(src_path, thumb_path, size=THUMB_SIZE):
    """Create a JPEG thumbnail."""
    try:
        with Image.open(src_path) as img:
            img = img.copy()
            img = ImageOps.exif_transpose(img)  # handles JPEG + HEIC rotation
            img.thumbnail(size, Image.LANCZOS)
            if img.mode in ('RGBA', 'P', 'LA'):
                img = img.convert('RGB')
            thumb_path.parent.mkdir(parents=True, exist_ok=True)
            img.save(thumb_path, 'JPEG', quality=82, optimize=True)
            return True
    except Exception as e:
        return False

# ─── Source 1: Desktop JPEG folders ──────────────────────────────────────────
def scan_desktop_folders():
    """Scan all known Desktop photo folders."""
    print("📁 Scanning Desktop folders...")
    photos = []
    supported_ext = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

    for folder_name, trip_id in DESKTOP_FOLDERS.items():
        folder_path = DESKTOP / folder_name
        if not folder_path.exists():
            print(f"  ⚠️  Not found: {folder_name}")
            continue

        files = [f for f in folder_path.iterdir() if f.suffix in supported_ext]
        print(f"  📸 {folder_name} ({len(files)} photos) → {trip_id}")

        trip_photo_dir = PHOTOS_DIR / trip_id
        trip_thumb_dir = trip_photo_dir / "thumbs"
        trip_photo_dir.mkdir(parents=True, exist_ok=True)
        trip_thumb_dir.mkdir(parents=True, exist_ok=True)

        for file_path in tqdm(files, desc=f"    {folder_name}", leave=False):
            photo_id = f"{trip_id}_desktop_{file_path.stem}"
            dest_path = trip_photo_dir / file_path.name
            thumb_path = trip_thumb_dir / f"{file_path.stem}.jpg"

            # Create symlink to original (saves disk space)
            if not dest_path.exists():
                try:
                    os.symlink(file_path.resolve(), dest_path)
                except Exception:
                    shutil.copy2(file_path, dest_path)

            # Extract EXIF
            lat, lng, date_str = None, None, None
            if has_pillow and file_path.suffix.lower() in {'.jpg', '.jpeg', '.heic', '.heif'}:
                try:
                    with Image.open(file_path) as img:
                        lat, lng = get_exif_gps(img)
                        date_str = get_exif_date(img)
                        w, h = img.size
                except Exception:
                    w, h = None, None

            # Create thumbnail
            if not thumb_path.exists() and has_pillow:
                make_thumbnail(file_path, thumb_path)

            photos.append({
                "id":            photo_id,
                "trip_id":       trip_id,
                "source":        "desktop",
                "filename":      file_path.name,
                "path":          f"photos/{trip_id}/{file_path.name}",
                "thumb":         f"photos/{trip_id}/thumbs/{file_path.stem}.jpg",
                "lat":           lat,
                "lng":           lng,
                "date":          date_str,
                "location_name": None,
            })

    print(f"  ✅ Desktop: {len(photos)} photos processed\n")
    return photos

# ─── Source 2: Apple Photos Library ──────────────────────────────────────────
def scan_apple_photos():
    """Scan Apple Photos library using osxphotos."""
    if not has_osxphotos:
        print("⚠️  Skipping Apple Photos (osxphotos not installed)\n")
        return []

    print("📱 Scanning Apple Photos Library...")
    print("   (This may take a few minutes for large libraries)")

    try:
        photosdb = osxphotos.PhotosDB()
        all_photos = photosdb.photos()
        print(f"   Found {len(all_photos)} photos in library")
    except Exception as e:
        print(f"   ❌ Could not open Photos library: {e}")
        return []

    photos = []
    skipped = 0

    # We only want photos that match our trip regions or have a trip keyword
    ENDEMAN_KEYWORDS = {
        'africa', 'african', 'safari', 'kenya', 'tanzania', 'zambia',
        'zimbabwe', 'johannesburg', 'cape town',
        'alaska', 'seattle', 'denali',
        'antartica', 'antarctica', 'antarctic', 'penguin',
        'asia', 'japan', 'tokyo', 'singapore', 'vietnam', 'hong kong', 'taiwan',
        'australia', 'sydney', 'new zealand', 'cairns',
        'egypt', 'cairo', 'luxor', 'nile', 'pyramids',
        'israel', 'mediterranean', 'croatia', 'greece', 'turkey', 'albania',
        'europe', 'paris', 'london', 'rome', 'barcelona', 'florence', 'monaco',
        'argentina', 'buenos aires', 'ushuaia', 'patagonia',
        'central america', 'panama', 'costa rica', 'guatemala', 'nicaragua',
        'cuba', 'miami', 'baja', 'cabo', 'ensenada', 'acapulco',
        'endeman', 'ron', 'judy', 'travel', 'trip', 'viaje',
    }

    for photo in tqdm(all_photos, desc="   Processing", unit="photo"):
        # Skip videos
        if photo.ismovie:
            continue

        # Get GPS
        lat = photo.location[0] if photo.location else None
        lng = photo.location[1] if photo.location else None

        # Try to match to a trip
        trip_id = None

        # 1. Match by GPS region
        if lat is not None and lng is not None:
            trip_id = guess_trip_from_gps(lat, lng)

        # 2. Match by keywords/album/title if no GPS match
        if trip_id is None:
            title = (photo.original_filename or '').lower()
            desc = (photo.description or '').lower()
            _albums_raw = photo.albums() if callable(photo.albums) else photo.albums
            # In osxphotos 0.75+, albums is a list of strings (not objects)
            albums = [a.lower() if isinstance(a, str) else a.title.lower() for a in _albums_raw] if _albums_raw else []
            keywords = [k.lower() for k in photo.keywords] if photo.keywords else []
            search_text = ' '.join([title, desc] + albums + keywords)
            if any(kw in search_text for kw in ENDEMAN_KEYWORDS):
                # Make a best guess based on text
                for kw, tid in [
                    ('africa', 'africa'), ('safari', 'africa'), ('kenya', 'africa'),
                    ('alaska', 'alaska'), ('antarc', 'antarctica'),
                    ('japan', 'asia'), ('tokyo', 'asia'), ('singapore', 'asia'),
                    ('australia', 'australia_nz'), ('sydney', 'australia_nz'),
                    ('egypt', 'egypt'), ('cairo', 'egypt'), ('pyramids', 'egypt'),
                    ('israel', 'mediterranean'), ('croatia', 'mediterranean'),
                    ('europe', 'european_cruise'), ('paris', 'european_cruise'),
                    ('argentina', 'argentina'), ('buenos aires', 'argentina'),
                    ('ushuaia', 'argentina'), ('patagonia', 'argentina'),
                    ('panama', 'central_america'), ('costa rica', 'central_america'),
                    ('colombia', 'central_america'), ('nicaragua', 'central_america'),
                    ('cuba', 'cuba'), ('miami', 'cuba'), ('havana', 'cuba'),
                    ('baja', 'baja_mexico'), ('cabo', 'baja_mexico'), ('acapulco', 'baja_mexico'),
                ]:
                    if kw in search_text:
                        trip_id = tid
                        break

        # Skip if no trip match
        if trip_id is None:
            skipped += 1
            continue

        # Export photo
        try:
            trip_photo_dir = PHOTOS_DIR / trip_id
            trip_thumb_dir = trip_photo_dir / "thumbs"
            trip_photo_dir.mkdir(parents=True, exist_ok=True)
            trip_thumb_dir.mkdir(parents=True, exist_ok=True)

            # Use original filename or UUID
            filename = photo.original_filename or f"{photo.uuid}.jpg"
            photo_id = f"{trip_id}_apple_{photo.uuid[:8]}"

            dest_path = trip_photo_dir / filename
            thumb_path = trip_thumb_dir / f"{Path(filename).stem}.jpg"

            # Export original if not already there
            # Use Photos.app export for iCloud-only photos (path is None)
            if not dest_path.exists():
                use_photos = photo.path is None  # iCloud photo — need Photos.app to fetch it
                exported = photo.export(str(trip_photo_dir), filename=filename,
                                        use_photos_export=use_photos, overwrite=False,
                                        timeout=60)
                if not exported:
                    continue

            # Create thumbnail
            if not thumb_path.exists() and has_pillow and dest_path.exists():
                make_thumbnail(dest_path, thumb_path)

            date_str = photo.date.strftime("%Y-%m-%d") if photo.date else None

            photos.append({
                "id":            photo_id,
                "trip_id":       trip_id,
                "source":        "apple_photos",
                "filename":      filename,
                "path":          f"photos/{trip_id}/{filename}",
                "thumb":         f"photos/{trip_id}/thumbs/{Path(filename).stem}.jpg",
                "lat":           round(lat, 6) if lat else None,
                "lng":           round(lng, 6) if lng else None,
                "date":          date_str,
                "location_name": photo.place.name if photo.place else None,
            })

        except Exception as e:
            continue

    print(f"  ✅ Apple Photos: {len(photos)} travel photos exported")
    print(f"     (Skipped {skipped} non-travel photos)\n")
    return photos

# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description='Endeman Photo Scanner')
    parser.add_argument('--desktop-only', action='store_true',
                        help='Only scan Desktop folders (skip Apple Photos)')
    parser.add_argument('--apple-only', action='store_true',
                        help='Only scan Apple Photos library')
    parser.add_argument('--no-thumbs', action='store_true',
                        help='Skip thumbnail creation (faster)')
    args = parser.parse_args()

    print()

    # Create output directories
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    all_photos = []

    if not args.apple_only:
        desktop_photos = scan_desktop_folders()
        all_photos.extend(desktop_photos)

    if not args.desktop_only and has_osxphotos:
        apple_photos = scan_apple_photos()
        all_photos.extend(apple_photos)

    # Deduplicate by filename within same trip
    seen = set()
    unique_photos = []
    for p in all_photos:
        key = f"{p['trip_id']}_{p['filename']}"
        if key not in seen:
            seen.add(key)
            unique_photos.append(p)

    all_photos = unique_photos

    # Sort by date
    all_photos.sort(key=lambda p: (p.get('date') or '9999', p['trip_id']))

    # Stats
    by_trip = {}
    with_gps = 0
    for p in all_photos:
        tid = p['trip_id']
        by_trip[tid] = by_trip.get(tid, 0) + 1
        if p.get('lat'):
            with_gps += 1

    output = {
        "generated_at": datetime.now().isoformat(),
        "stats": {
            "total":    len(all_photos),
            "with_gps": with_gps,
            "by_trip":  by_trip,
        },
        "photos": all_photos,
    }

    # Save
    out_path = DATA_DIR / "photos.json"
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Summary
    print("=" * 55)
    print("✅ SCAN COMPLETE")
    print(f"   Total photos:  {len(all_photos)}")
    print(f"   With GPS:      {with_gps}")
    print(f"   Saved to:      {out_path}")
    print()
    print("By trip:")
    for trip_id, count in sorted(by_trip.items(), key=lambda x: -x[1]):
        print(f"   {trip_id:25s}: {count} photos")
    print()
    print("🚀 NEXT STEPS:")
    print(f"   cd {PROJECT_DIR}")
    print(f"   python3 -m http.server 8080")
    print(f"   Open: http://localhost:8080")
    print("=" * 55)

if __name__ == "__main__":
    main()
