import React from 'react';
import { createRoot } from 'react-dom/client';
import { XMLParser } from 'fast-xml-parser';
import Expander from './ui/Expander';
import Sidebar from './ui/Sidebar';
import Image from './ui/Image';
import { initThree } from './app/world';
import { downloadAndUnzipBlocksets } from './app/downloader';
import { Spot, ParsedData } from './types';

interface BlockInfo {
    name: string;
    textures: Array<{ name: string; data?: Blob | string; isImage?: boolean }>;
    type: string;
}

const App: React.FC = () => {
    const [text, setText] = React.useState<string>('');
    const [parsed, setParsed] = React.useState<ParsedData | null>(null);
    const [blockData, setBlockData] = React.useState<{ fetched?: boolean }>({});
    const [blockInfo, setBlockInfo] = React.useState<BlockInfo[]>([]);

    // Dark mode removed for now

    React.useEffect(() => {
        const fetchBlockData = async () => {
            try {
                const blocks: BlockInfo[] = [];
                const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith('blockset_')) {
                        const cachedData = localStorage.getItem(key);
                        if (cachedData) {
                            try {
                                const blockFiles = JSON.parse(cachedData);

                                // First pass: collect all texture files
                                const textureMap: { [key: string]: Blob | undefined } = {};
                                Object.entries(blockFiles).forEach(([filePath, content]: [string, any]) => {
                                    if (typeof content === 'string') {
                                        const isImage = /\.(gif|jpg|jpeg|png|bmp)$/i.test(filePath);
                                        if (isImage) {
                                            // Store image file paths and content as Blobs
                                            const fileName = filePath.split('/').pop() || filePath;
                                            // For text-based images (GIF as text), create a Blob
                                            const ext = filePath.split('.').pop()?.toLowerCase() || '';
                                            const mimeType = {
                                                'gif': 'image/gif',
                                                'png': 'image/png',
                                                'jpg': 'image/jpeg',
                                                'jpeg': 'image/jpeg',
                                                'bmp': 'image/bmp'
                                            }[ext] || 'image/gif';

                                            try {
                                                // Try to convert to Blob directly
                                                if (content.includes('data:')) {
                                                    textureMap[fileName] = new Blob([content]);
                                                } else if (typeof content === 'string' && content.length > 0) {
                                                    // If it's already binary-like content, create Blob
                                                    const binaryStr = content;
                                                    textureMap[fileName] = new Blob([binaryStr], { type: mimeType });
                                                }
                                            } catch (e) {
                                                // If encoding fails, just store the path as a string for reference
                                                textureMap[fileName] = undefined;
                                            }
                                        }
                                    }
                                });

                                // Second pass: process block files
                                Object.entries(blockFiles).forEach(([filePath, content]: [string, any]) => {
                                    if (typeof content === 'string' && filePath.endsWith('.block')) {
                                        try {
                                            const parsed = parser.parse(content);
                                            const block = parsed?.BLOCK;
                                            if (block) {
                                                const textures: Array<{ name: string; data?: string; isImage?: boolean }> = [];
                                                const textureNames = new Set<string>();

                                                const collectTextures = (obj: any) => {
                                                    if (Array.isArray(obj)) {
                                                        obj.forEach(collectTextures);
                                                    } else if (obj && typeof obj === 'object') {
                                                        if (obj.TEXTURE || obj.texture) {
                                                            const tex = obj.TEXTURE || obj.texture;
                                                            textureNames.add(tex);
                                                        }
                                                        Object.values(obj).forEach(collectTextures);
                                                    }
                                                };
                                                collectTextures(block);

                                                // Map textures to actual files
                                                textureNames.forEach(texName => {
                                                    const fileName = texName.split('/').pop() || texName;
                                                    const isImage = /\.(gif|jpg|jpeg|png|bmp)$/i.test(fileName);
                                                    const imageData = isImage ? textureMap[fileName] : undefined;

                                                    textures.push({
                                                        name: texName,
                                                        isImage,
                                                        data: imageData as string | undefined
                                                    });
                                                });

                                                blocks.push({
                                                    name: block.NAME || filePath,
                                                    textures,
                                                    type: block.TYPE || 'block'
                                                });
                                            }
                                        } catch (e) {
                                            // Ignore parse errors
                                        }
                                    }
                                });
                            } catch (e) {
                                console.error('Error parsing cached blockset:', key);
                            }
                        }
                    }
                }
                setBlockInfo(blocks);
                setBlockData(blocks.length > 0 ? { fetched: true } : ({} as const));
            } catch (error) {
                console.error('Error loading block data:', error);
            }
        };

        // Check periodically for newly cached blocks (after download completes)
        const interval = setInterval(() => {
            fetchBlockData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const response: Response = await fetch('./static/index.3dml');
            const data: string = await response.text();
            setText(data);

            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
            const parsedData: ParsedData = parser.parse(data);
            setParsed(parsedData);

            // Download and unzip blocksets
            downloadAndUnzipBlocksets(parsedData);

            const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
            if (canvas) {
                initThree(canvas, parsedData);
            }
        };
        fetchData();
    }, []);

    return (
        <Sidebar position="left">
            <Expander title="Raw 3DML" content={text} monospace={true} floating={false} />
            <Expander title="Parsed 3DML Output" content={JSON.stringify(parsed, null, 2)} monospace={true} floating={false} />
            <Expander title="Block Data" content={JSON.stringify(blockData, null, 2)} monospace={true} floating={false} />
            {blockInfo.map((block, idx) => (
                <Expander
                    key={idx}
                    title={`Block: ${block.name}`}
                    content={`Type: ${block.type}`}
                    monospace={false}
                    floating={false}
                >
                    {block.textures.map((texture, texIdx) => (
                        <Expander
                            key={texIdx}
                            title={`📷 ${texture.name}`}
                            monospace={false}
                            floating={false}
                        >
                            {texture.isImage && texture.data ? (
                                <Image src={texture.data} alt={texture.name} maxWidth="180px" maxHeight="180px" />
                            ) : (
                                <div className="text-xs text-gray-600 dark:text-gray-400 p-2">
                                    {texture.isImage ? '🖼️ Image texture (no data)' : '📄 Reference'}
                                </div>
                            )}
                        </Expander>
                    ))}
                </Expander>
            ))}
        </Sidebar>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}