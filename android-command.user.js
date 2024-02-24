// ==UserScript==
// @name         Swipe Right Gesture Command Prompt
// @namespace    https://github.com/alzamon/userscripts
// @version      0.2
// @description  script for general commands and interface for executing them
// @author       Asgeir Steine
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @updateURL   https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @downloadURL https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @supportURL  https://github.com/alzamon/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    let startX, startY, endX, endY;

    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    }, false);

    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].pageX;
        endY = e.changedTouches[0].pageY;

        if(isSwipeRight()) {
            let command = prompt("Enter the command to run:");
            GM_setValue("command", command + " " + window.location.origin);
        }
    }, false);

    function isSwipeRight() {
        const threshold = 100; // Minimum distance for a swipe
        const restraint = 100; // Maximum allowed vertical movement
        const allowedTime = 300; // Maximum time allowed from touchstart to touchend

        const dx = endX - startX;
        const dy = endY - startY;

        return Math.abs(dx) >= threshold && Math.abs(dy) <= restraint && dx > 0;
    }

    GM_addValueChangeListener('command', function(key, oldValue, newValue, remote) {
        console.log('command changed to ' + newValue)
    });
})();
