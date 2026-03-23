#!/usr/bin/env python3
"""
Force-regenerate all thumbnails with correct EXIF orientation.
Strips the EXIF orientation tag after applying the rotation physically,
so browsers don't double-rotate.
"""
import os
import io
from pathlib import Path
from PIL import Image, ImageOps

PHOTOS_DIR = Path(__file__).parent.parent / "photos"
THUMB_SIZE = (900, 750)

print("🔄 Regenerating ALL thumbnails with correct orientation...")
print()

total = 0
fixed = 0
errors = 0

for trip_dir in sorted(PHOTOS_DIR.iterdir()):
    if not trip_dir.is_dir():
        continue

    thumbs_dir = trip_dir / "thumbs"
    photo_files = [f for f in trip_dir.iterdir()
                   if f.suffix.lower() in {'.jpg', '.jpeg', '.png'}
                   and 'thumbs' not in str(f)]

    if not photo_files:
        continue

    thumbs_dir.mkdir(exist_ok=True)
    print(f"  📁 {trip_dir.name} ({len(photo_files)} photos)")

    for photo_path in sorted(photo_files):
        total += 1
        thumb_path = thumbs_dir / f"{photo_path.stem}.jpg"

        try:
            # Open original (resolve symlink)
            real_path = photo_path.resolve()
            with Image.open(real_path) as img:
                # Apply EXIF rotation physically — this is the key fix
                img = ImageOps.exif_transpose(img)

                # Convert to RGB (strips all EXIF including orientation)
                if img.mode != 'RGB':
                    img = img.convert('RGB')

                # Resize to thumbnail
                img.thumbnail(THUMB_SIZE, Image.LANCZOS)

                # Save WITHOUT EXIF (orientation is now baked into pixels)
                img.save(thumb_path, 'JPEG', quality=82, optimize=True)
                fixed += 1

        except Exception as e:
            print(f"    ❌ {photo_path.name}: {e}")
            errors += 1

print()
print(f"✅ Done: {fixed}/{total} thumbnails regenerated, {errors} errors")
print("   Refresh your browser to see the fixes.")
