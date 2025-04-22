import { teammates } from './data.js';

const scoreDefinitions = {
    "Gen": "Gen",
    "Color": "Color",
    "Stage": "Evo Stage / Line"
}

export function setScore(category, scorebug) {
    category = scoreDefinitions[category];
    if (!category) {
        console.warn(`Invalid category: ${category}`);
        return;
    }
    const subcategoryScores = new Map();
    let maxScore = 0;

    for (const teammate of teammates) {
        if (!teammate) {
            console.warn('Teammate is null or undefined.');
            return;
        }

        // Category (e.g. Color) is looked up for teammate
        // and its subcategory (e.g. Red) is tallied up
        const subcategory = teammate[category];
        const score = (subcategoryScores.get(subcategory) || 0) + 1;
        subcategoryScores.set(subcategory, score);

        maxScore = Math.max(maxScore, score);
    }
    setScorebugText(scorebug, maxScore);
    return maxScore;
}

export function setTypeScore(scorebug) {
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

export function setScorebugText(scorebug, score) {
    if (!scorebug) return false;
    if (scorebug instanceof HTMLElement) {
        scorebug.getElementsByClassName('scorebugText')[0].innerText = `${score}`;
    } else {
        console.warn('scorebug is not an HTML element.');
        return false;
    }
}