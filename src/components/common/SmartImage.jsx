import { useState } from 'react';
import isotipo from '../../assets/logos/pixvo-isotipo.png';

export function SmartImage({ src, alt, image, className = '', width = 512, height = 279, ...props }) {
  const [failed, setFailed] = useState(false);

  const imgSrc = image?.src || src || isotipo;
  const imgAlt = image?.alt || alt || '';
  const imgWidth = image?.width || width;
  const imgHeight = image?.height || height;
  const imgSrcSet = !failed && (image?.srcset || props.srcSet || props.srcset);
  const imgSizes = image?.sizes || props.sizes;

  const classNames = `${className}${failed ? ' image-fallback' : ''}`;

  return (
    <img
      src={failed ? isotipo : imgSrc}
      alt={failed ? `${imgAlt}. Imagen de sustitución de Pixvo.Tech` : imgAlt}
      className={classNames}
      width={imgWidth}
      height={imgHeight}
      loading="lazy"
      onError={() => setFailed(true)}
      {...(imgSrcSet ? { srcSet: imgSrcSet } : {})}
      {...(imgSizes ? { sizes: imgSizes } : {})}
      {...props}
    />
  );
}
