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
			buttons: [
				// 0: A
				{},
				// 1: B
				{},
				// 2: X
				{},
				// 3: Y
				{},
				// 4: L1
				{},
				// 5: R1
				{},
				// 6: L2
				{},
				// 7: R2
				{},
				// 8: Select
				{},
				// 9: Start
				{},
				// 10: L3
				{},
				// 11: R3,
				{},
				// 12: Dpad Up
				{},
				// 13: Dpad Down
				{},
				// 14: Dpad Left
				{},
				// 15: Dpad Right
				{},
				// 16: Home
				{}]
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


		const MOUSE_MOVE_HISTORY_MAX = 2;
		let mouseMoveHistory = [];
		const appendMouseMovementHistory = function (event) {
			if (event.movementX == 0 && event.movementY == 0) {
				mouseMoveHistory = [];
			} else {
				mouseMoveHistory.unshift({ x: event.movementX, y: event.movementY });
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


		
		const loadEventHandlers = function (emulatedGamepad) {
			console.log('loadEventHandlers');

			document.addEventListener('mousemove', function (event) {
				// console.log("Mouse movements: X=" + event.movementX + ", Y=" + event.movementY);
				appendMouseMovementHistory(event);
				let movement = smoothMouseMovementHistory();

				let axisX = Math.min(1.0, movement.x / 30)
				let axisY = Math.min(1.0, movement.y / 30)
				setAxis(2, axisX);
				setAxis(3, axisY);
			});

			document.addEventListener('keyup', function (event) {
				if (event.key == ']') {
					if (document.pointerLockElement === document.body) {
						document.exitPointerLock();
						pointerLocked = false;
					} else {
						document.body.requestPointerLock();
						pointerLocked = true;
					}
				}
			});


			// 2	X			Reload					r
			// 3	Y			Jump					space
			// 4	L1			Flashlight/Scanner		tab
			// 5	R1			Grenade					p
			// 6	L2			Aim						right mouse down
			// 7	R2			Fire					left mouse down
			// 8	Select								enter
			// 9	Start								\
			// 10	L3			Sprint					shift
			// 11	R3			Bash					middle mouse click
			// 12	Up									i
			// 13	Down								k
			// 14	Left								j
			// 15 	Right								l
			document.addEventListener('mousedown', function (event) {
				// 6	L2			Aim						right mouse down
				if (event.button == 0) { pressButton(7, true) }
				// 7	R2			Fire					left mouse down
				if (event.button === 1) { pressButton(11, true) }
				// 11	R3			Bash					middle mouse click
				if (event.button === 2) { pressButton(6, true) }
			});
			document.addEventListener('mouseup', function (event) {
				// 6	L2			Aim						right mouse down
				if (event.button == 0) { pressButton(7, false) }
				// 7	R2			Fire					left mouse down
				if (event.button === 1) { pressButton(11, false) }
				// 11	R3			Bash					middle mouse click
				if (event.button === 2) { pressButton(6, false) }
			});

			document.addEventListener('keydown', function (event) {
				// 0	A			Activate				e
				if (event.key === 'e') { pressButton(0, true); }
				// 1	B			Sneak					c
				if (event.key === 'c') { pressButton(1, true); }
				// Alternate B: Escape
				if (event.key === 'Escape') { pressButton(1, true); }
				// Alternate B: B
				if (event.key === 'b') { pressButton(1, true); }
				// 2	X			Reload					r
				if (event.key === 'r') { pressButton(2, true); }
				// Alternate X: X
				if (event.key === 'x') { pressButton(2, true); }
				// 3	Y			Jump					space
				if (event.key === ' ') { pressButton(3, true); }
				// Alternate Y: Y
				if (event.key === 'y') { pressButton(3, true); }
				// 4	L1			Flashlight/Scanner		tab
				if (event.key === 'Tab') { pressButton(4, true); }
				// 5	R1			Grenade					p
				if (event.key === 'p') { pressButton(5, true); }

				// 8	Select								enter
				if (event.key === 'Enter') { pressButton(8, true); }
				// 9	Start								\
				if (event.key === '\\') { pressButton(9, true); }
				// 10	L3			Sprint					shift
				if (event.shiftKey) { pressButton(10, true); }
				// 12	Up									i
				if (event.key == 'i') { pressButton(12, true); }
				// 13	Down								k
				if (event.key == 'k') { pressButton(13, true); }
				// 14	Left								j
				if (event.key == 'j') { pressButton(14, true); }
				// 15 	Right								l
				if (event.key == 'l') { pressButton(15, true); }
				if (event.key === 'w') { setAxis(1, -1); }
				if (event.key === 'a') { setAxis(0, -1); }
				if (event.key === 's') { setAxis(1, 1); }
				if (event.key === 'd') { setAxis(0, 1); }
			});

			document.addEventListener('keyup', function (event) {
				// 0	A			Activate				e
				if (event.key === 'e') { pressButton(0, false); }
				// 1	B			Sneak					c
				if (event.key === 'c') { pressButton(1, false); }
				// Alternate B: Escape
				if (event.key === 'Escape') { pressButton(1, false); }
				// Alternate B: B
				if (event.key === 'b') { pressButton(1, false); }
				// 2	X			Reload					r
				if (event.key === 'r') { pressButton(2, false); }
				// Alternate X: X
				if (event.key === 'x') { pressButton(2, false); }
				// 3	Y			Jump					space
				if (event.key === ' ') { pressButton(3, false); }
				// Alternate Y: Y
				if (event.key === 'y') { pressButton(3, false); }
				// 4	L1			Flashlight/Scanner		tab
				if (event.key === 'Tab') { pressButton(4, false); }
				// 5	R1			Grenade					p
				if (event.key === 'p') { pressButton(5, false); }
				// 6	L2			Aim						right mouse down
				// 7	R2			Fire					left mouse down
				// 8	Select								enter
				if (event.key === 'Enter') { pressButton(8, false); }
				// 9	Start								\
				if (event.key === '\\') { pressButton(9, false); }
				// 10	L3			Sprint					shift
				if (event.key == 'z') { pressButton(10, false); }
				// 11	R3			Bash					middle mouse click
				// 12	Up									i
				if (event.key == 'i') { pressButton(12, false); }
				// 13	Down								k
				if (event.key == 'k') { pressButton(13, false); }
				// 14	Left								j
				if (event.key == 'j') { pressButton(14, false); }
				// 15 	Right								l
				if (event.key == 'l') { pressButton(15, false); }
				if (event.key === 'w') { setAxis(1, 0); }
				if (event.key === 'a') { setAxis(0, 0); }
				if (event.key === 's') { setAxis(1, 0); }
				if (event.key === 'd') { setAxis(0, 0); }
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
