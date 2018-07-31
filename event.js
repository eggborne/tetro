document.onkeydown = function(event) {
    
    if (event.keyCode == 16) {
        pressingShift = true;
    };
    if (event.keyCode == 81 || event.keyCode == 79) {
       if (!pressingQ) {
            pressedQAt = counter;
       };
        pressingQ = true;
    };
    if (event.keyCode == 87 || event.keyCode == 38) {
        if (!pressingW) {
            pressedWAt = counter;
        };
        pressingW = true;
    };
    if (event.keyCode == 69 || event.keyCode == 80) {
        pressedEAt = counter;
        pressingE = true;
    };
    if (event.keyCode == 83 || event.keyCode == 40) {
        if (!pressingS) {
            pressedSAt = counter;
            pressingS = true;
        }
    };
    if (event.keyCode == 65 || event.keyCode == 37) {
        if (!pressingA) {
            pressingA = true;
            pressedAAt = counter;
        }
    };
    if (event.keyCode == 68 || event.keyCode == 39) {
        if (!pressingD) {
            pressingD = true;
            pressedDAt = counter;
        }
    };
    if (event.keyCode == 90) {
        pressingZ = true;
        pressedZAt = counter;
    };
    if (event.keyCode == 88) {
        if (!pressingX) {
            pressedXAt = counter;
        };
        pressingX = true;
    };
    if (event.keyCode == 67) {
        pressingC = true;
    };
    if (event.keyCode == 32) {
        if (!pressingSpace) {
            pressedSpaceAt = counter;
        };
        pressingSpace = true;
    };
    if (event.keyCode == 16) {
        pressingLShift = true;
    };
    if (event.keyCode == 17) {
        pressingLCtrl = true;
    };
};

document.onkeyup = function(event) {
    if (event.keyCode == 16) {
        pressingShift = false;
    };
    if (event.keyCode == 87 || event.keyCode == 38) {
        pressingW = false;
    };
    if (event.keyCode == 83 || event.keyCode == 40) {
        pressingS = false;
    };
    if (event.keyCode == 65 || event.keyCode == 37) { // left
        pressingA = false;
    };
    if (event.keyCode == 68 || event.keyCode == 39) { // right
        pressingD = false;
    };
    if (event.keyCode == 32) {
        pressingSpace = false;
    };
    if (event.keyCode == 90) {
        pressingZ = false;
    };
    if (event.keyCode == 88) {
        pressingX = false;
    };
    if (event.keyCode == 67) {
        pressingC = false;
    };
    if (event.keyCode == 81 || event.keyCode == 79) {
        pressingQ = false;
    };
    if (event.keyCode == 69 || event.keyCode == 80) {
        pressingE = false;
    };
    if (event.keyCode == 16) {
        pressingLShift = false;
    };
    if (event.keyCode == 17) {
        pressingLCtrl = false;
    };
};

