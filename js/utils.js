import { fetchedData, trimmedDex, teammates } from "./data.js";
import { setScore, setTypeScore } from "./scoring.js";

export function roll() {
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
    setTypeScore(document.getElementById('topScore1'));
    setScore('Gen', document.getElementById('topScore2'));
    setScore('Color', document.getElementById('topScore3'));
    setScore('Stage', document.getElementById('topScore4'));
}

export function shuffle(array) {
    // Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function spin(htmlElems) {
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