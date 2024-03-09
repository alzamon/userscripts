// ==UserScript==
// @name         command-script
// @namespace    https://github.com/alzamon/userscripts
// @version      0.2
// @description  script for general commands and interface for executing them
// @author       Asgeir Steine
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @updateURL   https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @downloadURL https://raw.githubusercontent.com/alzamon/userscripts/main/command.js
// @supportURL  https://github.com/alzamon/userscripts/issues
// ==/UserScript==

(function () {
	"use strict";

	const commands = {
		"close origin": () => {
			if (
				GM_getValue("command origin") ==
				window.location.origin
			) {
				window.close();
			}
		},
		"pin origin": () => {
			const newPins =
				(GM.getValue("pinned") || "") +
				window.location.origin +
				" ";
			GM_setValue("pinned", newPins);
			console.log("Pinned origins " + newPins);
		},
		"unpin origin": () => {
			const newPins = GM_getValue("pinned").replace(
				GM_getValue("command origin") + " ",
				""
			);
			GM_setValue("pinned", newPins);
			console.log(newPins);
		},
		"close all but pinned": () => {
			if (
				GM_getValue("pinned").includes(
					window.location.origin + " "
				)
			) {
				console.log("ignoring pinned tab");
			} else {
				window.close();
			}
		},
		"close all but active": () => {
			if (
				GM_getValue("command origin") ==
				window.location.origin
			) {
				console.log("ignoring active tab");
			} else {
				window.close();
			}
		},
	};
	const commandKeys = Object.keys(commands);

	function sendData() {
		const command = prompt("Choose command: ");
		GM_setValue("command origin", window.location.origin);
		GM_setValue("command", command);
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
			const recognizedCommand = commandKeys.find(
				(command) => newValue === command
			);
			if (newValue !== oldValue && recognizedCommand) {
				console.log("Executing " + newValue);
				commands[recognizedCommand]();
			}
		}
	);
})();
