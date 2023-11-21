function main() {
	let config = null;
	window.addEventListener("startConfig", function (e) {
		config = e.detail;
		setupTS();
	}, false);

	const setupTS = function () {
		const startTime = Date.now();
		let pointerLocked = false;

		const emulatedGamepad = {
			id: "Keyboard/Mouse Emulated Gamepad",
			index: 0,
			connected: true,
			timestamp: 0,
			mapping: "standard",
			axes: [0, 0, 0, 0],
			left_stick: [
				{
					keys: ['w']
				},
				{
					keys: ['a']
				},
				{
					keys: ['s']
				},
				{
					keys: ['d']
				}
			],
			buttons: [
				// 0: A
				{
					// Activate
					keys: ['e'],
				},
				// 1: B
				{
					// Sneak, Back
					keys: ['c', 'Escape', 'b']
				},
				// 2: X
				{
					// Reload
					keys: ['r', 'x']
				},
				// 3: Y
				{
					// Jump
					keys: [' ', 'y']
				},
				// 4: L1
				{
					// Flashlight | Scanner
					keys: ['Tab']
				},
				// 5: R1
				{
					// Grenade
					keys: ['p']
				},
				// 6: L2
				{
					// Aim
					mouseButton: [2 /* right */]
				},
				// 7: R2
				{
					// Fire
					mouseButton: [0 /* left */]
				},
				// 8: Select
				{
					keys: ['\\']
				},
				// 9: Start
				{
					keys: ['Enter']
				},
				// 10: L3
				{
					// Run
					keys: ['Shift']
				},
				// 11: R3,
				{
					// Bash
					mouseButton: [1 /* middle */]
				},
				// 12: Dpad Up
				{
					keys: ['i']
				},
				// 13: Dpad Down
				{
					keys: ['k']
				},
				// 14: Dpad Left
				{
					keys: ['j']
				},
				// 15: Dpad Right
				{
					keys: ['l']
				},
				// 16: Home
				{
					keys: ['h']
				}]
		};

		for (let i = 0; i < emulatedGamepad.buttons.length; i++) {
			emulatedGamepad.buttons[i].pressed = false;
			emulatedGamepad.buttons[i].value = 0;
		}

		const pressButton = function (buttonID, isPressed) {
			if (!pointerLocked) {
				return;
			}

			emulatedGamepad.buttons[buttonID].pressed = isPressed;
			emulatedGamepad.buttons[buttonID].value = isPressed ? 1 : 0;
			emulatedGamepad.timestamp = Date.now() - startTime;
		}

		const setAxis = function (axis, value) {
			if (!pointerLocked) {
				return;
			}
			emulatedGamepad.axes[axis] = value;
			emulatedGamepad.timestamp = Date.now() - startTime;
		}


		function normalizeMovement(movement) {
			if(movement == 0) {
				return 0;
			}

			let result = Math.log2(Math.abs(movement)) / 6.8 + 0.1;
			let normalized =  movement < 0 ? -result : result;
			return normalized;
		}

		const MOUSE_MOVE_HISTORY_MAX = 2;
		let mouseMoveHistory = [];
		const appendMouseMovementHistory = function (event) {
			if (event.movementX == 0 && event.movementY == 0) {
				mouseMoveHistory = [];
			} else {
				mouseMoveHistory.unshift({ x: normalizeMovement(event.movementX), y: normalizeMovement(event.movementY) });
				mouseMoveHistory = mouseMoveHistory.slice(0, MOUSE_MOVE_HISTORY_MAX);
			}
		}

		const smoothMouseMovementHistory = function () {
			if (mouseMoveHistory.length == 0) {
				return { x: 0, y: 0 };
			}

			let accumulateX = 0;
			let accumulateY = 0;
			for (let i = 0; i < mouseMoveHistory.length; i++) {
				accumulateX += mouseMoveHistory[i].x;
				accumulateY += mouseMoveHistory[i].y;
			}

			const smoothX = accumulateX / mouseMoveHistory.length;
			const smoothY = accumulateY / mouseMoveHistory.length;

			return { x: smoothX, y: smoothY };
		}


		let resetMotionTimeoutId = null;

		const loadEventHandlers = function (emulatedGamepad) {
			document.addEventListener('mousemove', function (event) {
				appendMouseMovementHistory(event);
				let movement = smoothMouseMovementHistory();

				let axisX = movement.x;
				let axisY = movement.y;
				setAxis(2, axisX);
				setAxis(3, axisY);
				
				if(resetMotionTimeoutId != null) {
					clearTimeout(resetMotionTimeoutId);
				}
				resetMotionTimeoutId = setTimeout(function() {
					console.log("cleared it!");
					setAxis(2, 0);
					setAxis(3, 0);
				}, 100);
			});

			document.addEventListener('keyup', function (event) {
				if (event.key == ']') {
					if (document.pointerLockElement === document.body) {
						document.exitPointerLock();
						pointerLocked = false;
					} else {
						document.body.requestPointerLock({ unadjustedMovement: true });
						pointerLocked = true;
					}
				}
			});

			document.addEventListener('mousedown', function (event) {
				for (let buttonIdx = 0; buttonIdx < emulatedGamepad.buttons.length; buttonIdx++) {
					const button = emulatedGamepad.buttons[buttonIdx];
					if (typeof button.mouseButton === "undefined") {
						continue;
					}

					for (let keyIdx = 0; keyIdx < button.mouseButton.length; keyIdx++) {
						if (event.button === button.mouseButton[keyIdx]) {
							pressButton(buttonIdx, true);
						}
					}
				}
			});
			document.addEventListener('mouseup', function (event) {
				for (let buttonIdx = 0; buttonIdx < emulatedGamepad.buttons.length; buttonIdx++) {
					const button = emulatedGamepad.buttons[buttonIdx];
					if (typeof button.mouseButton === "undefined") {
						continue;
					}

					for (let keyIdx = 0; keyIdx < button.mouseButton.length; keyIdx++) {
						if (event.button === button.mouseButton[keyIdx]) {
							pressButton(buttonIdx, false);
						}
					}
				}
			});
			document.addEventListener('keydown', function (event) {
				for (let buttonIdx = 0; buttonIdx < emulatedGamepad.buttons.length; buttonIdx++) {
					const button = emulatedGamepad.buttons[buttonIdx];
					if (typeof button.keys === "undefined") {
						continue;
					}

					for (let keyIdx = 0; keyIdx < button.keys.length; keyIdx++) {
						if (event.key === button.keys[keyIdx]) {
							pressButton(buttonIdx, true);
						}
					}
				}

				for (let leftStickIdx = 0; leftStickIdx < 4; leftStickIdx++) {
					for (let leftStickButtonIdx = 0; leftStickButtonIdx < emulatedGamepad.left_stick[leftStickIdx].keys.length; leftStickButtonIdx++) {
						if (event.key === emulatedGamepad.left_stick[leftStickIdx].keys[leftStickButtonIdx]) {
							switch (leftStickIdx) {
								case 0: // w
									setAxis(1, -1);
									break;
								case 1: // a
									setAxis(0, -1);
									break;
								case 2: // s
									setAxis(1, 1);
									break;
								case 3: // d
									setAxis(0, 1);
									break;
							}
						}
					}
				}
			});
			document.addEventListener('keyup', function (event) {
				for (let buttonIdx = 0; buttonIdx < emulatedGamepad.buttons.length; buttonIdx++) {
					const button = emulatedGamepad.buttons[buttonIdx];
					if (typeof button.keys === "undefined") {
						continue;
					}

					for (let keyIdx = 0; keyIdx < button.keys.length; keyIdx++) {
						if (event.key === button.keys[keyIdx]) {
							pressButton(buttonIdx, false);
						}
					}
				}

				for (let leftStickIdx = 0; leftStickIdx < 4; leftStickIdx++) {
					for (let leftStickButtonIdx = 0; leftStickButtonIdx < emulatedGamepad.left_stick[leftStickIdx].keys.length; leftStickButtonIdx++) {
						if (event.key === emulatedGamepad.left_stick[leftStickIdx].keys[leftStickButtonIdx]) {
							switch (leftStickIdx) {
								case 0: // w
									setAxis(1, 0);
									break;
								case 1: // a
									setAxis(0, 0);
									break;
								case 2: // s
									setAxis(1, 0);
									break;
								case 3: // d
									setAxis(0, 0);
									break;
							}
						}
					}
				}
			});
		}

		window.onload = async function () {
			loadEventHandlers(emulatedGamepad);
		}

		const originalGetGamepads = navigator.getGamepads;
		navigator.getGamepads = function () { // The magic happens here
			const originalGamepads = originalGetGamepads.apply(navigator);
			const modifiedGamepads = [emulatedGamepad, null, null, null];
			let insertIndex = 1;
			originalGamepadsLoop:
			for (let i = 0; i < 4; i++) {
				if (insertIndex >= 4) break;
				if (originalGamepads[i] !== null) {
					modifiedGamepads[insertIndex] = {};
					for (let property in originalGamepads[i]) {
						modifiedGamepads[insertIndex][property] = originalGamepads[i][property];
					}
					modifiedGamepads[insertIndex].index = insertIndex;
					insertIndex++;
				}
			}
			return modifiedGamepads;
		}
	}
}

chrome.storage.sync.get([], function (settings) {
	settings.extUrl = chrome.runtime.getURL("/");
	const injScript = document.createElement("script");
	injScript.appendChild(document.createTextNode("(" + main + ")();"));
	(document.body || document.head || document.documentElement).appendChild(injScript);
	window.dispatchEvent(new CustomEvent("startConfig", { detail: settings }));
});
