import { roll } from './utils.js';
import { fetchedData } from './data.js';

let activeScorebugIcon;

export function initializeDOM() {
    // const bannerDiv = document.getElementById('banner');
    // if (bannerDiv) {
    //     bannerDiv.style.backgroundColor = '#89ddf5'; // blue = js working
    // }

    const scorebugDivs = document.querySelectorAll('.scorebugIcon');
    scorebugDivs.forEach(square => {
        square.addEventListener('click', function() {
            if (this === activeScorebugIcon) {
                this.classList.remove('scorebugIcon-active');
                activeScorebugIcon = null;
            }
            else {
                if (activeScorebugIcon) {
                    activeScorebugIcon.classList.remove('scorebugIcon-active');
                }
                this.classList.add('scorebugIcon-active');
                activeScorebugIcon = this;
            }
        });
    });

    const teammatesDivs = document.querySelectorAll('.teammate');
    teammatesDivs.forEach(square => {
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

    document.addEventListener('click', function(event) {
        const teamDiv = document.getElementById('pokeTeam');
        const scoreboardDiv = document.getElementById('scoreboard');
        if (teamDiv && !teamDiv.contains(event.target) &&
            scoreboardDiv && !scoreboardDiv.contains(event.target)) {
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
}