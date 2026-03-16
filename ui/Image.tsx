import React from 'react';

interface ImageProps {
  src?: string;
  alt: string;
  maxWidth?: string;
  maxHeight?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, maxWidth = '200px', maxHeight = '200px' }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            style={{ maxWidth, maxHeight }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            className="rounded border border-gray-300 dark:border-gray-600"
          />
          {loading && <span className="text-xs text-gray-600 dark:text-gray-400">Loading...</span>}
          {error && <span className="text-xs text-red-500">Image failed to load</span>}
        </>
      ) : (
        <span className="text-xs text-gray-500 dark:text-gray-400">No image data</span>
      )}
      <span className="text-xs text-gray-600 dark:text-gray-400 text-center break-all">{alt}</span>
    </div>
  );
};

export default Image;
