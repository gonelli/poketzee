document.addEventListener('DOMContentLoaded', function() {
    const gameDiv = document.getElementById('gameDiv');
    if (gameDiv) {
        gameDiv.style.backgroundColor = '#d4e6f1'; // blue = js working
    }

    const teammates = document.querySelectorAll('.teammate');
    teammates.forEach(square => {
        // Add egg image to each teammate
        const img = document.createElement('img');
        img.src = 'assets/egg.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        square.appendChild(img);

        square.addEventListener('click', function() {
            this.classList.toggle('teammate-active');
        });
    });
});

// Global variable to store unzipped data
let fetchedData;
let fullDex;
let trimmedDex;
let teammates = new Array(6).fill(null);

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Await zip file metadata retrieval
        const response = await fetch('assets/dataset.zip');
        if (!response.ok) throw new Error('Failed to fetch dataset.zip');

        // Await daata retrieval and unzip
        fetchedData = fflate.unzipSync(new Uint8Array(await response.arrayBuffer()));
    } catch (error) {
        console.error('Error unzipping dataset.zip:', error);
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
});

// Function to assign random images to inactive teammates
function roll() {
    if (!fetchedData) {
        console.warn('Unzipped data is not yet available.');
        return;
    }
    else if (!trimmedDex || trimmedDex.length === 0) {
        console.warn('trimmedDex is not available or empty.');
        return null;
    }
    document.querySelectorAll('.teammate')
    .forEach((square, index) => {
        if (square.classList.contains('teammate-active')) {
            return;
        }
        const img = square.querySelector('img');
        if (img) {
            const randomIndex = Math.floor(Math.random() * trimmedDex.length);
            const teammate = trimmedDex[randomIndex];
            teammates[index] = teammate;
            const blob = new Blob([fetchedData[teammate["Img Name"]]], 
                { type: 'image/png' });
            img.src = URL.createObjectURL(blob);
        }
    });
    setGenScore(document.getElementById('topScore2'));
    setColorScore(document.getElementById('topScore3'));
    setTypeScore(document.getElementById('topScore1'));
}

function trimDex() {
    const megaRate = 0.0;
    const included = new Set();
    trimmedDex = shuffle(fullDex).filter(row => {
        if (included.has(row["Ndex"])) return false;
        included.add(row["Ndex"]);
        return true
        const ndex = parseInt(row["Ndex"]);
        // Generate random true/false based on percentage
        const randomTrueFalse = (rate) => Math.random() < rate;
        if (isMega && randomTrueFalse(megaRate)) return true;
    });
}

function setGenScore(scorebug) {
    const genScores = new Map();
    let maxScore = 0;

    for (const teammate of teammates) {
        if (!teammate) {
            console.warn('Teammate is null or undefined.');
            return; // Exit the entire function
        }

        const gen = parseInt(teammate["Gen"]);
        const score = (genScores.get(gen) || 0) + 1;
        genScores.set(gen, score);

        maxScore = Math.max(maxScore, score);
    }
    setScorebugText(scorebug, maxScore);
    return maxScore;
}

function setColorScore(scorebug) {
    const colorScores = new Map();
    let maxScore = 0;

    for (const teammate of teammates) {
        if (!teammate) {
            console.warn('Teammate is null or undefined.');
            return; // Exit the entire function
        }

        const color = teammate["Color"];
        const score = (colorScores.get(color) || 0) + 1;
        colorScores.set(color, score);

        maxScore = Math.max(maxScore, score);
    }
    setScorebugText(scorebug, maxScore);
    return maxScore;
}

function setTypeScore(scorebug) {
    const typeScores = new Map();
    let maxScore = 0;

    for (const teammate of teammates) {
        if (!teammate) {
            console.warn('Teammate is null or undefined.');
            return; // Exit the entire function
        }

        let score2 = 0;
        const type1 = teammate["Type 1"];
        const score1 = (typeScores.get(type1) || 0) + 1;
        typeScores.set(type1, score1);

        const type2 = teammate["Type 2"];
        if (type2) {
            score2 = (typeScores.get(type2) || 0) + 1;
            typeScores.set(type2, score1);
        }

        maxScore = Math.max(maxScore, score1, score2);
    }
    setScorebugText(scorebug, maxScore);
    return maxScore;
}

function setScorebugText(scorebug, score) {
    if (!scorebug) return false;
    if (scorebug instanceof HTMLElement) {
        scorebug.getElementsByClassName('scoreBugText')[0].innerText = `${score}`;
    } else {
        console.warn('scorebug is not an HTML element.');
        return false;
    }
}

function shuffle(array) {
    // Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function spin(htmlElems) {
    if (!htmlElems) return false;

    const toSpinArray = Array.from(htmlElems);
    toSpinArray.forEach(elem => {
        if (!elem || !(elem instanceof HTMLElement)) return false;
        elem.style.transition = 'transform 0.35s ease-in-out';
        elem.style.transform = 'rotate(360deg)';
    });

    // Reset the rotation for all elements after the animation
    setTimeout(() => {
        toSpinArray.forEach(elem => {
            if (!elem || !(elem instanceof HTMLElement)) return false;
            elem.style.transition = '';
            elem.style.transform = '';
        });
    }, 350);

    return true;
}

document.addEventListener('click', function(event) {
    const gameDiv = document.getElementById('pokeTeam');
    if (gameDiv && !gameDiv.contains(event.target)) {
        if (fetchedData) {
            roll();
        } else {
            console.warn('Unzipped data is not yet available.');
        }
    }
    // spin(document.getElementsByClassName('teammate'));
});

document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });
