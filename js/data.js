import { shuffle, roll } from './utils.js';

export let fetchedData;
export let fullDex;
export let trimmedDex;
export let teammates = new Array(6).fill(null);

export async function fetchMasterZip() {
    try {
        // Await zip file metadata retrieval
        const response = await fetch('data/master.zip');
        if (!response.ok) throw new Error('Failed to fetch master.zip');

        // Await daata retrieval and unzip
        fetchedData = fflate.unzipSync(new Uint8Array(await response.arrayBuffer()));
    } catch (error) {
        console.error('Error unzipping master.zip:', error);
    }

    if (fetchedData && fetchedData['dex.csv']) {
        const reader = new FileReader();

        reader.onload = function(event) {
            fullDex = Papa.parse(event.target.result, { header: true }).data;
            // Assign random images to teammates
            trimDex();
            roll();
        };

        reader.onerror = function(error) {
            console.error('Error reading dex.csv:', error);
        };

        reader.readAsText(new Blob([fetchedData['dex.csv']], { type: 'text/csv' }));
    } else {
        console.error('dex.csv not found.');
    }
}

export function trimDex() {
    const megaRate = 0.0;
    const included = new Set();
    trimmedDex = shuffle(fullDex).filter(row => {
        if (included.has(row["Ndex"])) return false;
        included.add(row["Ndex"]);
        // const ndex = parseInt(row["Ndex"]);
        // // Generate random true/false based on percentage
        // const randomTrueFalse = (rate) => Math.random() < rate;
        // if (isMega && randomTrueFalse(megaRate)) return true;
        return true
    });
}