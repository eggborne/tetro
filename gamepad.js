class UserGamepad {
	constructor(gamepadObj, mappings) {
		this.buttons = gamepadObj.buttons;
		this.index = gamepadObj.index;
		this.buttonMappings = new Array(gamepadObj.buttons.length);
		this.currentlyPressedButtons = [];

		for (let index in mappings) {
			this.buttonMappings[index] = mappings[index];
		}
	}
	currentData() {
		let gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];
		return gamepads[this.index];
	}
	buttonDown(b) {
		return typeof (b) == 'object' ? b.pressed : b == 1.0; 
	}
	monitorForPresses() {
		this.currentData().buttons.map((button, i) => {
			if (this.buttonDown(button)) {
				if (!this.currentlyPressedButtons.includes(i)) {
					this.currentlyPressedButtons.push(i);
					handleButtonPress(this.buttonMappings[i].action, i);
				}
			} else {
				if (this.currentlyPressedButtons.includes(i)) {
					releaseButton(this.buttonMappings[i].action);
					this.currentlyPressedButtons.splice(this.currentlyPressedButtons.indexOf(i), 1);
				}
			}
		});
	}
}

function checkForNewGamepads() {
	console.log('checking...')
	let gamepadAtIndex0 = navigator.getGamepads ? navigator.getGamepads()[0] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads[0] : [])[0];
	if (gamepadAtIndex0) {
		console.error('Gamepad connected at index', gamepadAtIndex0.index);
		requestAnimationFrame(() => {
			userGamepad = new UserGamepad(gamepadAtIndex0, gameOptions.buttonMappings)
		});
		clearInterval(gamepadPollingInterval);
		document.body.classList.add('gamepad-connected');
	}
}
