import { initializeDOM } from './dom.js';
import { fetchMasterZip } from './data.js';
import { roll } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    initializeDOM();
    await fetchMasterZip();
    // roll();
});
