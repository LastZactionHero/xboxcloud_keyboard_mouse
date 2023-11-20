function main() {
	let config = null;
	window.addEventListener("startConfig", function (e) {
		config = e.detail;
		setupTS();
	}, false);
	const setupTS = function () {
		let blacklist = [];

		const touchStadiaElem = document.createElement("span");
		const canvasElem = document.createElement("canvas");
		const canvasCtx = canvasElem.getContext("2d");

		const startTime = Date.now();

		const zIndex = 6000;

		const imgExt = ".svg";

		let layoutMode = false;
		let forceTSVisible = false;

		let buttonInTransit = -1;

		const stickLColor = "#82b4ff";
		let stickLActive = false;
		let stickLStartX = 0;
		let stickLStartY = 0;
		let stickLEndX = 0;
		let stickLEndY = 0;
		let stickLDeltaX = 0;
		let stickLDeltaY = 0;

		const stickRColor = "#ff8a82";
		let stickRActive = false;
		let stickRStartX = 0;
		let stickRStartY = 0;
		let stickREndX = 0;
		let stickREndY = 0;
		let stickRDeltaX = 0;
		let stickRDeltaY = 0;

		const emulatedGamepad = {
			id: "TouchStadia emulated gamepad",
			index: 0,
			connected: true,
			timestamp: 0,
			mapping: "standard",
			axes: [0, 0, 0, 0],
			buttons: [
				{
					label: "A", // 0
					color: "#7dc242",
					locRight: config.buttonDiameter + config.buttonBorderRightOffset,
					locBottom: 0 + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/A"
				},
				{
					label: "B", // 1
					color: "#ed1c24",
					locRight: 0 + config.buttonBorderRightOffset,
					locBottom: config.buttonDiameter + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/B"
				},
				{
					label: "X", // 2
					color: "#24bcee",
					locRight: (config.buttonDiameter * 2) + config.buttonBorderRightOffset,
					locBottom: config.buttonDiameter + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/X"
				},
				{
					label: "Y", // 3
					color: "#f0ea1b",
					locRight: config.buttonDiameter + config.buttonBorderRightOffset,
					locBottom: (config.buttonDiameter * 2) + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/Y"
				},
				{
					label: "L1", // 4
					color: "#636466",
					locLeft: 0 + config.buttonBorderLeftOffset,
					locTop: (config.buttonDiameter * 1.4) + config.buttonBorderTopOffset,
					scale: 2,
					img: "img/controls/L1"
				},
				{
					label: "R1", // 5
					color: "#636466",
					locRight: 0 + config.buttonBorderRightOffset,
					locTop: (config.buttonDiameter * 1.4) + config.buttonBorderTopOffset,
					scale: 2,
					img: "img/controls/R1"
				},
				{
					label: "L2", // 6
					color: "#636466",
					locLeft: 0 + config.buttonBorderLeftOffset,
					locTop: 0 + config.buttonBorderTopOffset,
					scale: 2,
					img: "img/controls/L2"
				},
				{
					label: "R2", // 7
					color: "#636466",
					locRight: 0 + config.buttonBorderRightOffset,
					locTop: 0 + config.buttonBorderTopOffset,
					scale: 2,
					img: "img/controls/R2"
				},
				{
					label: "Se", // 8
					color: "#636466",
					locLeft: (config.buttonDiameter * 5) + config.buttonBorderLeftOffset,
					locTop: (config.buttonDiameter * 1.1) + config.buttonBorderTopOffset,
					scale: 1.2,
					img: "img/controls/select"
				},
				{
					label: "St", // 9
					color: "#636466",
					locRight: (config.buttonDiameter * 5) + config.buttonBorderRightOffset,
					locTop: (config.buttonDiameter * 1.1) + + config.buttonBorderTopOffset,
					scale: 1.2,
					img: "img/controls/start"
				},
				{
					label: "L3", // 10
					color: "#7a24ee",
					locLeft: (config.buttonDiameter * 5) + config.buttonBorderLeftOffset,
					locBottom: 0 + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/L3"
				},
				{
					label: "R3", // 11
					color: "#7a24ee",
					locRight: (config.buttonDiameter * 5) + config.buttonBorderRightOffset,
					locBottom: 0 + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/R3"
				},
				{
					label: "⇧", // 12
					color: "#636466",
					locLeft: config.buttonDiameter + config.buttonBorderLeftOffset,
					locBottom: (config.buttonDiameter * 2) + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/up"
				},
				{
					label: "⇩", // 13
					color: "#636466",
					locLeft: config.buttonDiameter + config.buttonBorderLeftOffset,
					locBottom: 0 + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/down"
				},
				{
					label: "⇦", // 14
					color: "#636466",
					locLeft: 0 + config.buttonBorderLeftOffset,
					locBottom: config.buttonDiameter + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/left"
				},
				{
					label: "⇨", // 15
					color: "#636466",
					locLeft: (config.buttonDiameter * 2) + config.buttonBorderLeftOffset,
					locBottom: config.buttonDiameter + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/right"
				},
				{
					label: "H", // 16
					color: "#ed591c",
					locLeft: window.innerWidth / 2 - config.buttonDiameter / 2,
					locBottom: 0 + config.buttonBorderBottomOffset,
					scale: 1,
					img: "img/controls/home",
					dynamicUpdate: true
				}
			]
		};

		if (typeof config.buttonConfig !== "undefined" && config.buttonConfig !== null) {
			emulatedGamepad.buttons = config.buttonConfig.slice();
		}

		for (let i = 0; i < emulatedGamepad.buttons.length; i++) {
			const buttonElem = document.createElement("img");

			buttonElem.src = config.extUrl + emulatedGamepad.buttons[i].img + imgExt;
			buttonElem.style.cssText = "position:fixed;z-index:" + (zIndex + 1) + ";";
			buttonElem.style.cssText += "width:" + config.buttonDiameter * emulatedGamepad.buttons[i].scale + "px;";
			buttonElem.style.cssText += "opacity:" + ((config.opacity / 255) * 100) + "%;";
			if (config.enableColors) buttonElem.style.cssText += "filter:drop-shadow(0 0 0 " + emulatedGamepad.buttons[i].color + ");"

			if (typeof emulatedGamepad.buttons[i].locLeft !== "undefined") buttonElem.style.left = emulatedGamepad.buttons[i].locLeft + "px";
			if (typeof emulatedGamepad.buttons[i].locRight !== "undefined") buttonElem.style.right = emulatedGamepad.buttons[i].locRight + "px";
			if (typeof emulatedGamepad.buttons[i].locTop !== "undefined") buttonElem.style.top = emulatedGamepad.buttons[i].locTop + "px";
			if (typeof emulatedGamepad.buttons[i].locBottom !== "undefined") buttonElem.style.bottom = emulatedGamepad.buttons[i].locBottom + "px";

			emulatedGamepad.buttons[i].pressed = false;
			emulatedGamepad.buttons[i].touched = false;
			emulatedGamepad.buttons[i].value = 0;

			emulatedGamepad.buttons[i].buttonElem = buttonElem;
		}

		canvasElem.style.cssText = "width:100%;height:100%;top:0;left:0;position:fixed;z-index:" + zIndex + ";overflow:hidden;touch-action:none;";
		canvasElem.width = window.innerWidth;
		canvasElem.height = window.innerHeight;
		touchStadiaElem.style.display = "none";

		const handleStickTouch = function (touchEvent, type) {
			const touches = type === 2 ? touchEvent.changedTouches : touchEvent.touches;
			for (let i = 0; i < touches.length; i++) {
				if (touches[i].target !== canvasElem) continue;
				const clientX = touches[i].clientX;
				const clientY = touches[i].clientY;
				const stickIndex = clientX > window.innerWidth / 2 ? 1 : 0;
				if (stickIndex) { //R
					switch (type) {
						case 0:
							if (stickRActive) break;
							stickRActive = true;
							stickRStartX = stickREndX = clientX;
							stickRStartY = stickREndY = clientY;
							break;
						case 1:
							stickREndX = clientX;
							stickREndY = clientY;
							break;
						case 2:
							stickRActive = false;
							stickRStartX = stickREndX = 0;
							stickRStartY = stickREndY = 0;
							break;
					}
					const angle = Math.atan2(stickRStartY - stickREndY, stickRStartX - stickREndX) + Math.PI;
					let distance = Math.sqrt(
						(stickRStartX - stickREndX) * (stickRStartX - stickREndX) +
						(stickRStartY - stickREndY) * (stickRStartY - stickREndY)
					);
					if (distance > config.stickRadius) distance = config.stickRadius;
					stickRDeltaX = distance * Math.cos(angle);
					stickRDeltaY = distance * Math.sin(angle);

					setAxis(2, stickRDeltaX / config.stickRadius);
					setAxis(3, stickRDeltaY / config.stickRadius);
				} else { //L
					switch (type) {
						case 0:
							if (stickLActive) break;
							stickLActive = true;
							stickLStartX = stickLEndX = clientX;
							stickLStartY = stickLEndY = clientY;
							break;
						case 1:
							stickLEndX = clientX;
							stickLEndY = clientY;
							break;
						case 2:
							stickLActive = false;
							stickLStartX = stickLEndX = 0;
							stickLStartY = stickLEndY = 0;
							break;
					}
					const angle = Math.atan2(stickLStartY - stickLEndY, stickLStartX - stickLEndX) + Math.PI;
					let distance = Math.sqrt(
						(stickLStartX - stickLEndX) * (stickLStartX - stickLEndX) +
						(stickLStartY - stickLEndY) * (stickLStartY - stickLEndY)
					);
					if (distance > config.stickRadius) distance = config.stickRadius;
					stickLDeltaX = distance * Math.cos(angle);
					stickLDeltaY = distance * Math.sin(angle);

					setAxis(0, stickLDeltaX / config.stickRadius);
					setAxis(1, stickLDeltaY / config.stickRadius);
				}
			}
		}

		const pressButton = function (buttonID, isPressed) {
			emulatedGamepad.buttons[buttonID].pressed = isPressed;
			emulatedGamepad.buttons[buttonID].touched = isPressed;
			emulatedGamepad.buttons[buttonID].value = isPressed ? 1 : 0;
			if (config.enableColors) {
				emulatedGamepad.buttons[buttonID].buttonElem.style.filter = isPressed ? "brightness(0)" : "drop-shadow(0 0 0 " + emulatedGamepad.buttons[buttonID].color + ")";
			} else {
				emulatedGamepad.buttons[buttonID].buttonElem.style.filter = isPressed ? "brightness(0)" : "";
			}
			emulatedGamepad.timestamp = Date.now() - startTime;
		}

		const setAxis = function (axis, value) {
			emulatedGamepad.axes[axis] = value;
			emulatedGamepad.timestamp = Date.now() - startTime;
		}

		const updateTSVisibility = function () {
			if (window.location.host == "stadia.google.com" && !window.location.pathname.includes("/player/") && !forceTSVisible) {
				touchStadiaElem.style.display = "none";
			} else {
				touchStadiaElem.style.display = "initial";
			}
		}

		const fetchResources = async function () {
			const [blacklistResp] = await Promise.all([
				fetch(config.extUrl + "res/blacklist.json")
			]);
			blacklist = await blacklistResp.json();
		}

		const loadEventHandlers = function (emulatedGamepad) {
			console.log('loadEventHandlers');

			document.addEventListener('mousemove', function (event) {
				console.log("Mouse movements: X=" + event.movementX + ", Y=" + event.movementY);
				const movementY = event.movementY;
				const movementX = event.movementX;

				setAxis(2, movementX / 50);
				setAxis(3, movementY / 50);
			});

			document.addEventListener('keyup', function (event) {
				if (event.key == ']') {
					if (document.pointerLockElement === document.body) {
						document.exitPointerLock();
					} else {
						document.body.requestPointerLock();
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
			await fetchResources();
			document.body.appendChild(touchStadiaElem);
			touchStadiaElem.appendChild(canvasElem);

			loadEventHandlers(emulatedGamepad);

			console.log("TouchStadia: Canvas and buttons created!");
		}

		window.onresize = function () {
			canvasElem.width = window.innerWidth;
			canvasElem.height = window.innerHeight;
			for (let i = 0; i < emulatedGamepad.buttons.length; i++) {
				if (emulatedGamepad.buttons[i].dynamicUpdate) { //TODO: This is gross, do something different
					const newLoc = (window.innerWidth / 2 - config.buttonDiameter / 2) + "px";
					emulatedGamepad.buttons[i].buttonElem.style.left = newLoc;
				}
			}
		}

		setInterval(updateTSVisibility, 3000); //TODO: We can do better!
		window.addEventListener("popstate", updateTSVisibility);
		updateTSVisibility();

		const originalGetGamepads = navigator.getGamepads;
		navigator.getGamepads = function () { // The magic happens here
			const originalGamepads = originalGetGamepads.apply(navigator);
			const modifiedGamepads = [emulatedGamepad, null, null, null];
			let insertIndex = 1;
			originalGamepadsLoop:
			for (let i = 0; i < 4; i++) {
				if (insertIndex >= 4) break;
				if (originalGamepads[i] !== null) {
					for (let j = 0; j < blacklist.length; j++) {
						if (originalGamepads[i].id.includes(blacklist[j])) {
							continue originalGamepadsLoop;
						}
					}
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

chrome.storage.sync.get([
	"stickRadius",
	"buttonDiameter",
	"buttonBorderLeftOffset",
	"buttonBorderRightOffset",
	"buttonBorderTopOffset",
	"buttonBorderBottomOffset",
	"opacity",
	"enableColors",
	"enableDrawSticks",
	"disableTouchStadia",
	"buttonConfig"
], function (settings) {
	settings.extUrl = chrome.runtime.getURL("/");
	if (settings.disableTouchStadia) return;
	const injScript = document.createElement("script");
	injScript.appendChild(document.createTextNode("(" + main + ")();"));
	(document.body || document.head || document.documentElement).appendChild(injScript);
	window.dispatchEvent(new CustomEvent("startConfig", { detail: settings }));
});

window.addEventListener("newButtonConfig", function (e) {
	const buttons = e.detail;
	chrome.storage.sync.set({ "buttonConfig": buttons }, function () {
		console.log("TouchStadia: Set layout!");
	});
}, false);