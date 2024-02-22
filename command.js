// ==UserScript==
// @name         command-script
// @namespace    https://github.com/alzamon/userscripts
// @version      0.2
// @description  script for general commands and interface for executing them
// @author       Asgeir Steine
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @updateURL   https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @downloadURL https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @supportURL  https://github.com/alzamon/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    // Trigger this function however you like (e.g., button click, event)
    function sendData() {
        const query = prompt("Choose command: ");
        GM_setValue("gpt-query", query + " " + window.location.origin);
    }

    // Event listener for keydown event
    document.addEventListener('keydown', function(e) {
        // Check if Ctrl is pressed along with 'B' key
        if (e.key === ':') {
            const exclude = ['input', 'textarea'];
            if (exclude.indexOf(event.target.tagName.toLowerCase()) === -1) {
                e.preventDefault(); // Prevent the default action for this key combination
                sendData();
            }
        }
    });
})();
