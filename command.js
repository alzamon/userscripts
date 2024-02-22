// ==UserScript==
// @name         command-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script for general commands and interface for executing them
// @author       alzamon
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
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
