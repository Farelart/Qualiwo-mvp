/**
 * Utility functions for handling image URLs from various sources
 */

/**
 * Convert Google Drive share URL to direct image URL
 * Handles formats like:
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000
 *
 * Note: Google Drive files must be publicly shared ("Anyone with the link can view")
 * for these URLs to work without authentication.
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url.includes('drive.google.com')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format: https://drive.google.com/thumbnail?id=FILE_ID
  const thumbnailMatch = url.match(/\/thumbnail\?id=([^&]+)/);
  if (thumbnailMatch) {
    fileId = thumbnailMatch[1];
  }

  // If we found a file ID, use the direct download format
  if (fileId) {
    // Use uc?export=download which forces direct file access
    // This works best for publicly shared files
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return url;
}

/**
 * Get a safe image URL with fallback
 * For Google Drive images, uses a proxy to bypass CORS/auth issues
 */
export function getSafeImageUrl(url: string | undefined | null, useProxy: boolean = true): string {
  if (!url || url.trim() === '') {
    return getPlaceholderImage();
  }

  // For Google Drive URLs, use our proxy API route
  if (url.includes('drive.google.com') && useProxy) {
    const convertedUrl = convertGoogleDriveUrl(url);
    // Proxy the image through our API route to bypass CORS
    return `/api/image-proxy?url=${encodeURIComponent(convertedUrl)}`;
  }

  // Convert Google Drive URLs to working format (without proxy)
  if (url.includes('drive.google.com')) {
    return convertGoogleDriveUrl(url);
  }

  return url;
}

/**
 * Get placeholder image as data URL
 */
export function getPlaceholderImage(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
}

