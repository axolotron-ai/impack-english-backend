import React from 'react';

const ImagePreview = ({ record }) => {
  const src = record?.params?.image_url;
  if (!src) return null;

  return (
    <img
      src={src}
      style={{ maxWidth: '120px', borderRadius: '6px' }}
      alt="preview"
    />
  );
};

export default ImagePreview;