#!/bin/bash
# Download all project images from old WordPress server
# Run from the crhomepros project root directory

set -e

BASE_URL="http://18.232.99.228/wp-content/uploads"
IMG_DIR="public/images/projects"

mkdir -p "$IMG_DIR/2024-01"
mkdir -p "$IMG_DIR/2024-06"

echo "📸 Downloading project images from old server..."
echo ""

# All image filenames organized by directory
IMAGES_2024_01=(
  "IMG_3700-1024x746.jpg"
  "IMG_3701-1-1024x748.jpg"
  "IMG_3702-780x1024.jpg"
  "IMG_1607-1024x614.jpg"
  "IMG_1608-1024x614.jpg"
  "IMG_1609-1024x614.jpg"
  "IMG_1611-1024x614.jpg"
  "IMG_2016-768x1024.jpg"
  "IMG_2017-768x1024.jpg"
  "IMG_2018-768x1024.jpg"
  "IMG_2020-768x1024.jpg"
  "IMG_2021-768x1024.jpg"
  "IMG_2022-768x1024.jpg"
  "IMG_2023-1024x768.jpg"
  "IMG_0416-768x1024.jpg"
  "IMG_0423-768x1024.jpg"
  "IMG_0491-768x1024.jpg"
  "IMG_0496-1024x768.jpg"
  "IMG_0497-768x1024.jpg"
  "IMG_0498-768x1024.jpg"
  "IMG_0500-768x1024.jpg"
  "IMG_0501-1024x768.jpg"
  "IMG_1551-1024x768.jpg"
  "IMG_1550-1024x768.jpg"
  "IMG_1548-1024x768.jpg"
  "IMG_1548-2-1024x768.jpg"
  "IMG_1546-1024x768.jpg"
  "IMG_1545-768x1024.jpg"
  "IMG_1537-768x1024.jpg"
  "IMG_1532-768x1024.jpg"
  "IMG_1531-1024x768.jpg"
  "IMG_1530-1024x768.jpg"
  "IMG_1509-1024x768.jpg"
  "IMG_1508-768x1024.jpg"
  "IMG_1507-1024x768.jpg"
  "IMG_1506-768x1024.jpg"
  "IMG_1423-1024x768.jpg"
  "IMG_0580-1024x768.jpg"
  "IMG_0591-1024x768.jpg"
  "IMG_0596-1024x768.jpg"
  "IMG_0597-1024x768.jpg"
  "IMG_0623-1024x768.jpg"
  "IMG_0624-1024x768.jpg"
  "IMG_0709-1024x768.jpg"
  "IMG_0710-1024x768.jpg"
  "IMG_0712-1024x768.jpg"
  "IMG_1338-768x1024.jpg"
  "IMG_1337-768x1024.jpg"
  "IMG_1335-768x1024.jpg"
  "IMG_0050-768x1024.jpg"
  "IMG_0046-768x1024.jpg"
  "IMG_0028-768x1024.jpg"
  "IMG_0806.jpg"
  "IMG_0867-576x1024.png"
  "IMG_0815-576x1024.png"
  "IMG_0862-1024x768.jpg"
  "IMG_0941-768x1024.jpg"
  "IMG_0942-768x1024.jpg"
  "IMG_0947-768x1024.jpg"
  "IMG_0948-768x1024.jpg"
  "IMG_0949-768x1024.jpg"
  "IMG_0950-768x1024.jpg"
  "IMG_1095-768x1024.jpg"
)

IMAGES_2024_06=(
  "IMG_3497-1-768x1024.jpg"
  "IMG_3464-1-768x1024.jpg"
  "IMG_2733-1-1024x768.jpg"
  "IMG_2732-1-768x1024.jpg"
  "IMG_2728-1-1024x768.jpg"
  "IMG_2719-1-768x1024.jpg"
  "IMG_3167-1-765x1024.jpg"
  "IMG_3276-1-1024x765.jpg"
  "IMG_2379-1024x768.jpg"
  "IMG_2380-768x1024.jpg"
  "IMG_2386-1024x768.jpg"
  "IMG_2387-768x1024.jpg"
  "IMG_2813-1-768x1024.jpg"
  "IMG_2905-1-768x1024.jpg"
  "IMG_2911-1-768x1024.jpg"
  "IMG_2913-1-1024x768.jpg"
  "IMG_2188-1-768x1024.jpg"
  "IMG_2189-1-768x1024.jpg"
  "IMG_2191-1-768x1024.jpg"
  "IMG_2192-1-768x1024.jpg"
  "IMG_2224-1-1024x768.jpg"
  "IMG_2225-1-1024x768.jpg"
  "IMG_2250-1-768x1024.jpg"
  "IMG_2257-1-768x1024.jpg"
  "IMG_2258-1-768x1024.jpg"
)

COUNT=0
TOTAL=$((${#IMAGES_2024_01[@]} + ${#IMAGES_2024_06[@]}))

for img in "${IMAGES_2024_01[@]}"; do
  COUNT=$((COUNT + 1))
  if [ ! -f "$IMG_DIR/2024-01/$img" ]; then
    echo "[$COUNT/$TOTAL] Downloading $img..."
    curl -sS -o "$IMG_DIR/2024-01/$img" "$BASE_URL/2024/01/$img" || echo "  ⚠️  Failed: $img"
  else
    echo "[$COUNT/$TOTAL] Already exists: $img"
  fi
done

for img in "${IMAGES_2024_06[@]}"; do
  COUNT=$((COUNT + 1))
  if [ ! -f "$IMG_DIR/2024-06/$img" ]; then
    echo "[$COUNT/$TOTAL] Downloading $img..."
    curl -sS -o "$IMG_DIR/2024-06/$img" "$BASE_URL/2024/06/$img" || echo "  ⚠️  Failed: $img"
  else
    echo "[$COUNT/$TOTAL] Already exists: $img"
  fi
done

echo ""
echo "✅ Done! Downloaded $TOTAL images to $IMG_DIR/"
echo ""
echo "Next steps:"
echo "  npm run build && npx vercel --prod --yes"
