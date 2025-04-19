document.addEventListener('DOMContentLoaded', function() {
    const gameDiv = document.getElementById('gameDiv');
    if (gameDiv) {
        gameDiv.style.backgroundColor = '#d4e6f1'; // blue = js working
    }

    const pokeSquares = document.querySelectorAll('.pokeSquare');
    pokeSquares.forEach(square => {
        // Add egg image to each pokeSquare
        const img = document.createElement('img');
        img.src = 'assets/egg.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        square.appendChild(img);

        square.addEventListener('click', function() {
            this.classList.toggle('pokeSquare-active');
        });
    });
});

// Global variable to store unzipped data
let allImages;
let fullDex;
let trimDex;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Await zip file metadata retrieval
        const response = await fetch('assets/pkmn.zip');
        if (!response.ok) throw new Error('Failed to fetch pkmn.zip');

        // Await daata retrieval and unzip
        allImages = fflate.unzipSync(new Uint8Array(await response.arrayBuffer()));

        // Assign random images to pokeSquares
        assignRandomImagesToPokeSquares();
    } catch (error) {
        console.error('Error unzipping pkmn.zip:', error);
    }

    try {
        const response = await fetch('data/dex.csv');
        if (!response.ok) throw new Error('Failed to fetch dex.csv');

        fullDex = Papa.parse(await response.text(), { header: true }).data;

        console.log(fullDex.filter(row => row["Type 1"] === 'Fire'));
        console.log(fullDex);
        // filterDexByUniqueColumn("Ndex");
        reduceDex();
    } catch (error) {
        console.error('Error processing dex.csv:', error);
    }
});

// Function to assign random images to inactive pokeSquares
function assignRandomImagesToPokeSquares() {
    if (!allImages) {
        console.warn('Unzipped data is not yet available.');
        return;
    }

    const inactivePokeSquares = document.querySelectorAll('.pokeSquare:not(.pokeSquare-active)');
    const keys = Object.keys(allImages).filter(key => key.endsWith('n.png'));
    if (keys.length < inactivePokeSquares.length) {
        console.warn('Not enough images in the unzipped data to assign to all inactive pokeSquares.');
        return;
    }

    const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, inactivePokeSquares.length);
    inactivePokeSquares.forEach((square, index) => {
        
        // if (!trimDex || trimDex.length === 0) {
        //     console.warn('trimDex is not available or empty.');
        //     return null;
        // }
        // const randomIndex = Math.floor(Math.random() * trimDex.length);

        const blob = new Blob([allImages[randomKeys[index]]], { type: 'image/png' });
        const imgUrl = URL.createObjectURL(blob);

        const img = square.querySelector('img');
        if (img) {
            img.src = imgUrl;
        }
    });
}

// Function to filter dex by removing rows with duplicate values in a specific column
function filterDexByUniqueColumn(columnName) {
    if (!fullDex) {
        console.warn('Dex data is not yet available.');
        return;
    }

    const seen = new Set();
    fullDex = fullDex.filter(row => {
        if (seen.has(row[columnName])) {
            return false;
        }
        seen.add(row[columnName]);
        return true;
    });

    console.log(`Filtered dex with unique values in column '${columnName}':`, fullDex);
}

function reduceDex() {
    const megaRate = 0.0;
    const gmaxRate = 0.0;
    const galarRate = 0.0;

    const included = new Set();
    
    trimDex = shuffle(fullDex).filter(row => {
        if (included.has(row["Ndex"])) return false;
        included.add(row["Ndex"]);
        return true
        const ndex = parseInt(row["Ndex"]);
        const isMega = ndex >= 10000 && ndex < 20000;
        const isGmax = ndex >= 20000 && ndex < 30000;
        const isGalar = ndex >= 30000 && ndex < 40000;

        // Generate random true/false based on percentage
        const randomTrueFalse = (rate) => Math.random() < rate;

        if (isMega && randomTrueFalse(megaRate)) return true;
        if (isGmax && randomTrueFalse(gmaxRate)) return true;
        if (isGalar && randomTrueFalse(galarRate)) return true;

        return !isMega && !isGmax && !isGalar;
    });

    console.log('Reduced dex:', filteredDex);
}

function shuffle(array) {
    // Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Example usage of unzippedData elsewhere in the script
document.addEventListener('click', function() {
    if (allImages) {
        console.log('Unzipped data is accessible:', Object.keys(allImages));
        assignRandomImagesToPokeSquares(); // Call the function to assign images
    } else {
        console.log('Unzipped data is not yet available.');
    }
});

document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });
