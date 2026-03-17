import React from 'react';

interface ImageProps {
    src?: string | Blob;
    alt: string;
    maxWidth?: string;
    maxHeight?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, maxWidth = '200px', maxHeight = '200px' }) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const imageSrc = React.useMemo(() => {
        if (src instanceof Blob) {
            return URL.createObjectURL(src);
        }
        return src;
    }, [src]);

    React.useEffect(() => {
        return () => {
            if (imageSrc && typeof imageSrc === 'string') {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [imageSrc]);

    const realSrc = src instanceof Blob ? undefined : src;

    return (
        <div className="flex flex-col items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {realSrc ? (
                <>
                    <img
                        src={realSrc}
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
