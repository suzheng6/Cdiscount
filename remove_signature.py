import cv2
import numpy as np

# Load the image
img = cv2.imread(r'c:\Users\USER\AppData\Local\Temp\ufr9gr9z.png')
height, width = img.shape[:2]

# Create a mask for the signature area (right bottom corner)
mask = np.zeros((height, width), dtype=np.uint8)

# The signature "Rhea" and date are in the right bottom area
# Based on the image, approximately at the bottom right corner
# Marking the area to be removed (adjust coordinates as needed)
# The signature appears to be roughly at x: 75-95% of width, y: 85-95% of height
x_start = int(width * 0.72)
x_end = int(width * 0.92)
y_start = int(height * 0.83)
y_end = int(height * 0.93)

# Fill the mask with white in the signature area
mask[y_start:y_end, x_start:x_end] = 255

# Use inpainting to remove the signature
result = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)

# Save the result
output_path = r'c:\Users\USER\Desktop\1\sketch_cleaned.png'
cv2.imwrite(output_path, result)
print(f"Cleaned image saved to: {output_path}")
