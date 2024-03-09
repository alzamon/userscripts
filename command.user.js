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
		"pin tab": () => {},
		"close all but pinned": () => {
			GM_setValue("command", "close all but pinned");
		},
		"close all but active": () => {
			GM_setValue(
				"command",
				"close all but active " + window.location.origin
			);
		},
	};
	const commandKeys = Object.keys(commands);

	function sendData() {
		const command = prompt("Choose command: ");
		GM_setValue("command", command + " " + window.location.origin);
	}

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
			const recognizedCommand = commandKeys.find((command) =>
				newValue.startsWith(command)
			);
			if (recognizedCommand) {
				console.log("Executing " + recognizedCommand);
				commands[recognizedCommand];
			}
		}
	);
})();
