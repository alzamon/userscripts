// ==UserScript==
// @name         command-script
// @namespace    https://github.com/alzamon/userscripts
// @version      0.2
// @description  script for general commands and interface for executing them
// @author       Asgeir Steine
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @updateURL   https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @downloadURL https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @supportURL  https://github.com/alzamon/userscripts/issues
// ==/UserScript==

(function () {
	"use strict";

	const commands = {
		"close tab": () => window.close(),
	};
	const commandKeys = Object.keys(commands);

	// Trigger this function however you like (e.g., button click, event)
	function sendData() {
		const command = prompt("Choose command: ");
		if (commandKeys.includes(command)) {
			commands[command]();
		}
		GM_setValue("command", command + " " + window.location.origin);
	}

	// Event listener for keydown event
	document.addEventListener("keydown", function (e) {
		if (e.key === ":") {
			const exclude = ["input", "textarea"];
			if (
				exclude.indexOf(
					event.target.tagName.toLowerCase()
				) === -1
			) {
				e.preventDefault(); // Prevent the default action for this key combination
				sendData();
			}
		}
	});

	GM_addValueChangeListener(
		"command",
		function (key, oldValue, newValue, remote) {
			console.log("command changed to " + newValue);
		}
	);
})();
