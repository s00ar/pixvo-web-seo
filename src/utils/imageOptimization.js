/**
 * Generates responsive image srcset and sizes attributes
 * Helps optimize images for different screen sizes and formats
 */

export const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1200,
  ultrawide: 1920,
};

/**
 * Generate srcset string for responsive images
 * @param {string} basePath - Image path without extension (e.g., '/images/hero')
 * @param {number} maxWidth - Maximum image width in pixels
 * @param {string} format - Image format (jpg, webp, avif)
 * @returns {string} srcset string
 */
export function generateSrcSet(basePath, maxWidth = 1200, format = 'jpg') {
  const widths = [320, 640, 1024, 1280];
  return widths
    .filter((w) => w <= maxWidth)
    .map((width) => `${basePath}-${width}w.${format} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * Optimized for mobile-first design
 */
export function generateSizes() {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px';
}

/**
 * Calculate aspect ratio from width and height
 */
export function calculateAspectRatio(width, height) {
  return (height / width * 100).toFixed(2);
}

/**
 * Get optimized image loading strategy
 * @param {boolean} isHero - Is this a hero/critical image?
 * @param {number} index - Position of image in viewport
 * @returns {Object} Loading configuration
 */
export function getImageConfig(isHero = false, index = 0) {
  if (isHero) {
    return {
      loading: 'eager',
      fetchPriority: 'high',
      decoding: 'async',
    };
  }

  // Lazy load non-critical images
  const isAboveTheFold = index < 3;
  return {
    loading: 'lazy',
    fetchPriority: isAboveTheFold ? 'high' : 'auto',
    decoding: 'async',
  };
}

/**
 * Generate picture element with modern format fallbacks
 * Usage: use in templates if building custom image components
 * @param {Object} config
 * @returns {string} HTML picture element template
 */
export function generatePictureTemplate(config) {
  const { srcWebp, srcJpg, alt, width, height, sizes } = config;

  return `
    <picture>
      <source srcset="${srcWebp}" type="image/webp" sizes="${sizes}">
      <img
        src="${srcJpg}"
        alt="${alt}"
        width="${width}"
        height="${height}"
        loading="lazy"
        decoding="async"
        sizes="${sizes}"
      >
    </picture>
  `;
}
