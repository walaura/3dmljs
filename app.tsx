import React from 'react';
import { createRoot } from 'react-dom/client';
import { XMLParser } from 'fast-xml-parser';
import Expander from './ui/Expander';
import { initThree } from './world';
import { downloadAndUnzipBlocksets } from './downloader';
import { Spot, ParsedData } from './types';

const App: React.FC = () => {
    const [text, setText] = React.useState<string>('');
    const [parsed, setParsed] = React.useState<ParsedData | null>(null);

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
        <div>
            <Expander title="Raw 3DML" content={text} position="left" monospace={true} />
            <Expander title="Parsed 3DML Output" content={JSON.stringify(parsed, null, 2)} position="right" monospace={true} />
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}