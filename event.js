document.onkeydown = function (e) {

	if (e.keyCode == 16) {
		pressingShift = true;
	};
	if (e.keyCode == 81 || e.keyCode == 79) {
		if (!pressingQ) {
			pressedQAt = counter;
		};
		pressingQ = true;
	};
	if (e.keyCode == 87 || e.keyCode == 38) {
		if (!pressingW) {
			pressedWAt = counter;
		};
		pressingW = true;
	};
	if (e.keyCode == 69 || e.keyCode == 80) {
		pressedEAt = counter;
		pressingE = true;
	};
	if (e.keyCode == 83 || e.keyCode == 40) {
		if (!pressingS) {
			pressedSAt = counter;
			pressingS = true;
		}
	};
	if (e.keyCode == 65 || e.keyCode == 37) {
		if (!pressingA) {
			pressingA = true;
			pressedAAt = counter;
		}
	};
	if (e.keyCode == 68 || e.keyCode == 39) {
		if (!pressingD) {
			pressingD = true;
			pressedDAt = counter;
		}
	};
	if (e.keyCode == 90) {
		pressingZ = true;
		pressedZAt = counter;
	};
	if (e.keyCode == 88) {
		if (!pressingX) {
			pressedXAt = counter;
		};
		pressingX = true;
	};
	if (e.keyCode == 67) {
		pressingC = true;
	};
	if (e.keyCode == 32) {
		if (!pressingSpace) {
			pressedSpaceAt = counter;
		};
		pressingSpace = true;
	};
	if (e.keyCode == 16) {
		pressingLShift = true;
	};
	if (e.keyCode == 17) {
		pressingLCtrl = true;
	};
};

document.onkeyup = function (e) {
	if (e.keyCode == 16) {
		pressingShift = false;
	};
	if (e.keyCode == 87 || e.keyCode == 38) {
		pressingW = false;
	};
	if (e.keyCode == 83 || e.keyCode == 40) {
		pressingS = false;
	};
	if (e.keyCode == 65 || e.keyCode == 37) { // left
		pressingA = false;
	};
	if (e.keyCode == 68 || e.keyCode == 39) { // right
		pressingD = false;
	};
	if (e.keyCode == 32) {
		pressingSpace = false;
	};
	if (e.keyCode == 90) {
		pressingZ = false;
	};
	if (e.keyCode == 88) {
		pressingX = false;
	};
	if (e.keyCode == 67) {
		pressingC = false;
	};
	if (e.keyCode == 81 || e.keyCode == 79) {
		pressingQ = false;
	};
	if (e.keyCode == 69 || e.keyCode == 80) {
		pressingE = false;
	};
	if (e.keyCode == 16) {
		pressingLShift = false;
	};
	if (e.keyCode == 17) {
		pressingLCtrl = false;
	};
};

function handleButtonPress(action, index) {
  if (titleScreen.container.visible) {
    // let currentAssignAction = assignableActions[assigningButton];
    // if (currentAssignAction === 'PUNCH/WEAPON') {
    //   currentAssignAction = 'punch';
    // } else if (currentAssignAction === 'KICK') {
    //   currentAssignAction = 'kick';
    // } else if (currentAssignAction === 'THROW WEAPON') {
    //   currentAssignAction = 'throw';
    // }
    // // unbind current button
    // Object.values(userGamepad.buttonMappings).map((val, i) => {
    //   if (val.action === currentAssignAction) {
    //     userGamepad.buttonMappings[i].action = '';
    //   }
    // });
    // // bind new button
    // userGamepad.buttonMappings[index].action = currentAssignAction;
    // // show confirmation
    // document.getElementById('button-assigning').style.color = 'var(--kf-green)';
    // document.getElementById('button-assigning').innerText = 'OK!';
    // setTimeout(() => {
    //   document.getElementById('button-assigning').style.color = 'var(--kf-light-orange)';
    //   if (assigningButton < assignableActions.length - 1) {
    //     assigningButton++
    //     document.getElementById('button-assigning').innerText = assignableActions[assigningButton];
    //   } else {
    //     document.getElementById('gamepad-setup').classList.remove('showing')
    //     document.getElementById('dim-cover').classList.remove('showing')
    //     assigningButton = 0;
    //     document.getElementById('button-assigning').innerText = assignableActions[assigningButton];
    //   }
    // }, 320);
    // gameOptions.buttonMappings = userGamepad.buttonMappings;
  } else {
		pressButton(action);

  }
}
function releaseButton(action) {
  switch (action) {
    case 'rotateCCW': pressingQ = false; break;
    case 'rotateCW': pressingE = false; break;
    case 'left': pressingA = false; break;
    case 'right': pressingD = false; break;
    case 'up': pressingW = false; break;
    case 'down': pressingS = false; break;
  }
}

function pressButton(action) {
	console.log('erforming', action)
	switch (action) {
		case 'rotateCCW': 
			if (!pressingQ) {
				pressedQAt = counter;
			};
			pressingQ = true;
			break;
		case 'rotateCW': 
			if (!pressingE) {
				pressedEAt = counter;
			};
			pressingE = true;
			break;
		case 'left': 
			if (!pressingA) {
				pressedAAt = counter;
			};
			pressingA = true;
			break;
		case 'right': 
			if (!pressingD) {
				pressedDAt = counter;
			};
			pressingD = true;
			break;
		case 'up': 
			if (!pressingW) {
				pressedWAt = counter;
			};
			pressingW = true;
			break;
		case 'down': 
			if (!pressingS) {
				pressedSAt = counter;
			};
			pressingS = true;
			break;
	}
}
