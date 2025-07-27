// Utility function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path (starts with /), prepend the backend URL
  if (imagePath.startsWith('/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  // Otherwise, assume it's a filename and construct the full path
  return `http://localhost:5000/uploads/${imagePath}`;
}; 