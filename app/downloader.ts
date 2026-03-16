import JSZip from 'jszip';
import { ParsedData } from '../types';

export async function downloadAndUnzipBlocksets(parsedData: ParsedData) {
    // Extract blockset hrefs from parsed data
    const blocksets = parsedData.spot?.head?.blockset;
    if (!blocksets) {
        console.log('No blocksets found');
        return;
    }

    // Ensure it's an array
    const blocksetArray = Array.isArray(blocksets) ? blocksets : [blocksets];

    for (const blockset of blocksetArray) {
        const href = blockset.href;
        if (!href) continue;

        // Check cache
        const cacheKey = `blockset_${href}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            console.log(`Using cached blockset: ${href}`, JSON.parse(cached));
            continue;
        }

        try {
            console.log(`Downloading blockset: ${href}`);
            const response = await fetch(href);
            if (!response.ok) {
                console.error(`Failed to download ${href}: ${response.status}`);
                continue;
            }

            const blob = await response.blob();
            const zip = await JSZip.loadAsync(blob);

            // Process the zip contents
            const contents: { [key: string]: string } = {};
            for (const [relativePath, file] of Object.entries(zip.files)) {
                if (!file.dir) {
                    const content = await file.async('string');
                    contents[relativePath] = content;
                    console.log(`File: ${relativePath}`, content);
                }
            }

            console.log(`All contents of ${href}:`, contents);

            // Cache the contents
            localStorage.setItem(cacheKey, JSON.stringify(contents));

        } catch (error) {
            console.error(`Error processing ${href}:`, error);
        }
    }
}