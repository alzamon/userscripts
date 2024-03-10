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
// @noframes
// ==/UserScript==

(function () {
	"use strict";

	const commands = {
		"close origin": () => {
			GM.getValue("command origin").then((commandOrigin) => {
				if (commandOrigin == window.location.origin) {
					window.close();
				}
			});
		},
		"pin origin": () => {
			GM.getValue("pinned").then((pinned) => {
				const newPins =
					(pinned || "") +
					window.location.origin +
					" ";
				GM_setValue("pinned", newPins);
				console.log("Pinned origins " + newPins);
			});
		},
		"unpin origin": () => {
			GM.getValue("pinned").then((pinned) => {
				const newPins = pinned.replaceAll(
					GM.getValue("command origin") + " ",
					""
				);
				GM_setValue("pinned", newPins);
				console.log(newPins);
			});
		},
		"clear pinned": () => {
			GM_setValue("pinned", "");
			GM.getValue("pinned").then((pinned) => {
				console.log(pinned);
			});
		},
		"show pinned": () => {
			GM.getValue("pinned").then((pinned) => {
				alert("Pinned origins: " + pinned);
			});
		},
		"close all but pinned": () => {
			GM.getValue("pinned").then((pinned) => {
				if (
					pinned.includes(
						window.location.origin + " "
					)
				) {
					console.log("ignoring pinned tab");
				} else {
					console.log("window.close();");
				}
			});
		},
		"close all but active": () => {
			GM.getValue("command origin").then((commandOrigin) => {
				if (commandOrigin == window.location.origin) {
					console.log("ignoring active tab");
				} else {
					window.close();
				}
			});
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
