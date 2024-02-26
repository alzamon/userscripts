// ==UserScript==
// @name         Advanced Word Selector on Swipe
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Select a word from an array after a specific swipe gesture
// @author       You
// @match        *://*/*
// @grant        window.close
// @grant GM.setValue
// @grant GM.getValue

// ==/UserScript==

(function () {
	"use strict";

	const commands = {
		"close tab": () => {
			window.close();
		},
		"close all but pinned": () => {
			GM.setValue("command", "close all but pinned");
		},
		"pin tab": () => {
			document.tabIsPinned = true;
		},
		"unpin tab": () => {
			document.tabIsPinned = false;
		},
	};
	GM.setValue("commands", commands);
	const wordKeys = Object.keys(commands);
	let startX,
		startY,
		maxRightX = 0,
		swipeRightComplete = false,
		currentWord = "";

	const floatingWord = document.createElement("div");
	setupFloatingWordElement(floatingWord);
	document.body.appendChild(floatingWord);

	document.addEventListener(
		"touchstart",
		function (e) {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			maxRightX = startX; // Reset maxRightX on new touch start
		},
		false
	);

	document.addEventListener(
		"touchmove",
		function (e) {
			const touchX = e.touches[0].clientX;
			const touchY = e.touches[0].clientY;

			// Update maxRightX to the furthest right point reached during swipe
			if (touchX > maxRightX) {
				maxRightX = touchX;
			}

			// Check if swipe right is almost complete and then starts moving left
			if (touchX > window.innerWidth * 0.9) {
				swipeRightComplete = true;
			}

			// If swipe right is complete and touch is moving back to the left significantly
			if (
				swipeRightComplete &&
				maxRightX - touchX > window.innerWidth * 0.1
			) {
				let index = Math.floor(
					((touchX -
						(maxRightX -
							window.innerWidth *
								0.9)) /
						(window.innerWidth * 0.9)) *
						wordKeys.length
				);
				index = Math.max(
					0,
					Math.min(index, wordKeys.length - 1)
				);
				currentWord = wordKeys[index];
				displayWord(
					floatingWord,
					currentWord,
					window.innerWidth / 2,
					touchY
				);
			}
		},
		false
	);

	document.addEventListener(
		"touchend",
		function () {
			if (swipeRightComplete) {
				floatingWord.style.display = "none";
				commands[currentWord]();
			}
			// Reset the swipe tracking variables
			swipeRightComplete = false;
			maxRightX = 0;
		},
		false
	);

	function setupFloatingWordElement(element) {
		element.style.position = "fixed";
		element.style.padding = "5px 10px";
		element.style.background = "rgba(0,0,0,0.7)";
		element.style.color = "white";
		element.style.borderRadius = "5px";
		element.style.textAlign = "center";
		element.style.zIndex = "10000";
		element.style.display = "none";
		element.style.left = "50%";
		element.style.transform = "translate(-50%, -50%)";
	}

	function displayWord(element, word, x, y) {
		element.textContent = word;
		const scrollYOffset =
			window.pageYOffset ||
			document.documentElement.scrollTop;
		element.style.top = `${y - 100}px`; // Position slightly above the finger
		element.style.display = "block";
	}

	GM_addValueChangeListener(
		"lastCommand",
		function (key, oldValue, newValue, remote) {
			if (oldValue == newValue) {
				return;
			} else {
				if (
					newValue === "close all but pinned" &&
					!document.tabIsPinned
				) {
					window.close();
				}
			}
		}
	);
})();
