#!/usr/bin/env python3
"""
Phase GIF Generator for Dream Birthday Website
Automatically generates GIF animations from individual phase frames
"""

import os
import glob
from PIL import Image, ImageFilter
import re

def create_gif_from_frames(frames_folder, output_path, duration=200):
    """
    Create a GIF from a series of phase frames
    
    Args:
        frames_folder: Path to folder containing frame images
        output_path: Path where the GIF will be saved
        duration: Duration between frames in milliseconds (200ms = 0.2s per frame)
    """
    try:
        # Find all phase frames
        pattern = os.path.join(frames_folder, "*.png")
        frame_files = glob.glob(pattern)
        
        if not frame_files:
            print(f"No frame files found in {frames_folder}")
            return False
            
        # Sort frames by number (phase1_1.png, phase1_2.png, etc.)
        frame_files.sort(key=lambda x: int(re.search(r'_(\d+)\.png$', x).group(1)))
        
        # Load images
        frames = []
        for frame_file in frame_files:
            try:
                img = Image.open(frame_file)
                # Convert to RGBA to ensure compatibility
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                frames.append(img)
                print(f"Loaded frame: {os.path.basename(frame_file)}")
            except Exception as e:
                print(f"Error loading {frame_file}: {e}")
                continue
        
        if not frames:
            print("No valid frames loaded")
            return False
            
        # Save as GIF
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=duration,  # milliseconds per frame
            loop=0,  # infinite loop
            optimize=True,
            transparency=0,
            disposal=2  # restore background
        )
        
        print(f"Created GIF: {output_path} with {len(frames)} frames")
        return True
        
    except Exception as e:
        print(f"Error creating GIF: {e}")
        return False

def create_intermediate_frame(img1, img2, alpha=0.5):
    """Create a better intermediate frame without black shadows"""
    try:
        # Ensure both images are the same size
        if img1.size != img2.size:
            img2 = img2.resize(img1.size, Image.Resampling.LANCZOS)
        
        # Convert to RGBA if not already
        if img1.mode != 'RGBA':
            img1 = img1.convert('RGBA')
        if img2.mode != 'RGBA':
            img2 = img2.convert('RGBA')
        
        # Create new image with transparent background
        result = Image.new('RGBA', img1.size, (0, 0, 0, 0))
        
        # Simple crossfade - just alternate between the two images
        # This avoids blending artifacts that cause black shadows
        if alpha < 0.5:
            return img1  # Show first image
        else:
            return img2  # Show second image
            
    except Exception as e:
        print(f"Error creating intermediate frame: {e}")
        return img1

def generate_all_phase_gifs(frame_duration=200, add_intermediate_frames=True):
    """Generate GIFs for all available phases
    
    Args:
        frame_duration: Duration between frames in milliseconds 
                       (100=very fast, 200=fast, 300=normal, 400=slow)
        add_intermediate_frames: Add blended frames between original frames for smoother animation
    """
    assets_dir = "assets"
    gif_dir = os.path.join(assets_dir, "gif")
    
    if not os.path.exists(gif_dir):
        print(f"GIF directory not found: {gif_dir}")
        return
    
    # Check for existing phases
    phases = {}
    for file in os.listdir(gif_dir):
        if file.endswith('.png'):
            match = re.match(r'phase(\d+)_\d+\.png', file)
            if match:
                phase_num = int(match.group(1))
                if phase_num not in phases:
                    phases[phase_num] = []
                phases[phase_num].append(file)
    
    print(f"Found phases: {list(phases.keys())}")
    
    # Generate GIF for each phase
    for phase_num in sorted(phases.keys()):
        phase_frames = sorted(phases[phase_num], key=lambda x: int(re.search(r'_(\d+)\.png$', x).group(1)))
        print(f"\nPhase {phase_num}: {len(phase_frames)} frames")
        
        # Create temporary folder with just this phase's frames
        temp_frames = []
        for frame in phase_frames:
            temp_frames.append(os.path.join(gif_dir, frame))
        
        # Generate GIF
        output_gif = os.path.join(assets_dir, f"phase{phase_num}.gif")
        
        # Create GIF from frames manually
        try:
            frames = []
            for frame_path in temp_frames:
                img = Image.open(frame_path)
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                frames.append(img)
            
            if frames:
                # Add intermediate frames for smoother animation
                if add_intermediate_frames and len(frames) >= 2:
                    smooth_frames = []
                    for i in range(len(frames)):
                        smooth_frames.append(frames[i])
                        # Add intermediate frame between current and next frame
                        next_i = (i + 1) % len(frames)
                        intermediate = create_intermediate_frame(frames[i], frames[next_i], 0.5)
                        smooth_frames.append(intermediate)
                    
                    frames = smooth_frames
                    print(f"✓ Added intermediate frames: {len(frames)} total frames")
                
                frames[0].save(
                    output_gif,
                    save_all=True,
                    append_images=frames[1:],
                    duration=frame_duration,  # Keep original timing even with more frames
                    loop=0,
                    optimize=True,
                    transparency=0,
                    disposal=2
                )
                print(f"✓ Created: {output_gif}")
            else:
                print(f"✗ No frames for phase {phase_num}")
                
        except Exception as e:
            print(f"✗ Error creating phase {phase_num} GIF: {e}")

if __name__ == "__main__":
    print("Dream Birthday Website - Phase GIF Generator")
    print("=" * 50)
    
    # You can adjust speed here:
    # 100 = very fast (choppy but snappy)
    # 150 = fast (good for action)  
    # 200 = normal speed (smooth)
    # 250 = slower (more relaxed)
    # 300 = slow (very smooth)
    
    FRAME_DURATION = 250  # 250ms per frame = smooth but not too slow
    SMOOTH_ANIMATION = False  # Turn off intermediate frames to avoid black shadows
    
    print(f"Generating GIFs with {FRAME_DURATION}ms per frame")
    print(f"Smooth animation: {'ON' if SMOOTH_ANIMATION else 'OFF'}")
    
    generate_all_phase_gifs(FRAME_DURATION, SMOOTH_ANIMATION)
    print("\nGIF generation complete!")