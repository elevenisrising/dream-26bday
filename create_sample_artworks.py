#!/usr/bin/env python3
"""
Create sample artwork images for gallery development
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_sample_artwork(filename, title, color, size=(800, 600)):
    """Create a sample artwork image"""
    # Create image with gradient background
    img = Image.new('RGB', size, color)
    draw = ImageDraw.Draw(img)
    
    # Add gradient effect
    for y in range(size[1]):
        alpha = y / size[1]
        new_color = tuple(int(c * (1 - alpha * 0.3)) for c in color)
        draw.line([(0, y), (size[0], y)], fill=new_color)
    
    # Add Dream themed elements
    # Draw some circles for decoration
    for i in range(5):
        x = (i + 1) * size[0] // 6
        y = size[1] // 3
        radius = 30 + i * 10
        circle_color = tuple(min(255, c + 50) for c in color)
        draw.ellipse([x-radius, y-radius, x+radius, y+radius], 
                    outline=circle_color, width=3)
    
    # Add title text
    try:
        # Try to use a nice font
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), title, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size[0] - text_width) // 2
    y = size[1] // 2
    
    # Draw text with outline
    outline_color = (255, 255, 255) if sum(color) < 400 else (0, 0, 0)
    text_color = (0, 0, 0) if sum(color) > 400 else (255, 255, 255)
    
    # Draw outline
    for dx, dy in [(-2, -2), (-2, 2), (2, -2), (2, 2)]:
        draw.text((x + dx, y + dy), title, font=font, fill=outline_color)
    
    # Draw main text
    draw.text((x, y), title, font=font, fill=text_color)
    
    # Add Dream birthday theme
    birthday_text = "Happy Birthday Dream! 🎂"
    try:
        small_font = ImageFont.truetype("arial.ttf", 24)
    except:
        small_font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), birthday_text, font=small_font)
    text_width = bbox[2] - bbox[0]
    x = (size[0] - text_width) // 2
    y = size[1] - 80
    
    # Draw birthday text
    for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
        draw.text((x + dx, y + dy), birthday_text, font=small_font, fill=outline_color)
    draw.text((x, y), birthday_text, font=small_font, fill=text_color)
    
    return img

def main():
    """Create all sample artworks"""
    artworks_dir = "assets/artworks"
    os.makedirs(artworks_dir, exist_ok=True)
    
    # Different sizes and colors for variety
    artworks = [
        ("sample_art_1.jpg", "Speedrun Master", (0, 255, 65), (800, 600)),    # Dream green
        ("sample_art_2.jpg", "Manhunt Legend", (255, 237, 78), (600, 800)),   # Dream yellow, portrait
        ("sample_art_3.jpg", "Face Reveal", (255, 107, 107), (900, 600)),     # Red accent, wide
        ("sample_art_4.jpg", "SMP Birthday", (155, 89, 182), (700, 700)),     # Purple, square
        ("sample_art_5.jpg", "Music Journey", (52, 152, 219), (800, 500)),    # Blue, wide
        ("sample_art_6.jpg", "Dream Team", (46, 204, 113), (650, 850)),       # Green, tall
    ]
    
    for filename, title, color, size in artworks:
        filepath = os.path.join(artworks_dir, filename)
        img = create_sample_artwork(filename, title, color, size)
        img.save(filepath, "JPEG", quality=85, optimize=True)
        print(f"✓ Created: {filepath} ({size[0]}x{size[1]})")
    
    print(f"\n✓ Created {len(artworks)} sample artworks!")
    print("You can now replace these with real art files while keeping the same filenames.")

if __name__ == "__main__":
    main()