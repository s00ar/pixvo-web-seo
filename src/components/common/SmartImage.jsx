import { useState } from 'react';
import isotipo from '../../assets/logos/pixvo-isotipo.png';

function getWebPFallback(imagePath) {
  if (!imagePath) return { webp: null, fallback: null };

  const hasExtension = /\.(jpg|jpeg|png|gif)$/i.test(imagePath);
  if (!hasExtension) return { webp: null, fallback: imagePath };

  const baseImagePath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return {
    webp: `${baseImagePath}.webp`,
    fallback: imagePath,
  };
}

export function SmartImage({ src, alt, image, className = '', width = 512, height = 279, loading = 'lazy', ...props }) {
  const [failed, setFailed] = useState(false);
  const [webpSupport] = useState(() => {
    if (typeof window === 'undefined') return true;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  });

  const imgSrc = image?.src || src || isotipo;
  const imgAlt = image?.alt || alt || 'Pixvo - Soluciones de SEO, automatización y crecimiento digital';
  const imgWidth = image?.width || width;
  const imgHeight = image?.height || height;
  const imgSrcSet = !failed && (image?.srcset || props.srcSet || props.srcset);
  const imgSizes = image?.sizes || props.sizes;
  const imgLoading = loading === 'eager' ? 'eager' : 'lazy';
  const fetchPriority = loading === 'eager' ? 'high' : 'auto';

  const { webp: webpPath, fallback: fallbackPath } = getWebPFallback(imgSrc);
  const shouldUseWebP = webpSupport && webpPath && !failed;
  const displaySrc = shouldUseWebP ? webpPath : (failed ? isotipo : imgSrc);

  const classNames = `${className}${failed ? ' image-fallback' : ''}`;

  // If WebP is available, use picture element for better browser support
  if (webpPath && !failed && webpSupport) {
    return (
      <picture>
        <source srcSet={webpPath} type="image/webp" {...(imgSizes ? { sizes: imgSizes } : {})} />
        <img
          src={fallbackPath}
          alt={imgAlt}
          className={classNames}
          width={imgWidth}
          height={imgHeight}
          loading={imgLoading}
          fetchPriority={fetchPriority}
          decoding="async"
          onError={() => setFailed(true)}
          {...(imgSrcSet ? { srcSet: imgSrcSet } : {})}
          {...(imgSizes ? { sizes: imgSizes } : {})}
          {...props}
        />
      </picture>
    );
  }

  return (
    <img
      src={displaySrc}
      alt={failed ? `${imgAlt}. Imagen de sustitución de Pixvo.Tech` : imgAlt}
      className={classNames}
      width={imgWidth}
      height={imgHeight}
      loading={imgLoading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setFailed(true)}
      {...(imgSrcSet ? { srcSet: imgSrcSet } : {})}
      {...(imgSizes ? { sizes: imgSizes } : {})}
      {...props}
    />
  );
}
