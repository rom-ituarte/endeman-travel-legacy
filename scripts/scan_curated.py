#!/usr/bin/env python3
"""
Scan top_photos/ curated folders and generate data/photos.json.

Structure expected:
  top_photos/{folder_name}/gallery/  → gallery photos
  top_photos/{folder_name}/map/      → map pin photos (shown during presentation)

Thumbnails are written to top_photos/{folder_name}/thumbs/
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageOps
from PIL.ExifTags import TAGS, GPSTAGS

BASE_DIR   = Path(__file__).parent.parent
TOP_PHOTOS = BASE_DIR / "top_photos"
OUTPUT     = BASE_DIR / "data" / "photos.json"
THUMB_SIZE = (400, 400)

# Folder name → trip_id mapping (add entries when folder name differs from trip id)
FOLDER_MAP = {
    "africa 1":           "africa",
    "africa 2":           "africa",
    "african safari 1":   "africa",
    "african safari 2":   "africa",
    # All others: folder name with spaces→underscores is used as trip_id
}

SUPPORTED = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".JPG", ".JPEG", ".PNG"}

# Enable HEIC support
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass


def folder_to_trip_id(folder_name: str) -> str:
    key = folder_name.lower().strip()
    if key in FOLDER_MAP:
        return FOLDER_MAP[key]
    return key.replace(" ", "_")


def get_exif_gps(img):
    try:
        exif_data = img._getexif() or {}
        gps_key = next((k for k, v in TAGS.items() if v == "GPSInfo"), None)
        if not gps_key or gps_key not in exif_data:
            return None, None
        gps = exif_data[gps_key]
        decoded = {GPSTAGS.get(k, k): v for k, v in gps.items()}
        def to_deg(vals):
            d, m, s = [float(v) for v in vals]
            return d + m/60 + s/3600
        lat = to_deg(decoded["GPSLatitude"])
        if decoded.get("GPSLatitudeRef") == "S":
            lat = -lat
        lng = to_deg(decoded["GPSLongitude"])
        if decoded.get("GPSLongitudeRef") == "W":
            lng = -lng
        return round(lat, 6), round(lng, 6)
    except Exception:
        return None, None


def get_exif_date(img):
    try:
        exif_data = img._getexif() or {}
        date_key = next((k for k, v in TAGS.items() if v == "DateTimeOriginal"), None)
        if date_key and date_key in exif_data:
            dt = exif_data[date_key]
            return dt[:10].replace(":", "-")
    except Exception:
        pass
    return None


def make_thumb(src: Path, thumb: Path):
    try:
        with Image.open(src) as img:
            img = ImageOps.exif_transpose(img.copy())
            img.thumbnail(THUMB_SIZE, Image.LANCZOS)
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGB")
            thumb.parent.mkdir(parents=True, exist_ok=True)
            img.save(thumb, "JPEG", quality=85, optimize=True)
        return True
    except Exception as e:
        print(f"    ⚠️  Thumb failed: {src.name} — {e}")
        return False


def scan():
    photos = []
    skipped_videos = 0

    for trip_folder in sorted(TOP_PHOTOS.iterdir()):
        if not trip_folder.is_dir() or trip_folder.name == "README.txt":
            continue

        trip_id = folder_to_trip_id(trip_folder.name)
        thumb_dir = trip_folder / "thumbs"
        thumb_dir.mkdir(exist_ok=True)

        for subfolder_name in ("gallery", "map"):
            subfolder = trip_folder / subfolder_name
            if not subfolder.exists():
                continue

            is_map = (subfolder_name == "map")
            files = [f for f in subfolder.iterdir()
                     if f.is_file() and f.suffix in SUPPORTED]

            print(f"  {trip_folder.name}/{subfolder_name}: {len(files)} photos → {trip_id}")

            for f in sorted(files):
                photo_id = f"{trip_id}_curated_{f.stem}"
                thumb_path = thumb_dir / f"{f.stem}.jpg"

                # Create thumbnail
                if not thumb_path.exists():
                    make_thumb(f, thumb_path)

                # Extract EXIF
                lat, lng, date_str = None, None, None
                try:
                    with Image.open(f) as img:
                        lat, lng = get_exif_gps(img)
                        date_str = get_exif_date(img)
                except Exception:
                    pass

                photos.append({
                    "id":       photo_id,
                    "trip_id":  trip_id,
                    "source":   "curated",
                    "map_pin":  is_map,
                    "filename": f.name,
                    "path":     f"top_photos/{trip_folder.name}/{subfolder_name}/{f.name}",
                    "thumb":    f"top_photos/{trip_folder.name}/thumbs/{f.stem}.jpg",
                    "lat":      lat,
                    "lng":      lng,
                    "date":     date_str,
                })

        # Warn about videos
        for f in trip_folder.rglob("*"):
            if f.suffix.lower() in {".mov", ".mp4", ".avi"}:
                skipped_videos += 1

    return photos, skipped_videos


def main():
    print("\n🎨 Scanning top_photos/ (curated)\n" + "="*40)
    photos, skipped_videos = scan()

    output = {"photos": photos}
    with open(OUTPUT, "w") as fh:
        json.dump(output, fh, indent=2)

    print(f"\n✅  Done — {len(photos)} curated photos written to data/photos.json")
    if skipped_videos:
        print(f"   (skipped {skipped_videos} video files)")

    from collections import Counter
    counts = Counter(p["trip_id"] for p in photos)
    map_counts = Counter(p["trip_id"] for p in photos if p["map_pin"])
    print("\n  Trip              gallery  map")
    print("  " + "-"*36)
    for tid in sorted(counts):
        g = counts[tid] - map_counts.get(tid, 0)
        m = map_counts.get(tid, 0)
        print(f"  {tid:22s}  {g:4d}     {m}")


if __name__ == "__main__":
    main()
