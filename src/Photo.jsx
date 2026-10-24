import React from 'react';

export function Photo({ alt, ...props }) {
  const responsive = props.src?.endsWith('-640.webp')
    ? {
        srcSet: `${props.src.replace('-640.webp', '-320.webp')} 320w, ${props.src} 640w`,
        sizes: '(max-width:640px) 82px, 115px',
      }
    : {};
  return (
    <span className="photo-frame">
      <img
        width={640}
        height={427}
        loading="lazy"
        decoding="async"
        {...responsive}
        {...props}
        alt={alt}
      />
    </span>
  );
}
