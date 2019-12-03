function fullscreen() {
  var el = document.getElementById('container');

  if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else {
    el.mozRequestFullScreen();
  }
}

function exitFullscreen() {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function createEmptyGrid() {
  grid = new Array(20);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = emptyLine();
  }
}

function emptyLine() {
  var line = new Array(blocksPerWidth);
  for (var k = 0; k < line.length; k++) {
    line[k] = 0;
  }
  return line;
}

function lowestRowOccupied() {
  lowest = 19;
  for (var i = 19; i > 0; i--) {
    var row = grid[i];
    for (var k = 0; k < blocksPerWidth - 1; k++) {
      if (row[k] !== 0) {
        lowest = i;
      }
    }
  }
  return lowest;
}

function bgPanel(position, container) {
  if (position === 'top') {
    var panel = new PIXI.Sprite(bg22x2TopText);
    panel.width = (blockSize * 22) / 1.2;
    panel.height = (blockSize * 2) / 1.2;
    panel.x += window.innerWidth / 2 - panel.width / 2;
  }
  if (position === 'left') {
    var panel = new PIXI.Sprite(bg22x2SideText);
    var panel2 = new PIXI.Sprite(bg22x2SideText);
    panel.width = panel2.width = (blockSize * 2) / 1.2;
    panel.height = panel2.height = (blockSize * 22) / 1.2;

    panel.x += margin - panel.width + borderBuffer / 2;
    panel.y += topSpace - blockSize / 1.2;
    panel2.x += margin - panel.width + borderBuffer / 2;
    panel2.y += panel.height + topSpace - blockSize / 1.2;
    container.addChildAt(panel2, 0); // so that 4 line flash is over it
  }
  if (position === 'right') {
    var panel = new PIXI.Sprite(bg22x2SideText);
    var panel2 = new PIXI.Sprite(bg22x2SideText);
    var panel3 = new PIXI.Sprite(bg22x2SideText);
    var panel4 = new PIXI.Sprite(bg22x2SideText);
    var panel5 = new PIXI.Sprite(bg22x2SideText);
    panel.width = panel2.width = panel3.width = panel4.width = panel5.width =
      (blockSize * 2) / 1.2;
    panel.height = panel2.height = panel3.height = panel4.height = panel5.height =
      (blockSize * 22) / 1.2;

    panel.x += margin + playfield.sizeX + sideBarWidth - borderBuffer / 2;
    panel.y += topSpace;
    panel2.x += margin + playfield.sizeX + sideBarWidth - borderBuffer / 2;
    panel2.y += panel.height + topSpace - blockSize / 1.2;
    panel3.x = panel.x - panel.width - borderBuffer / 2;
    panel3.y += topSpace * 3;
    panel4.x = panel3.x - panel.width - borderBuffer / 2;
    panel4.y += topSpace * 3 + miniBlockSize * 8;
    panel5.x = panel3.x - panel.width;
    panel5.scale.x *= -1;
    panel5.y += topSpace * 3 + miniBlockSize * 3;

    container.addChildAt(panel3, 0);
    container.addChildAt(panel4, 0);
    container.addChildAt(panel2, 0);

    container.addChildAt(panel5, 0);
  }
  container.addChildAt(panel, 0);
}

function setUpDisplays() {
  totalWidth = playfield.sizeX + sideBarWidth;
  sideBarSeam = container.width - sideBarWidth;
  queueDisplay = new SideDisplay(
    sideBarWidth,
    queueSlotHeight * 2 + miniBlockSize * 2 - mainBorderThickness,
    nextText,
    'small',
    mainBorderThickness
  );
  levelDisplay = new SideDisplay(
    sideBarWidth,
    miniBlockSize * 6,
    levelText,
    'small',
    mainBorderThickness / 2
  );
  statDisplay = new SideDisplay(
    sideBarWidth,
    miniBlockSize * 16,
    levelText,
    'small',
    mainBorderThickness / 2
  );
  scoreDisplay = new SideDisplay(
    sideBarWidth,
    miniBlockSize * 11,
    topText,
    'small',
    mainBorderThickness / 2
  );

  linesDisplay = new SideDisplay(
    totalWidth - sideBarWidth,
    topSpace,
    linesText,
    'small',
    mainBorderThickness / 2
  );
  linesDisplay.container.x = -playfield.container.width;
  linesDisplay.container.y = -topSpace;
  linesDisplay.label.x = 0;
  linesDisplay.label.y = 0;

  lineScore = new TextNumeral(
    linesDisplay.label.height,
    0,
    topSpace / 2 - miniBlockSize / 2,
    0,
    3
  );
  linesDisplay.label.y += topSpace / 2 - linesDisplay.label.height / 2;
  linesDisplay.label.x +=
    (window.innerWidth - (playfield.sizeX + sideBarWidth)) / 2;
  lineScore.container.x +=
    miniBlockSize / 4 +
    linesDisplay.label.width +
    (window.innerWidth - (playfield.sizeX + sideBarWidth)) / 2;
  linesDisplay.fullHeader = new PIXI.Container();
  linesDisplay.fullHeader.addChild(linesDisplay.label);
  linesDisplay.fullHeader.addChild(lineScore.container);

  linesDisplay.fullHeader.x +=
    linesDisplay.container.width / 2 - linesDisplay.fullHeader.width / 2;
  stage.addChild(linesDisplay.fullHeader);
  scoreDisplay.container.y = 0;
  queueDisplay.container.y = scoreDisplay.bg.height;
  statDisplay.container.y =
    scoreDisplay.bg.height + queueDisplay.bg.height + levelDisplay.bg.height;
  statDisplay.label.visible = false;
  statDisplay.members = [];
  for (var p = 0; p < pieceTypes.length; p++) {
    var piece = new Tetro(pieceTypes[p], currentLevel);
    piece.container.scale.x = piece.container.scale.y = 0.25;
    piece.container.x = statDisplay.bg.x + miniBlockSize * 1.5;
    piece.container.y =
      statDisplay.container.y + miniBlockSize * 4 + miniBlockSize * 2.1 * p;
    piece.label = new TextNumeral(
      miniBlockSize * 0.75,
      piece.container.x + miniBlockSize * 2.75,
      piece.container.y + miniBlockSize * 0.75,
      0,
      3,
      0xe05000
    );
    stage.removeChild(piece.label.container);
    pieceContainer.addChild(piece.label.container);
    statDisplay.members.push(piece);
    if (piece.type === 'eye') {
      piece.container.x -= miniBlockSize / 4;
      piece.container.y -= miniBlockSize / 4;
    }
    if (piece.type === 'owe') {
      piece.container.x += miniBlockSize / 4;
      piece.container.y += miniBlockSize / 2;
    }
  }

  pieceIndex = 0;
  released = 0;

  levelDisplay.container.y = scoreDisplay.bg.height + queueDisplay.bg.height;
  queueDisplay.label.x =
    queueDisplay.bg.x + (queueDisplay.bg.width - queueDisplay.label.width) / 2;
  levelDisplay.label.x =
    levelDisplay.bg.x + (levelDisplay.bg.width - levelDisplay.label.width) / 2;
  scoreLabel = new PIXI.Sprite(scoreText);
  scoreLabel.hwRatio = scoreLabel.height / scoreLabel.width;
  scoreLabel.height = miniBlockSize;
  scoreLabel.width = scoreLabel.height / scoreLabel.hwRatio;
  scoreLabel.x = scoreDisplay.label.x;
  scoreLabel.y = scoreDisplay.label.y + miniBlockSize * 4.5;
  scoreDisplay.container.addChild(scoreLabel);

  topScoreNumber = new TextNumeral(
    scoreLabel.height,
    playfield.sizeX + scoreDisplay.border.thickness + borderBuffer,
    scoreDisplay.label.y + miniBlockSize * 1.5,
    10000,
    6
  );

  playerScoreNumber = new TextNumeral(
    scoreLabel.height,
    playfield.sizeX + scoreDisplay.border.thickness + borderBuffer,
    scoreDisplay.label.y + miniBlockSize * 6,
    playerScore,
    6
  );

  levelScore = new TextNumeral(
    levelDisplay.label.height,
    levelDisplay.label.x + levelDisplay.label.width / 2,
    miniBlockSize / 2 +
      scoreDisplay.bg.height +
      queueDisplay.bg.height +
      levelDisplay.bg.height,
    currentLevel,
    2
  );
  levelScore.container.x -= levelScore.container.width / 2;

  if (totalWidth + blockSize >= window.innerWidth) {
    var difference = window.innerWidth - totalWidth;
    container.width += difference;
  } else {
    margin = (window.innerWidth - totalWidth) / 2;
    container.x += margin;
  }
  if (playfield.sizeY >= window.innerHeight) {
    container.width += window.innerHeight - playfield.sizeY;
  }
  leftBG = bgPanel('left', stage);
  topBG = bgPanel('top', stage);
  rightBG = bgPanel('right', stage);

  pauseButton = new TextButton(
    playfield,
    'PAUSE',
    'yellow',
    0.25,
    playfield.startStyle,
    0,
    -miniBlockSize / 4
  );
  pauseButton.bg.tint = 0x555555;
  pauseButton.container.x = playfield.container.width;
  pauseButton.container.y =
    playfield.container.x - pauseButton.container.height / 2;
  pauseButton.container.interactive = true;
  pauseButton.container.on('pointerdown', function() {
    pauseScreen.container.visible = true;
    started = false;
  });
}

function updateStatArea() {
  for (var s = 0; s < statDisplay.members.length; s++) {
    var piece = statDisplay.members[s];
    piece.label.changeNumber(pieceStats[piece.type]);
  }
}
function changeStatColor(newColor) {
  for (var s = 0; s < statDisplay.members.length; s++) {
    var piece = statDisplay.members[s];
    piece.changeColor(newColor);
  }
}

flashBG = function() {
  if (counter % 2 === 0) {
    fourLineFlasher.visible = true;
  } else {
    fourLineFlasher.visible = false;
  }
};

function lineCover(row) {
  var cover = new PIXI.Sprite(pixelText);
  cover.anchor.x = 0.5;

  cover.tint = pieceBG.tint;
  cover.width = blockSize;
  cover.height = blockSize;
  cover.x = pieceBG.width / 2;
  cover.y = pieceBG.y + row * blockSize;
  return cover;
}

function removeLine(row) {
  for (var i = 0; i < blocksPerWidth; i++) {
    grid[row][i].owner.container.removeChild(grid[row][i].container);
    grid[row][i] = 0;
    for (var k = row; k > 0; k--) {
      grid[k][i] = grid[k - 1][i];
      if (grid[k - 1][i] !== 0) {
        grid[k - 1][i].container.y += Math.floor(blockSize);
      }
    }
  }
}

function TextNumeral(size, posX, posY, num, digits, color, interactive) {
  this.container = new PIXI.Container();
  var numArray = num.toString().split('');
  var zeroArray = [];

  if (numArray.length < digits) {
    numArray.reverse();
    while (numArray.length < digits) {
      numArray.push('0');
    }
    numArray.reverse();
  }
  for (var k = 0; k < digits; k++) {
    var numeralSprite = new PIXI.Sprite(numerals[numArray[k]]);
    if (color) {
      numeralSprite.tint = color;
    }
    numeralSprite.width = numeralSprite.height = size;
    numeralSprite.x = posX + numeralSprite.width * 1.1 * k;
    numeralSprite.y = posY;
    this.container.addChild(numeralSprite);
  }
  if (digits === 3) {
    // if line counter set reference to stage instead
    stage.addChild(this.container);
  } else if (digits > 1) {
    pieceContainer.addChild(this.container);
  }

  this.changeNumber = function(newNumber) {
    var newNumArray = newNumber.toString().split('');
    if (newNumArray.length < digits) {
      newNumArray.reverse();
      while (newNumArray.length < digits) {
        newNumArray.push('0');
      }
      newNumArray.reverse();
    }
    this.container.removeChildren();
    for (var k = 0; k < digits; k++) {
      var numeralSprite = new PIXI.Sprite(numerals[newNumArray[k]]);
      if (color) {
        numeralSprite.tint = color;
      }
      numeralSprite.width = numeralSprite.height = size;
      numeralSprite.x = posX + numeralSprite.width * 1.1 * k;
      numeralSprite.y = posY;
      this.container.addChild(numeralSprite);
    }
  };
  if (interactive) {
    //        this.container.interactive = true;
    //        this.container.buttonMode = true;
    //        this.container.on("touchstart",function(){
    //            levelBox.highlighter.x = numeralSprite.x-(levelBox.highlighter.width/4);
    //            levelBox.highlighter.y = numeralSprite.y-(levelBox.highlighter.width/4);
    //            currentLevel = num;
    //            changeBlockColorsToLevel(colorForLevel(currentLevel));
    //            selectSound.play();
    //
    //        })
    //        this.container.on("mousedown",function(){
    //            levelBox.highlighter.x = numeralSprite.x-(levelBox.highlighter.width/4);
    //            levelBox.highlighter.y = numeralSprite.y-(levelBox.highlighter.width/4);
    //            currentLevel = num;
    //            changeBlockColorsToLevel(colorForLevel(currentLevel));
    //            selectSound.play();
    //
    //        })
  }
}

function SideDisplay(width, height, labelText, border, bThickness) {
  this.container = new PIXI.Container();
  this.label = new PIXI.Sprite(labelText);
  this.label.hwRatio = this.label.height / this.label.width;
  this.label.height = miniBlockSize;
  this.label.width = this.label.height / this.label.hwRatio;
  this.bg = new PIXI.Sprite(pixelText);
  this.bg.width = width;
  this.bg.height = height;
  this.container.addChild(this.bg);
  this.bg.x = playfield.container.x + playfield.sizeX;
  this.bg.y = topSpace;
  this.bg.tint = 0x000000;
  // this.bg.tint = pieceBG.tint;

  this.border = new Border(
    borders[border],
    bThickness,
    this,
    this.bg.width,
    this.bg.height,
    this.bg.x,
    this.bg.y
  );

  var leftBuffer = (this.bg.width - bThickness * 2 - this.label.width) / 2;
  this.label.x = playfield.sizeX + bThickness + borderBuffer;
  this.label.y = this.bg.y + bThickness + borderBuffer * 2;
  this.container.y = 0;
  if (labelText === linesText) {
    stage.addChild(this.label);
  } else {
    this.container.addChild(this.label);
  }
  pieceContainer.addChild(this.container);
}

function Border(
  texture,
  thickness,
  owner,
  sizeX,
  sizeY,
  posX,
  posY,
  dotted,
  dottedColor
) {
  this.container = new PIXI.Container();
  this.thickness = thickness;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.posX = posX;
  this.posY = posY;
  var UL = new PIXI.Sprite(texture.corner);
  UL.x = posX;
  UL.y = posY;
  var UR = new PIXI.Sprite(texture.corner);
  var LL = new PIXI.Sprite(texture.corner);
  var LR = new PIXI.Sprite(texture.corner);
  if (dotted) {
    UL.tint = UR.tint = LL.tint = LR.tint = dottedColor;
  }
  UL.height = UL.width = UR.height = UR.width = LL.height = LL.width = LR.height = LR.width = thickness;

  UR.x = LR.x = posX + sizeX - thickness;
  LL.y = LR.y = posY + sizeY - thickness;
  UL.y = UR.y = posY;
  LL.x = UL.x = posX;

  UR.scale.x *= -1;
  UR.x += thickness;
  LL.scale.y *= -1;
  LL.y += thickness;
  LR.scale.y *= -1;
  LR.scale.x *= -1;
  LR.y += thickness;
  LR.x += thickness;

  if (dotted) {
    var sectionsNeededX = Math.ceil((sizeX - thickness * 2) / thickness);
    var sectionsNeededY = Math.ceil((sizeY - thickness * 2) / thickness);
    var top = new PIXI.Container();
    var bottom = new PIXI.Container();
    var left = new PIXI.Container();
    var right = new PIXI.Container();
    for (var i = 0; i < sectionsNeededX; i++) {
      var currentTopSection = new PIXI.Sprite(texture.plank);
      currentTopSection.tint = dottedColor;
      currentTopSection.height = currentTopSection.width = thickness;
      currentTopSection.x = UL.x + thickness * i;
      currentTopSection.y = UL.y;
      top.addChild(currentTopSection);
      var currentBottomSection = new PIXI.Sprite(texture.plank);
      currentBottomSection.tint = dottedColor;
      currentBottomSection.height = currentBottomSection.width = thickness;
      currentBottomSection.x = UL.x + thickness * i;
      currentBottomSection.y = UL.y;
      currentBottomSection.scale.y *= -1;
      currentBottomSection.y += thickness;
      bottom.addChild(currentBottomSection);
    }
    for (var i = 0; i < sectionsNeededY; i++) {
      var currentLeftSection = new PIXI.Sprite(texture.plank);
      currentLeftSection.tint = dottedColor;
      currentLeftSection.height = currentLeftSection.width = thickness;
      currentLeftSection.x = UL.x;
      currentLeftSection.y = UL.y + thickness * i;
      currentLeftSection.rotation += Math.PI / 2;
      currentLeftSection.scale.y *= -1;
      left.addChild(currentLeftSection);
      var currentRightSection = new PIXI.Sprite(texture.plank);
      currentRightSection.tint = dottedColor;
      currentRightSection.height = currentRightSection.width = thickness;
      currentRightSection.x = UL.x;
      currentRightSection.y = currentLeftSection.y;
      currentRightSection.rotation += Math.PI / 2;
      currentRightSection.x += thickness;
      right.addChild(currentRightSection);
    }

    top.x = bottom.x = UL.x + thickness;
    top.y = UL.y;
    bottom.y = posY + sizeY - thickness;
    left.x = UL.x;
    left.y = right.y = UL.y + thickness;
    right.x = posX + sizeX - thickness;
  } else {
    var top = new PIXI.Sprite(texture.plank);
    var bottom = new PIXI.Sprite(texture.plank);
    var left = new PIXI.Sprite(texture.plank);
    var right = new PIXI.Sprite(texture.plank);

    top.height = bottom.height = left.height = right.height = thickness;
    top.width = bottom.width = sizeX - thickness * 2;
    left.width = right.width = sizeY - thickness * 2;

    top.x = bottom.x = UL.x + thickness;
    top.y = UL.y;
    bottom.y = posY + sizeY - thickness;
    left.x = UL.x;
    left.y = right.y = UL.y + thickness;
    right.x = posX + sizeX - thickness;

    left.rotation += Math.PI / 2;
    left.scale.y *= -1;
    right.rotation += Math.PI / 2;
    right.x += thickness;

    bottom.scale.y *= -1;
    bottom.y += thickness;
  }

  //    left.rotation += Math.PI/2;
  //    left.scale.y *= -1;
  //    right.rotation += Math.PI/2;
  //    right.x += thickness;
  //
  //    bottom.scale.y *= -1;
  //    bottom.y += thickness;
  //

  this.container.addChild(top);
  this.container.addChild(bottom);
  this.container.addChild(left);
  this.container.addChild(right);
  this.container.addChild(UL);
  this.container.addChild(UR);
  this.container.addChild(LL);
  this.container.addChild(LR);
  owner.container.addChild(this.container);
}

function Playfield(posX, posY, sizeX, sizeY, border, borderThickness) {
  this.startStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.5 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  this.container = new PIXI.Container();
  this.container.x = posX;
  this.container.y = posY;
  this.sizeX = sizeX;
  this.sizeY = sizeY;

  container.addChild(pieceContainer);

  this.border = new Border(
    borders[border],
    borderThickness,
    this,
    sizeX,
    sizeY,
    posX,
    posY
  );

  // gridLines = new PIXI.Sprite(gridText);

  pieceBG = new PIXI.Sprite(pixelText);
  if (skin === 'NES') {
    pieceBG.tint = 0x000000;
  } else {
    pieceBG.tint = 0xf8f8f8;
  }

  pieceBG.width = sizeX - borderThickness * 2;
  pieceBG.height = sizeY - borderThickness * 2;
  pieceBG.x = this.container.x + borderThickness;
  pieceBG.y = topSpace + borderThickness;
  pieceBG.alpha = 1;

  gridLines = new PIXI.Container();
  for (var i = 0; i < 21; i++) {
    var horiz = new PIXI.Sprite(pixelText);
    horiz.tint = 0x252525;
    horiz.width = pieceBG.width;
    horiz.height = blockSize / 20;
    horiz.x = pieceBG.x;
    horiz.y = pieceBG.y + blockSize * i;
    // gridLines.addChild(horiz)
    if (i < 11) {
      var vert = new PIXI.Sprite(pixelText);
      vert.tint = horiz.tint;
      vert.width = horiz.height;
      vert.height = pieceBG.height;
      vert.x = pieceBG.x + blockSize * i;
      vert.y = pieceBG.y;
      gridLines.addChild(vert);
    }
  }

  pieceContainer.addChild(pieceBG);
  pieceContainer.addChild(gridLines);
  if (pieceGrid) {
    gridLines.alpha = 1;
  } else {
    gridLines.alpha = 0;
  }
  container.interactive = true;

  container.touchstart = function(event) {
    this.data = event.data;
    touchingAt = this.data.getLocalPosition(this);
    startedDragLocation = touchingAt;
    startedDragTime = counter;
    endedDragLocation = undefined;
    endedDragTime = undefined;
  };
  container.touchmove = function(event) {
    this.data = event.data;
    touchingAtLastFrame = touchingAt;
    touchingAt = this.data.getLocalPosition(this);
  };
  container.touchend = function() {
    endedDragLocation = touchingAt;
    endedDragTime = counter;
    if (
      atBat &&
      startedDragTime > atBat.lastShifted &&
      endedDragLocation.y - startedDragLocation.y > dropDragDistance &&
      endedDragTime - startedDragTime < dropDragMinTime
    ) {
      atBat.dropped = true;
      atBat.fallSpeed = forcedFallRate;
    }
    if (
      atBat &&
      atBat.fallSpeed !== forcedFallRate &&
      counter - startedDragTime < 10
    ) {
      var offCenterBy = Math.abs(
        atBat.container.x + atBat.anchorPoint[0] * blockSize - touchingAt.x
      );
      if (
        !cancelledDrop &&
        offCenterBy > blockSize / 2 &&
        touchingAt.x > atBat.container.x + atBat.anchorPoint[0] * blockSize
      ) {
        atBat.turn('cw', true);
      } else {
        cancelledDrop = false;
      }
      if (
        !cancelledDrop !== counter - 1 &&
        offCenterBy > blockSize / 2 &&
        touchingAt.x < atBat.container.x + atBat.anchorPoint[0] * blockSize
      ) {
        atBat.turn('ccw', true);
      } else {
        cancelledDrop = false;
      }
    }
    touchingAt = undefined;
    startedDragLocation = undefined;
    startedDragTime = undefined;
  };

  container.addChild(this.container);
}

function Curtain() {
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);
  //    this.container.addChild(this.bg);
  this.bg.width = blockSize * 10;
  this.bg.height = blockSize * 20;
  this.bg.x = pieceBG.x;
  this.bg.y = pieceBG.y;
  this.bg.tint = 0xff0000;
  this.bg.visible = false;
  this.barsDropped = 0;

  for (var i = 0; i < grid.length; i++) {
    var bar = new PIXI.Container();
    var bg = new PIXI.Sprite(pixelText);
    var white = new PIXI.Sprite(pixelText);
    var top = new PIXI.Sprite(pixelText);
    var bottom = new PIXI.Sprite(pixelText);
    bar.addChild(bg);
    bar.addChild(white);
    bar.addChild(top);
    bar.addChild(bottom);
    bg.width = this.bg.width;
    white.width = this.bg.width - blockSize * 0.1;
    top.width = bottom.width = white.width;
    bg.height = blockSize;
    white.height = blockSize * 0.9;
    top.height = bottom.height = white.height / 3.5;
    bg.x = this.bg.x;
    white.x = this.bg.x + blockSize * 0.05;
    top.x = bottom.x = white.x;
    bg.y = this.bg.y + blockSize * 0.05 + blockSize * i;
    white.y = bg.y;
    top.y = white.y;
    bottom.y = white.y + white.height - bottom.height;
    bg.tint = 0x000000;
    white.tint = 0xffffff;
    top.tint = colors[colorForLevel(currentLevel)][0];
    bottom.tint = colors[colorForLevel(currentLevel)][1];
    this.container.addChild(bar);
    bar.visible = false;
  }

  this.drop = function() {
    var timeSinceLost = counter - lost;
    if (
      timeSinceLost > 36 &&
      this.barsDropped < 20 &&
      timeSinceLost % 4 === 0
    ) {
      this.container.children[this.barsDropped].visible = true;
      this.barsDropped++;
    }
  };

  pieceContainer.addChild(this.container);

  this.container.on('pointerdown', function() {
    // this.visible = false
    sendLinesScoredToDatabase(lineCount);
    getScoresFromDatabase(gameName + '-' + gameMode);
  });
}

changeBlockColorsToLevel = function(levelColors) {
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (
      block.ownerType !== 'eye' &&
      block.ownerType !== 'owe' &&
      block.ownerType !== 'tee'
    ) {
      if (block.ownerType === 'ell' || block.ownerType === 'zee') {
        block.bg.tint = block.middle.tint = colors[levelColors][0];
      } else {
        block.bg.tint = block.middle.tint = colors[levelColors][1];
      }
    } else {
      block.bg.tint = colors[levelColors][1];
    }
  }
};

function changeBlockVisibility(onOrOff) {
  for (var i = 0; i < obscuredBlocks.length; i++) {
    var block = obscuredBlocks[i];
    block.container.visible = onOrOff;
  }
}


function TitleScreen() {
  this.startStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.8 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.logo = new PIXI.Sprite(tetrisLogoText);
  this.castle = new PIXI.Sprite(castleText);

  if (window.innerWidth < window.innerHeight) {
    this.bg.width = window.innerWidth;
    this.bg.height = window.innerHeight;
    this.container.x += this.bg.width / 2;
    this.container.y += this.bg.height / 2;
    //        this.bg.x = this.container.x;
    //        this.bg.y = this.container.y;
  } else {
    this.bg.width = stage.width;
    this.bg.height = window.innerHeight;
    this.container.x += this.bg.width / 2;
    this.container.y += this.bg.height / 2;
    this.container.x += window.innerWidth / 2 - this.bg.width / 2;
    //        this.bg.x = this.container.x;
    //        this.bg.y = this.container.y;
  }
  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.logo.HWRatio = this.logo.height / this.logo.width;
  this.logo.width = this.bg.width - frameX;
  this.logo.height = this.logo.width * this.logo.HWRatio;

  this.castle.HWRatio = this.castle.height / this.castle.width;
  this.castle.width = this.logo.width / 2;
  this.castle.height = this.castle.width * this.castle.HWRatio;

  this.logo.x = this.bg.width / 2 - this.logo.width / 2;
  this.logo.y = this.logo.x - this.logo.width / 48;

  // this.border = new Border(borders["blue"],mainBorderThickness,this,this.bg.width,window.innerHeight,0,0);

  this.castleContainer = new PIXI.Container();
  this.castle.anchor.set(0.5);

  this.castleFlameLeft = new PIXI.Sprite(castleFlameText);
  this.castleFlameRight = new PIXI.Sprite(castleFlameText);
  this.castleContainer.addChild(this.castleFlameLeft);
  this.castleContainer.addChild(this.castleFlameRight);
  this.castleContainer.addChild(this.castle);

  this.castleContainer.pivot.x = this.castleContainer.width / 2;
  this.castleContainer.pivot.y = this.castleContainer.height / 2;
  this.castle.x = this.castleContainer.pivot.x;
  this.castle.y = this.castleContainer.pivot.y;

  this.castleFlameLeft.width = this.castleFlameLeft.height = this.castleFlameRight.width = this.castleFlameRight.height =
    this.castle.width / 5;
  this.castleFlameRight.scale.x *= -1;

  this.castleFlameLeft.y = this.castleFlameRight.y =
    this.castle.y + this.castle.height / 2 + borderBuffer;
  this.castleFlameRight.x = this.castle.x + this.castleFlameLeft.width * 1.5;
  this.castleFlameLeft.x = this.castle.x - this.castleFlameLeft.width * 1.5;

  this.castleContainer.x =
    this.bg.width / 2 -
    this.castleContainer.width / 2 +
    this.castleContainer.width / 2;
  this.castleContainer.y =
    window.innerHeight -
    this.castleContainer.height -
    this.logo.height / 1.5 +
    this.castleContainer.height / 2;

  this.spaceContainer = new PIXI.Container();
  this.space1 = new PIXI.Sprite(bgText);
  this.space2 = new PIXI.Sprite(bgText);
  this.space3 = new PIXI.Sprite(bgText);
  this.space1.width = this.space2.width = this.space3.width = this.bg.width;
  this.space1.height = this.space2.height = this.space3.height = this.bg.height;
  this.space1.x = this.space2.x = this.space3.x = this.bg.x;
  this.space1.y = -(this.space1.height * 2);
  this.space2.y = -this.space1.height;
  this.space1.y = 0;

  this.spaceContainer.width = this.bg.width;
  this.spaceContainer.height = this.bg.height;
  this.spaceContainer.x = this.bg.x;
  this.spaceContainer.y = this.bg.y;
  this.spaceContainer.addChild(this.space1);
  this.spaceContainer.addChild(this.space2);
  this.spaceContainer.addChild(this.space3);
  //    this.spaceContainer.alpha = 0;

  this.container.addChild(this.spaceContainer);
  this.container.addChild(this.logo);
  this.container.addChild(this.castleContainer);

  if (window.innerWidth < window.innerHeight) {
    this.playButton = new TextButton(
      this,
      'START',
      'red',
      1,
      this.startStyle,
      blockSize,
      miniBlockSize * 0.25
    );
    this.optionsButton = new TextButton(
      this,
      'OPTIONS',
      'blue',
      1,
      this.startStyle,
      blockSize,
      miniBlockSize * 0.25
    );
    this.highScoresButton = new TextButton(
      this,
      'HIGH SCORES',
      'yellow',
      0.75,
      this.startStyle,
      blockSize,
      miniBlockSize * 0.25
    );

    this.playButton.container.x =
      this.bg.width / 2 - this.playButton.container.width / 2;
    this.optionsButton.container.x =
      this.bg.width / 2 - this.optionsButton.container.width / 2;
    this.highScoresButton.container.x =
      this.bg.width / 2 - this.highScoresButton.container.width / 2;
    this.playButton.container.y = this.logo.y + this.logo.height + blockSize;
    this.optionsButton.container.y =
      this.playButton.container.y + this.optionsButton.container.height * 1.25;
    this.highScoresButton.container.y =
      this.optionsButton.container.y +
      this.highScoresButton.container.height * 1.25;
  } else {
    this.playButton = new TextButton(
      this,
      'START',
      'red',
      1,
      this.startStyle,
      0,
      miniBlockSize * 0.25
    );
    this.optionsButton = new TextButton(
      this,
      'OPTIONS',
      'blue',
      1,
      this.startStyle,
      0,
      miniBlockSize * 0.25
    );
    this.highScoresButton = new TextButton(
      this,
      'HIGH SCORES',
      'yellow',
      0.75,
      this.startStyle,
      0,
      miniBlockSize * 0.25
    );

    this.playButton.container.y = this.optionsButton.container.y =
      this.logo.y + this.logo.height + blockSize;
    this.playButton.container.x = blockSize * 2.5;
    this.optionsButton.container.x =
      this.bg.width - this.optionsButton.container.width - blockSize * 2.5;
    this.highScoresButton.container.x =
      this.bg.width / 2 - this.highScoresButton.container.width / 2;
    this.highScoresButton.container.y =
      this.optionsButton.container.y +
      this.highScoresButton.container.height * 1.25;
  }

  highScoreStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: this.logo.height / 8 + 'px',
    fill: '#ffffff',
    align: 'center'
  };
  totalLinesStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: this.logo.height / 10 + 'px',
    fill: '#ffffff',
    align: 'center'
  };
  this.totalLineCount = new PIXI.Text(
    'total lines scored: ' + lastKnownCount,
    totalLinesStyle
  );
  this.totalLineCount.anchor.set(0.5);
  this.totalLineCount.x = this.container.width / 2;
  this.totalLineCount.y = window.innerHeight - this.totalLineCount.height;

  this.container.addChild(this.totalLineCount);

  this.playButton.container.interactive = this.optionsButton.container.interactive = this.highScoresButton.container.interactive = true;

  this.playButton.container.on('pointerdown', function() {
    if (!optionsScreen || !optionsScreen.container.visible) {
      this.tint = 0xffffff;
      gameSelectScreen.container.visible = true;
      titleScreen.container.fading = true;
      if (SFXOn) {
        confirmSound.play();
      }
      if (BGMusic !== undefined) {
        BGMusic.normal.play();
      }
    }
  });

  this.optionsButton.container.on('pointerdown', function() {
    if (!optionsScreen) {
      optionsScreen = new OptionsScreen();
    } else {
      optionsScreen.container.visible = true;
    }
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.highScoresButton.container.on('pointerdown', function() {
    if (!optionsScreen.container.visible) {
      highScoreScreen.container.visible = true;
      if (SFXOn) {
        confirmSound.play();
      }
    }
  });

  this.fading = false;

  this.fade = function() {
    //        titleScreen.container.rotation += Math.PI/16;
    // this.container.scale.x -= 0.075;
    // this.container.scale.y -= 0.075;
    // this.container.alpha -= 0.05;
    // if (this.container.alpha <= 0.05 || this.container.scale.x <= 0.075) {
    this.container.visible = false;
    //     this.container.rotation = 0;
    //     this.container.alpha = 1;
    //     this.container.scale.x = this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };
  stage.addChild(this.container);
}

function GameSelectScreen() {
  this.headerTextStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: miniBlockSize * 1.5 + 'px',
    fill: '#ffffff'
  };
  this.selectionTextStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: miniBlockSize * 1.5 + 'px',
    fill: '#ffffff'
  };

  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = bgColor;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    //        titleScreen.container.rotation += Math.PI/16;
    //         this.container.scale.x += 0.08;
    // //        this.container.scale.y += 0.075;
    //         this.container.alpha -= 0.06;
    //         if (this.container.alpha <= 0.06) {
    this.container.visible = false;
    // this.container.rotation = 0;
    // this.container.alpha = 1;
    // this.container.scale.x = 1;
    this.container.fading = false;
    // }
  };

  this.okButton = new TextButton(
    this,
    'OK',
    'fancy',
    1,
    this.headerTextStyle,
    blockSize * 4,
    miniBlockSize * 0.5
  );
  this.okButton.container.x =
    this.bg.x + this.bg.width / 2 - this.okButton.bg.width / 2;
  this.okButton.container.y =
    window.innerHeight - miniBlockSize * 2 - this.okButton.bg.height;
  this.container.addChild(this.okButton.container);

  stage.addChildAt(
    this.container,
    stage.children.indexOf(titleScreen.container)
  );
  this.gameTypeBox = new TextButton(
    this,
    'GAME TYPE',
    'yellow',
    1,
    this.headerTextStyle,
    blockSize * 5,
    miniBlockSize * 0.25
  );
  this.gameTypeBox.container.x =
    this.bg.x + this.bg.width / 2 - this.gameTypeBox.bg.width / 2;
  this.gameTypeBox.container.y = miniBlockSize * 2;
  this.container.addChild(this.gameTypeBox.container);

  var endlessLeg = new PIXI.Text('ENDLESS', this.selectionTextStyle);
  gameSelectionBox1 = new borderedLabelBox(
    endlessLeg,
    'red',
    mainBorderThickness,
    borderBuffer * 2,
    borderBuffer * 1.5,
    true
  );
  gameSelectionBox1.container.x =
    this.bg.x + this.bg.width / 2 - gameSelectionBox1.bg.width / 2;
  gameSelectionBox1.container.y =
    this.gameTypeBox.container.y + miniBlockSize * 5;
  this.container.addChild(gameSelectionBox1.container);

  var survivalLeg = new PIXI.Text('SURVIVAL', this.selectionTextStyle);
  gameSelectionBox2 = new borderedLabelBox(
    survivalLeg,
    'blue',
    mainBorderThickness,
    borderBuffer,
    borderBuffer * 1.5,
    true
  );
  gameSelectionBox2.container.x =
    this.bg.x + this.bg.width / 2 - gameSelectionBox2.bg.width / 2;
  gameSelectionBox2.container.y =
    gameSelectionBox1.container.y + miniBlockSize * 5;
  this.container.addChild(gameSelectionBox2.container);

  var timedLeg = new PIXI.Text('TIMED', this.selectionTextStyle);
  gameSelectionBox3 = new borderedLabelBox(
    timedLeg,
    'green',
    mainBorderThickness,
    borderBuffer * 4,
    borderBuffer * 1.5,
    true
  );
  gameSelectionBox3.container.x =
    this.bg.x + this.bg.width / 2 - gameSelectionBox3.bg.width / 2;
  gameSelectionBox3.container.y =
    gameSelectionBox2.container.y + miniBlockSize * 5;
  this.container.addChild(gameSelectionBox3.container);

  if (gameMode === 'endless') {
    gameSelectionBox2.container.leftSelectArrow.visible = false;
    gameSelectionBox2.container.rightSelectArrow.visible = false;
    gameSelectionBox3.container.leftSelectArrow.visible = false;
    gameSelectionBox3.container.rightSelectArrow.visible = false;
  } else if (gameMode === 'survival') {
    gameSelectionBox1.container.leftSelectArrow.visible = false;
    gameSelectionBox1.container.rightSelectArrow.visible = false;
    gameSelectionBox3.container.leftSelectArrow.visible = false;
    gameSelectionBox3.container.rightSelectArrow.visible = false;
  } else if (gameMode === 'timed') {
    gameSelectionBox1.container.leftSelectArrow.visible = false;
    gameSelectionBox1.container.rightSelectArrow.visible = false;
    gameSelectionBox2.container.leftSelectArrow.visible = false;
    gameSelectionBox2.container.rightSelectArrow.visible = false;
  }

  gameSelectionBox1.container.interactive = true;
  gameSelectionBox2.container.interactive = true;
  gameSelectionBox3.container.interactive = true;
  gameSelectionBox1.container.on('pointerdown', function() {
    gameMode = 'endless';
    gameSelectionBox2.container.leftSelectArrow.visible = false;
    gameSelectionBox2.container.rightSelectArrow.visible = false;
    gameSelectionBox3.container.leftSelectArrow.visible = false;
    gameSelectionBox3.container.rightSelectArrow.visible = false;
    //        selectSound.play();
  });

  gameSelectionBox2.container.on('pointerdown', function() {
    gameMode = 'survival';
    gameSelectionBox1.container.leftSelectArrow.visible = false;
    gameSelectionBox1.container.rightSelectArrow.visible = false;
    gameSelectionBox3.container.leftSelectArrow.visible = false;
    gameSelectionBox3.container.rightSelectArrow.visible = false;
    //        selectSound.play();
  });
  gameSelectionBox3.container.on('pointerdown', function() {
    gameMode = 'timed';
    gameSelectionBox1.container.leftSelectArrow.visible = false;
    gameSelectionBox1.container.rightSelectArrow.visible = false;
    gameSelectionBox2.container.leftSelectArrow.visible = false;
    gameSelectionBox2.container.rightSelectArrow.visible = false;
    //        selectSound.play();
  });

  // musicSelectBox = new borderedLabelBox(new PIXI.Sprite(musicTypeText),"yellow",mainBorderThickness,borderBuffer,borderBuffer,false)
  // musicSelectBox.container.x = this.bg.x + (this.bg.width/2) - (musicSelectBox.bg.width/2);
  // musicSelectBox.container.y = this.gameTypeBox.container.y+miniBlockSize*16;
  // this.container.addChild(musicSelectBox.container);

  musicSelectionField = new borderedSelectBox(
    1,
    [musicText, musicText, musicText],
    'dotted',
    mainBorderThickness / 2,
    borderBuffer,
    borderBuffer * 2,
    true
  );
  if (musicSelectionField.container.width < window.innerWidth) {
    musicSelectionField.container.x =
      this.bg.x + this.bg.width / 2 - musicSelectionField.bg.width / 2;
  }
  musicSelectionField.container.y =
    this.okButton.container.y -
    musicSelectionField.container.height -
    miniBlockSize;

  this.container.addChild(musicSelectionField.container);

  this.musicSelectBox = new TextButton(
    this,
    'MUSIC TYPE',
    'yellow',
    1,
    this.headerTextStyle,
    blockSize * 4.5,
    miniBlockSize * 0.25
  );
  this.musicSelectBox.container.x =
    this.bg.x + this.bg.width / 2 - this.musicSelectBox.bg.width / 2;
  this.musicSelectBox.container.y =
    musicSelectionField.container.y -
    this.musicSelectBox.container.height -
    miniBlockSize / 2;
  this.container.addChild(this.musicSelectBox.container);

  // okButton = new borderedLabelBox(new PIXI.Sprite(okText),"fancy",mainBorderThickness*1.5,borderBuffer*16,borderBuffer*4,false)
  // okButton.container.x = this.bg.x + (this.bg.width/2) - (okButton.bg.width/2);
  // okButton.container.y = window.innerHeight - (miniBlockSize*2.75) - okButton.bg.height;
  // this.container.addChild(okButton.container);

  this.okButton.container.interactive = true;
  this.okButton.container.on('pointerdown', function() {
    if (BGMusic !== undefined) {
      BGMusic.normal.stop();
    }
    gameSelected = true;
    if (gameMode === 'endless') {
      if (!levelSelectScreen) {
        levelSelectScreen = new LevelSelectScreen();
      } else {
        levelSelectScreen.container.visible = true;
      }
      if (survivalLevelSelectScreen) {
        survivalLevelSelectScreen.container.visible = false;
      }

      if (survivalLevelSelectScreen) {
        linesDisplay.label.texture = linesText;
        linesDisplay.label.width = linesDisplay.label.height * 6;
        linesDisplay.fullHeader.removeChild(lineScore.container);
        linesDisplay.label.x -= miniBlockSize;
        lineScore = undefined;
        lineScore = new TextNumeral(
          miniBlockSize,
          0,
          topSpace / 2 - miniBlockSize / 2,
          0,
          3
        );
        lineScore.container.x +=
          miniBlockSize / 4 +
          linesDisplay.label.width +
          (window.innerWidth - (playfield.sizeX + sideBarWidth)) / 2;
        linesDisplay.fullHeader.addChild(lineScore.container);
      }
      topScoreNumber.changeNumber(topEndlessScore);
    }
    if (gameMode === 'survival') {
      if (!survivalLevelSelectScreen) {
        survivalLevelSelectScreen = new SurvivalLevelSelectScreen();
      } else {
        survivalLevelSelectScreen.container.visible = true;
      }
      if (levelSelectScreen) {
        levelSelectScreen.container.visible = false;
      }
      linesDisplay.label.texture = timeText;
      linesDisplay.label.width = linesDisplay.label.height * 6;
      linesDisplay.fullHeader.removeChild(lineScore.container);
      lineScore = undefined;
      lineScore = new TextNumeral(
        miniBlockSize,
        0,
        topSpace / 2 - miniBlockSize / 2,
        gameTime,
        3
      );
      lineScore.container.x = linesDisplay.label.x + linesDisplay.label.width;
      linesDisplay.fullHeader.addChild(lineScore.container);
      topScoreNumber.changeNumber(topSurvivalScore);
    }
    if (gameMode === 'timed') {
      if (!timedLevelSelectScreen) {
        timedLevelSelectScreen = new TimedLevelSelectScreen();
      } else {
        timedLevelSelectScreen.container.visible = true;
      }
      if (levelSelectScreen) {
        levelSelectScreen.container.visible = false;
      }
      linesDisplay.label.texture = timeText;
      linesDisplay.label.width = linesDisplay.label.height * 6;
      linesDisplay.fullHeader.removeChild(lineScore.container);
      lineScore = undefined;
      lineScore = new TextNumeral(
        miniBlockSize,
        0,
        topSpace / 2 - miniBlockSize / 2,
        timedLimit,
        3
      );
      lineScore.container.x = linesDisplay.label.x + linesDisplay.label.width;
      linesDisplay.fullHeader.addChild(lineScore.container);
      topScoreNumber.changeNumber(topTimedScore);
    }
    gameSelectScreen.container.fading = true;
    if (SFXOn) {
      confirmSound.play();
    }
  });

  this.backButton = new PIXI.Sprite(backArrowText);
  this.backButton.tint = 0x505050;
  this.backButton.height = blockSize * miniBlockFactor * 1.1;
  this.backButton.width = (blockSize * miniBlockFactor) / 1.5;
  this.backButton.x =
    this.okButton.container.x -
    this.backButton.width -
    this.backButton.width / 5;
  this.backButton.y =
    this.okButton.container.y +
    this.okButton.bg.height / 2 -
    this.backButton.height / 2;
  this.backButton.interactive = true;
  this.backButton.on('pointerdown', function() {
    if (SFXOn) {
      selectSound.play();
    }
    titleScreen.container.visible = true;
    gameSelectScreen.container.visible = false;
    if (BGMusic) {
      BGMusic.normal.stop();
    }
  });

  this.container.addChild(this.backButton);

  this.container.visible = false;
}

function LevelSelectScreen() {
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['red'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );
  //    this.border2 = new Border(borders["blue"],mainBorderThickness,this,this.bg.width,window.innerHeight,0,0);

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border.sizeY;

  headerBox = new borderedLabelBox(
    new PIXI.Sprite(endlessText),
    'red',
    mainBorderThickness,
    borderBuffer,
    borderBuffer,
    false
  );
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  this.levelBox = new DottedSquareNumeralBox(
    20,
    blockSize * menuUnitFactor * 5 + mainBorderThickness * 3,
    (blockSize * menuUnitFactor * 2 + mainBorderThickness * 1.25) * 2,
    0,
    0,
    mainBorderThickness / 2,
    0
  );
  this.levelBox.container.x =
    this.bg.x + this.bg.width / 2 - this.levelBox.bg.width / 2;

  this.levelBox.container.y = blockSize * menuUnitFactor * 4;
  this.container.addChild(this.levelBox.container);

  // this.levelBox2 = new DottedSquareNumeralBox(10,((blockSize*menuUnitFactor*5)+(mainBorderThickness*3)),((blockSize*menuUnitFactor)*2)+(mainBorderThickness*1.5),0,0,mainBorderThickness/2,10)
  // this.levelBox2.container.x = this.bg.x + (this.bg.width/2) - (this.levelBox2.bg.width/2);

  // this.levelBox2.container.y = this.levelBox.container.y+this.levelBox.container.height
  // this.container.addChild(this.levelBox2.container);

  levelHeader = new borderedLabelBox(
    new PIXI.Sprite(levelText),
    'thickRed',
    mainBorderThickness,
    borderBuffer,
    borderBuffer,
    false
  );
  levelHeader.container.x = this.levelBox.container.x;
  levelHeader.container.y =
    this.levelBox.container.y - levelHeader.bg.height - miniBlockSize / 2;
  this.container.addChild(levelHeader.container);

  startButton = new borderedLabelBox(
    new PIXI.Sprite(startText),
    'fancy',
    mainBorderThickness * 1.5,
    borderBuffer * 4,
    borderBuffer * 4,
    false
  );
  startButton.container.x =
    this.bg.x + this.bg.width / 2 - startButton.bg.width / 2;
  startButton.container.y =
    window.innerHeight - miniBlockSize * 3 - startButton.bg.height;
  this.container.addChild(startButton.container);
  startButton.container.interactive = true;
  startButton.container.on('pointerdown', function() {
    currentLevel = chosenStartLevel;
    started = true;
    levelSelectScreen.container.fading = true;
    if (SFXOn) {
      confirmSound.play();
    }
  });

  this.backButton = new PIXI.Sprite(backArrowText);
  this.backButton.tint = 0x505050;
  this.backButton.height = blockSize * miniBlockFactor * 1.1;
  this.backButton.width = (blockSize * miniBlockFactor) / 1.5;
  this.backButton.x =
    startButton.container.x - this.backButton.width - this.backButton.width / 5;
  this.backButton.y =
    startButton.container.y +
    startButton.bg.height / 2 -
    this.backButton.height / 2;
  this.backButton.interactive = true;
  this.backButton.on('touchstart', function() {
    if (SFXOn) {
      selectSound.play();
    }
    gameSelectScreen.container.visible = true;
    levelSelectScreen.container.visible = false;
    if (BGMusic !== undefined) {
      BGMusic.normal.play();
    }
  });
  this.backButton.on('mousedown', function() {
    if (SFXOn) {
      selectSound.play();
    }
    gameSelectScreen.container.visible = true;
    levelSelectScreen.container.visible = false;
    if (BGMusic !== undefined) {
      BGMusic.normal.play();
    }
  });

  this.container.addChild(this.backButton);

  stage.addChildAt(
    this.container,
    stage.children.indexOf(gameSelectScreen.container)
  );
}

function SurvivalLevelSelectScreen() {
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.x += 0;
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.x = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;
  bottomLevelBG.y = this.container.height - blockSize / menuUnitFactor;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['blue'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );

  this.onOffTextStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize + 'px',
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.6,
    leading: miniBlockSize
  };
  if (landscape) {
    this.rulesTextStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: miniBlockSize * 1.25 + 'px',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: this.bg.width * 0.8,
      leading: miniBlockSize
    };
  } else {
    this.rulesTextStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: miniBlockSize * 1 + 'px',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: this.bg.width * 0.8,
      leading: miniBlockSize
    };
  }
  headerBox = new TextButton(
    this,
    'SURVIVAL',
    'blue',
    0,
    this.onOffTextStyle,
    0,
    0
  );
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  startButton = new borderedLabelBox(
    new PIXI.Sprite(startText),
    'fancy',
    mainBorderThickness * 1.5,
    borderBuffer * 4,
    borderBuffer * 4,
    false
  );
  startButton.container.x =
    this.bg.x + this.bg.width / 2 - startButton.bg.width / 2;
  startButton.container.y =
    window.innerHeight - miniBlockSize * 3 - startButton.bg.height;
  this.container.addChild(startButton.container);
  startButton.container.interactive = true;
  startButton.container.on('pointerdown', function() {
    //        currentLevel = chosenStartLevel;
    started = true;
    survivalLevelSelectScreen.container.fading = true;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.backButton = new PIXI.Sprite(backArrowText);
  this.backButton.tint = 0x505050;
  this.backButton.height = blockSize * miniBlockFactor * 1.1;
  this.backButton.width = (blockSize * miniBlockFactor) / 1.5;
  this.backButton.x =
    startButton.container.x - this.backButton.width - this.backButton.width / 5;
  this.backButton.y =
    startButton.container.y +
    startButton.bg.height / 2 -
    this.backButton.height / 2;
  this.backButton.interactive = true;
  this.backButton.on('pointerdown', function() {
    if (SFXOn) {
      selectSound.play();
    }
    gameSelectScreen.container.visible = true;
    survivalLevelSelectScreen.container.visible = false;
    if (BGMusic !== undefined) {
      BGMusic.normal.play();
    }
  });

  this.container.addChild(this.backButton);
  var rulesX = this.bg.x + this.bg.width / 2;
  this.rulesText0 = new PIXI.Text('GAME OVER', this.rulesTextStyle);
  this.rulesText0.x = rulesX;
  this.rulesText0.y = blockSize * 5;

  this.rulesText1 = new PIXI.Text('WHEN TIME = 0', this.rulesTextStyle);
  this.rulesText1.x = rulesX;
  this.rulesText1.y = blockSize * 6.25;

  this.rulesText2 = new PIXI.Text(
    '1 LINE = ' + timeBonuses[0] + ' SECONDS',
    this.rulesTextStyle
  );
  this.rulesText2.x = rulesX;
  this.rulesText2.y = blockSize * 9.5;

  this.rulesText3 = new PIXI.Text(
    '2 LINES = ' + timeBonuses[1] + ' SECONDS',
    this.rulesTextStyle
  );
  this.rulesText3.x = rulesX;
  this.rulesText3.y = blockSize * 11;

  this.rulesText4 = new PIXI.Text(
    '3 LINES = ' + timeBonuses[2] + ' SECONDS',
    this.rulesTextStyle
  );
  this.rulesText4.x = rulesX;
  this.rulesText4.y = blockSize * 12.5;

  this.rulesText5 = new PIXI.Text(
    '4 LINES = ' + timeBonuses[3] + ' SECONDS',
    this.rulesTextStyle
  );
  this.rulesText5.x = rulesX;
  this.rulesText5.y = blockSize * 14;

  this.rulesText0.anchor.x = this.rulesText1.anchor.x = this.rulesText2.anchor.x = this.rulesText3.anchor.x = this.rulesText4.anchor.x = this.rulesText5.anchor.x = 0.5;

  this.container.addChild(this.rulesText0);
  this.container.addChild(this.rulesText1);
  this.container.addChild(this.rulesText2);
  this.container.addChild(this.rulesText3);
  this.container.addChild(this.rulesText4);
  this.container.addChild(this.rulesText5);

  stage.addChildAt(
    this.container,
    stage.children.indexOf(gameSelectScreen.container)
  );
}
function TimedLevelSelectScreen() {
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.x += 0;
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.x = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;
  bottomLevelBG.y = this.container.height - blockSize / menuUnitFactor;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['green'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );

  this.onOffTextStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize + 'px',
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.6,
    leading: miniBlockSize
  };
  if (landscape) {
    this.rulesTextStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: miniBlockSize * 1.25 + 'px',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: this.bg.width * 0.8,
      leading: miniBlockSize
    };
  } else {
    this.rulesTextStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: miniBlockSize * 1 + 'px',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: this.bg.width * 0.8,
      leading: miniBlockSize
    };
  }
  headerBox = new TextButton(
    this,
    'TIMED',
    'green',
    0,
    this.onOffTextStyle,
    0,
    0
  );
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  startButton = new borderedLabelBox(
    new PIXI.Sprite(startText),
    'fancy',
    mainBorderThickness * 1.5,
    borderBuffer * 4,
    borderBuffer * 4,
    false
  );
  startButton.container.x =
    this.bg.x + this.bg.width / 2 - startButton.bg.width / 2;
  startButton.container.y =
    window.innerHeight - miniBlockSize * 3 - startButton.bg.height;
  this.container.addChild(startButton.container);
  startButton.container.interactive = true;
  startButton.container.on('pointerdown', function() {
    //        currentLevel = chosenStartLevel;
    started = true;
    timedLevelSelectScreen.container.visible = false;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.backButton = new PIXI.Sprite(backArrowText);
  this.backButton.tint = 0x505050;
  this.backButton.height = blockSize * miniBlockFactor * 1.1;
  this.backButton.width = (blockSize * miniBlockFactor) / 1.5;
  this.backButton.x =
    startButton.container.x - this.backButton.width - this.backButton.width / 5;
  this.backButton.y =
    startButton.container.y +
    startButton.bg.height / 2 -
    this.backButton.height / 2;
  this.backButton.interactive = true;
  this.backButton.on('pointerdown', function() {
    if (SFXOn) {
      selectSound.play();
    }
    gameSelectScreen.container.visible = true;
    timedLevelSelectScreen.container.visible = false;
    if (BGMusic !== undefined) {
      BGMusic.normal.play();
    }
  });

  this.container.addChild(this.backButton);
  var rulesX = this.bg.x + this.bg.width / 2;
  var spacingY = blockSize * 1.5;

  this.rulesText0 = new PIXI.Text('SCORE AS MANY', this.rulesTextStyle);
  this.rulesText0.x = rulesX;
  this.rulesText0.y = blockSize * 8;

  this.rulesText1 = new PIXI.Text('LINES AS POSSIBLE', this.rulesTextStyle);
  this.rulesText1.x = rulesX;
  this.rulesText1.y = this.rulesText0.y + spacingY;

  this.rulesText2 = new PIXI.Text(
    'IN ' + timedLimit + ' SECONDS',
    this.rulesTextStyle
  );
  this.rulesText2.x = rulesX;
  this.rulesText2.y = this.rulesText1.y + spacingY;

  this.rulesText0.anchor.x = this.rulesText1.anchor.x = this.rulesText2.anchor.x = 0.5;

  this.container.addChild(this.rulesText0);
  this.container.addChild(this.rulesText1);
  this.container.addChild(this.rulesText2);

  stage.addChildAt(
    this.container,
    stage.children.indexOf(gameSelectScreen.container)
  );
}

function HighScoreScreen2() {
  this.startStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.8 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  if (landscape) {
    this.rankStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: blockSize * 0.45 + 'px',
      fill: '#ffffff'
      // stroke : "#000000",
      // strokeThickness : 1
    };
  } else {
    this.rankStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: blockSize * 0.45 + 'px',
      fill: '#ffffff'
      // stroke : "#000000",
      // strokeThickness : 1
    };
  }
  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;
  if (!landscape) {
    rightLevelBG.x += blockSize;
    rightLevelBG2.x += blockSize;
    topLevelBG.x -= blockSize;
    bottomLevelBG.x -= blockSize;
    leftLevelBG.x -= blockSize;
    leftLevelBG2.x -= blockSize;
    this.border = new Border(
      borders['red'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - miniBlockSize * 2,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      miniBlockSize,
      (blockSize / menuUnitFactor) * 2
    );
    // this.border = new Border(borders["red"],mainBorderThickness*1.5,this,this.bg.width-(miniBlockSize*2),window.innerHeight-((blockSize/menuUnitFactor)*3),miniBlockSize,(blockSize/menuUnitFactor)*2);
    this.border2 = new Border(
      borders['blue'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - miniBlockSize * 2,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      miniBlockSize,
      (blockSize / menuUnitFactor) * 2
    );
  } else {
    this.border = new Border(
      borders['red'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - (blockSize / menuUnitFactor) * 4,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      (blockSize / menuUnitFactor) * 2,
      (blockSize / menuUnitFactor) * 2
    );
    this.border2 = new Border(
      borders['blue'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - (blockSize / menuUnitFactor) * 4,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      (blockSize / menuUnitFactor) * 2,
      (blockSize / menuUnitFactor) * 2
    );
  }
  // this.dotBorder = new Border(borders["yellow"],mainBorderThickness/2,this,this.bg.width*0.7,this.bg.height*0.8,this.bg.width*0.15,this.bg.height*0.1,true)
  this.border2.container.visible = false;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border.sizeY;
  this.displayWidth = this.border.sizeX - mainBorderThickness * 2;

  this.header = new TextButton(this, 'HIGH SCORES', 'yellow', 0.5);
  this.header.container.x = this.bg.width / 2 - this.header.container.width / 2;
  this.header.container.y = this.header.container.height / 4;

  this.endlessScores = [];
  this.survivalScores = [];
  this.endlessListContainer = new PIXI.Container();
  this.survivalListContainer = new PIXI.Container();
  for (var e = 0; e < 10; e++) {
    var entry = new ScoreEntry(this);
    if (e % 2 === 0) {
      entry.bg.tint = 0x120906;
    }
    this.endlessScores.push(entry);
    entry.container.y = entry.bg.height * e;
    // if ((e+1)<scoreArray.length) {
    entry.rankField.text = rankify(e + 1);
    // }
    this.endlessListContainer.addChild(entry.container);
  }
  for (var e = 0; e < 10; e++) {
    var entry = new ScoreEntry(this);
    if (e % 2 !== 0) {
      entry.bg.tint = 0x120906;
    }
    this.survivalScores.push(entry);
    entry.container.y = entry.bg.height * e;
    // if ((e+1)<scoreArray.length) {
    entry.rankField.text = rankify(e + 1);
    // }
    this.survivalListContainer.addChild(entry.container);
  }

  this.endlessListContainer.x = this.survivalListContainer.x =
    this.bg.x + this.border.posX + mainBorderThickness;
  this.container.addChild(this.endlessListContainer);
  this.container.addChild(this.survivalListContainer);
  this.okButton = new TextButton(
    this,
    'OK',
    'fancy',
    1,
    this.startStyle,
    blockSize * 4,
    miniBlockSize * 0.5
  );

  this.okButton.container.x =
    this.bg.width / 2 - this.okButton.container.width / 2;
  this.okButton.container.y =
    bottomLevelBG.y - this.okButton.container.height * 1.25;

  this.okButton.container.interactive = true;
  this.okButton.container.on('pointerdown', function() {
    highScoreScreen.container.visible = false;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  if (landscape) {
    this.endlessLabel = new TextButton(
      this,
      'ENDLESS',
      'red',
      1,
      this.rankStyle
    );
    this.survivalLabel = new TextButton(
      this,
      'SURVIVAL',
      'blue',
      1,
      this.rankStyle
    );
    this.endlessLabel.container.x = this.header.container.x;
    this.survivalLabel.container.x =
      this.header.container.x +
      (this.header.container.width - this.survivalLabel.container.width);
  } else {
    this.endlessLabel = new TextButton(
      this,
      'ENDLESS',
      'red',
      1,
      this.rankStyle
    );
    this.survivalLabel = new TextButton(
      this,
      'SURVIVAL',
      'blue',
      1,
      this.rankStyle,
      blockSize
    );
    this.endlessLabel.container.x = this.header.container.x + miniBlockSize;
    this.survivalLabel.container.x =
      this.header.container.x +
      (this.header.container.width - this.survivalLabel.container.width) -
      miniBlockSize;
  }

  this.endlessLabel.container.y = this.survivalLabel.container.y =
    this.header.container.y + this.header.container.height;

  this.endlessListContainer.y = this.survivalListContainer.y =
    this.header.container.y +
    (this.header.container.height +
      this.endlessLabel.container.height +
      mainBorderThickness / 4);

  this.endlessLabel.container.interactive = this.survivalLabel.container.interactive = true;
  this.endlessLabel.container.on('pointerdown', function() {
    highScoreScreen.endlessLabel.border.container.visible = true;
    highScoreScreen.survivalLabel.border.container.visible = false;
    highScoreScreen.endlessLabel.text.alpha = 1;
    highScoreScreen.survivalLabel.text.alpha = 0.3;
    highScoreScreen.endlessListContainer.visible = true;
    highScoreScreen.survivalListContainer.visible = false;
    highScoreScreen.border.container.visible = true;
    highScoreScreen.border2.container.visible = false;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.survivalLabel.container.on('pointerdown', function() {
    highScoreScreen.survivalLabel.border.container.visible = true;
    highScoreScreen.endlessLabel.border.container.visible = false;
    highScoreScreen.survivalLabel.text.alpha = 1;
    highScoreScreen.endlessLabel.text.alpha = 0.3;
    highScoreScreen.survivalListContainer.visible = true;
    highScoreScreen.endlessListContainer.visible = false;
    highScoreScreen.border.container.visible = false;
    highScoreScreen.border2.container.visible = true;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.survivalLabel.border.container.visible = false;
  this.survivalLabel.text.alpha = 0.3;
  this.survivalListContainer.visible = false;

  stage.addChild(this.container);
}
function HighScoreScreen() {
  this.startStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.8 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  this.rankStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.45 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  this.nameStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.45 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };
  this.scoreStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize * 0.45 + 'px',
    fill: '#ffffff'
    // stroke : "#000000",
    // strokeThickness : 1
  };

  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;
  if (!landscape) {
    rightLevelBG.x += blockSize;
    rightLevelBG2.x += blockSize;
    topLevelBG.x -= blockSize;
    bottomLevelBG.x -= blockSize;
    leftLevelBG.x -= blockSize;
    leftLevelBG2.x -= blockSize;
    this.border1 = new Border(
      borders['red'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - miniBlockSize * 2,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      miniBlockSize,
      (blockSize / menuUnitFactor) * 2
    );
    this.border2 = new Border(
      borders['blue'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - miniBlockSize * 2,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      miniBlockSize,
      (blockSize / menuUnitFactor) * 2
    );
    this.border3 = new Border(
      borders['green'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - miniBlockSize * 2,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      miniBlockSize,
      (blockSize / menuUnitFactor) * 2
    );
  } else {
    this.border1 = new Border(
      borders['red'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - (blockSize / menuUnitFactor) * 4,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      (blockSize / menuUnitFactor) * 2,
      (blockSize / menuUnitFactor) * 2
    );
    this.border2 = new Border(
      borders['blue'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - (blockSize / menuUnitFactor) * 4,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      (blockSize / menuUnitFactor) * 2,
      (blockSize / menuUnitFactor) * 2
    );
    this.border3 = new Border(
      borders['green'],
      mainBorderThickness * 1.5,
      this,
      this.bg.width - (blockSize / menuUnitFactor) * 4,
      window.innerHeight - (blockSize / menuUnitFactor) * 3,
      (blockSize / menuUnitFactor) * 2,
      (blockSize / menuUnitFactor) * 2
    );
  }
  // this.dotBorder = new Border(borders["yellow"],mainBorderThickness/2,this,this.bg.width*0.7,this.bg.height*0.8,this.bg.width*0.15,this.bg.height*0.1,true)
  this.border2.container.visible = false;
  this.border3.container.visible = false;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border1.sizeY;
  this.displayWidth = this.border1.sizeX - mainBorderThickness * 2;

  this.header = new TextButton(this, 'HIGH SCORES', 'yellow', 0.5);
  this.header.container.x = this.bg.width / 2 - this.header.container.width / 2;
  this.header.container.y = this.header.container.height / 4;

  this.endlessScores = [];
  this.survivalScores = [];
  this.timedScores = [];
  this.endlessListContainer = new PIXI.Container();
  this.survivalListContainer = new PIXI.Container();
  this.timedListContainer = new PIXI.Container();
  for (var e = 0; e < 10; e++) {
    var entry = new ScoreEntry(this);
    if (e % 2 === 0) {
      entry.bg.tint = 0x120906;
    }
    this.endlessScores.push(entry);
    entry.container.y = entry.bg.height * e;
    // if ((e+1)<scoreArray.length) {
    entry.rankField.text = rankify(e + 1);
    // }
    this.endlessListContainer.addChild(entry.container);
  }
  for (var e = 0; e < 10; e++) {
    var entry = new ScoreEntry(this);
    if (e % 2 !== 0) {
      entry.bg.tint = 0x120906;
    }
    this.survivalScores.push(entry);
    entry.container.y = entry.bg.height * e;
    // if ((e+1)<scoreArray.length) {
    entry.rankField.text = rankify(e + 1);
    // }
    this.survivalListContainer.addChild(entry.container);
  }
  for (var e = 0; e < 10; e++) {
    var entry = new ScoreEntry(this);
    if (e % 2 === 0) {
      entry.bg.tint = 0x120906;
    }
    this.timedScores.push(entry);
    entry.container.y = entry.bg.height * e;
    // if ((e+1)<scoreArray.length) {
    entry.rankField.text = rankify(e + 1);
    // }
    this.timedListContainer.addChild(entry.container);
  }

  this.endlessListContainer.x = this.survivalListContainer.x = this.timedListContainer.x =
    this.bg.x + this.border1.posX + mainBorderThickness;
  this.container.addChild(this.endlessListContainer);
  this.container.addChild(this.survivalListContainer);
  this.container.addChild(this.timedListContainer);
  this.okButton = new TextButton(
    this,
    'OK',
    'fancy',
    1,
    this.startStyle,
    blockSize * 4,
    miniBlockSize * 0.5
  );

  this.okButton.container.x =
    this.bg.width / 2 - this.okButton.container.width / 2;
  this.okButton.container.y =
    bottomLevelBG.y - this.okButton.container.height * 1.25;

  this.okButton.container.interactive = true;
  this.okButton.container.on('pointerdown', function() {
    highScoreScreen.container.visible = false;
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.modeLabel = new TextButton(
    this,
    'ENDLESS',
    'red',
    1,
    this.nameStyle,
    blockSize
  );
  this.modeLabel.container.x =
    this.header.container.x +
    this.header.container.width / 2 -
    this.modeLabel.container.width / 2;
  this.modeLabel.container.y =
    this.header.container.y + this.header.container.height;
  this.endlessListContainer.y = this.survivalListContainer.y = this.timedListContainer.y =
    this.header.container.y +
    (this.header.container.height +
      this.modeLabel.container.height +
      mainBorderThickness / 4);
  this.modeLabel.container.interactive = true;
  this.modeLabel.container.on('pointerdown', function() {
    var currentMode = highScoreScreen.modeLabel.text.text;
    if (currentMode === 'ENDLESS') {
      highScoreScreen.modeLabel.text.text = 'SURVIVAL';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('blue');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = true;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = true;
      highScoreScreen.timedListContainer.visible = false;
    } else if (currentMode === 'SURVIVAL') {
      highScoreScreen.modeLabel.text.text = 'TIMED';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('green');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = true;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = true;
    } else if (currentMode === 'TIMED') {
      highScoreScreen.modeLabel.text.text = 'ENDLESS';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('red');
      highScoreScreen.border1.container.visible = true;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = true;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = false;
    }
    if (SFXOn) {
      confirmSound.play();
    }
  });

  this.rightArrow = new PIXI.Sprite(selectArrowText);
  this.rightArrow.width = this.rightArrow.height =
    this.modeLabel.container.height * 0.7;
  this.rightArrow.x =
    this.modeLabel.container.x + this.modeLabel.container.width + miniBlockSize;
  this.rightArrow.y =
    this.modeLabel.container.y + this.modeLabel.container.height * 0.15;
  this.container.addChild(this.rightArrow);
  this.leftArrow = new PIXI.Sprite(selectArrowText);
  this.leftArrow.width = this.leftArrow.height = this.rightArrow.height;
  this.leftArrow.scale.x *= -1;
  this.leftArrow.x = this.modeLabel.container.x - miniBlockSize;
  this.leftArrow.y = this.rightArrow.y;
  this.container.addChild(this.leftArrow);
  this.rightArrow.interactive = this.leftArrow.interactive = true;
  this.rightArrow.on('pointerdown', function() {
    var currentMode = highScoreScreen.modeLabel.text.text;
    if (currentMode === 'ENDLESS') {
      highScoreScreen.modeLabel.text.text = 'SURVIVAL';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('blue');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = true;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = true;
      highScoreScreen.timedListContainer.visible = false;
    } else if (currentMode === 'SURVIVAL') {
      highScoreScreen.modeLabel.text.text = 'TIMED';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('green');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = true;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = true;
    } else if (currentMode === 'TIMED') {
      highScoreScreen.modeLabel.text.text = 'ENDLESS';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('red');
      highScoreScreen.border1.container.visible = true;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = true;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = false;
    }
    if (SFXOn) {
      confirmSound.play();
    }
  });
  this.leftArrow.on('pointerdown', function() {
    var currentMode = highScoreScreen.modeLabel.text.text;
    if (currentMode === 'ENDLESS') {
      highScoreScreen.modeLabel.text.text = 'TIMED';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('green');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = true;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = true;
    } else if (currentMode === 'SURVIVAL') {
      highScoreScreen.modeLabel.text.text = 'ENDLESS';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('red');
      highScoreScreen.border1.container.visible = true;
      highScoreScreen.border2.container.visible = false;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = true;
      highScoreScreen.survivalListContainer.visible = false;
      highScoreScreen.timedListContainer.visible = false;
    } else if (currentMode === 'TIMED') {
      highScoreScreen.modeLabel.text.text = 'SURVIVAL';
      highScoreScreen.modeLabel.text.x =
        highScoreScreen.modeLabel.bg.width / 2 -
        highScoreScreen.modeLabel.text.width / 2;
      highScoreScreen.modeLabel.changeBorder('blue');
      highScoreScreen.border1.container.visible = false;
      highScoreScreen.border2.container.visible = true;
      highScoreScreen.border3.container.visible = false;
      highScoreScreen.endlessListContainer.visible = false;
      highScoreScreen.survivalListContainer.visible = true;
      highScoreScreen.timedListContainer.visible = false;
    }
    if (SFXOn) {
      confirmSound.play();
    }
  });

  this.flashArrows = function() {
    if (titleCounter % 2 === 0) {
      this.leftArrow.alpha = 0.5;
      this.rightArrow.alpha = 0.5;
    } else {
      this.leftArrow.alpha = 1;
      this.rightArrow.alpha = 1;
    }
  };

  // this.endlessListContainer.visible = false
  this.survivalListContainer.visible = false;
  this.timedListContainer.visible = false;

  stage.addChild(this.container);
}

function EndlessNameEntryScreen() {
  if (landscape) {
    var nameSize = miniBlockSize * 1.25;
  } else {
    var nameSize = miniBlockSize;
  }

  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['red'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border.sizeY;

  // headerBox = new borderedLabelBox(new PIXI.Text(endlessText),"red",mainBorderThickness,borderBuffer,borderBuffer,false)
  // headerBox.container.x = this.bg.x + (this.bg.width/2) - (headerBox.bg.width/2);
  // headerBox.container.y = (blockSize/menuUnitFactor);
  // this.container.addChild(headerBox.container);

  this.standardStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: nameSize + 'px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.8,
    leading: miniBlockSize
  };
  this.headerStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize + 'px',
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.6,
    leading: miniBlockSize
  };

  headerBox = new TextButton(this, 'ENDLESS', 'red', 0, this.headerStyle, 0, 0);
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  this.congratsText1 = new PIXI.Text('CONGRATULATIONS', this.standardStyle);
  this.congratsText1.tint = 0xff0000;
  this.congratsText2 = new PIXI.Text(
    'YOU ARE A TETRIS MASTER.',
    this.standardStyle
  );
  this.congratsText3 = new PIXI.Text(
    'PLEASE ENTER YOUR NAME',
    this.standardStyle
  );

  this.congratsText1.anchor.x = this.congratsText2.anchor.x = this.congratsText3.anchor.x = 0.5;
  this.congratsText1.x = this.congratsText2.x = this.congratsText3.x =
    this.bg.width / 2;

  if (!landscape) {
    this.congratsText1.y = this.bg.height * 0.35;
  } else {
    this.congratsText1.y = this.bg.height * 0.5;
  }
  this.congratsText2.y = this.congratsText1.y + blockSize * 2;
  this.congratsText3.y = this.congratsText2.y + blockSize * 4.75;

  this.container.addChild(
    this.congratsText1,
    this.congratsText2,
    this.congratsText3
  );

  this.skipButton = new TextButton(this, 'SKIP', 'red', 1, this.standardStyle);
  this.skipButton.container.x =
    this.bg.width / 2 - this.skipButton.container.width / 2;
  this.skipButton.container.y =
    this.bg.height - this.skipButton.container.height * 2;
  this.skipButton.container.interactive = true;
  this.skipButton.container.on('pointerdown', function() {
    endlessNameEntryScreen.container.visible = false;
    $('#nameentry').css('display', 'none');
    resetToTitle();
  });

  stage.addChild(this.container);
}
function SurvivalNameEntryScreen() {
  if (landscape) {
    var nameSize = miniBlockSize * 1.25;
  } else {
    var nameSize = miniBlockSize;
  }

  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['blue'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border.sizeY;

  this.standardStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: nameSize + 'px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.8,
    leading: miniBlockSize
  };
  this.headerStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize + 'px',
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.6,
    leading: miniBlockSize
  };

  headerBox = new TextButton(
    this,
    'SURVIVAL',
    'blue',
    0,
    this.headerStyle,
    0,
    0
  );
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  this.congratsText1 = new PIXI.Text('CONGRATULATIONS', this.standardStyle);
  this.congratsText1.tint = 0xff0000;
  this.congratsText2 = new PIXI.Text(
    'YOU ARE A TETRIS MASTER.',
    this.standardStyle
  );
  this.congratsText3 = new PIXI.Text(
    'PLEASE ENTER YOUR NAME',
    this.standardStyle
  );

  this.congratsText1.anchor.x = this.congratsText2.anchor.x = this.congratsText3.anchor.x = 0.5;
  this.congratsText1.x = this.congratsText2.x = this.congratsText3.x =
    this.bg.width / 2;

  if (!landscape) {
    this.congratsText1.y = this.bg.height * 0.35;
  } else {
    this.congratsText1.y = this.bg.height * 0.5;
  }
  this.congratsText2.y = this.congratsText1.y + blockSize * 2;
  this.congratsText3.y = this.congratsText2.y + blockSize * 3.75;

  this.container.addChild(
    this.congratsText1,
    this.congratsText2,
    this.congratsText3
  );

  this.skipButton = new TextButton(this, 'SKIP', 'red', 1, this.standardStyle);
  this.skipButton.container.x =
    this.bg.width / 2 - this.skipButton.container.width / 2;
  this.skipButton.container.y =
    this.bg.height - this.skipButton.container.height * 2;
  this.skipButton.container.interactive = true;
  this.skipButton.container.on('pointerdown', function() {
    survivalNameEntryScreen.container.visible = false;
    $('#nameentry').css('display', 'none');
    resetToTitle();
  });

  stage.addChild(this.container);
}
function TimedNameEntryScreen() {
  if (landscape) {
    var nameSize = miniBlockSize * 1.25;
  } else {
    var nameSize = miniBlockSize;
  }

  this.container = new PIXI.Container();
  this.container.interactive = true;
  this.bg = new PIXI.Sprite(pixelText);

  this.bg.width = titleScreen.bg.width;
  this.bg.height = titleScreen.bg.height;
  this.container.x += titleScreen.container.x;
  this.container.y += titleScreen.container.y;

  this.bg.tint = 0x000000;
  this.bg.alpha = 1;

  this.container.addChild(this.bg);
  this.container.pivot.x = this.bg.width / 2;
  this.container.pivot.y = this.bg.height / 2;

  var frameX = window.innerHeight / 10;

  this.container.visible = true;

  this.container.fading = false;

  this.fade = function() {
    // this.container.scale.y += 0.15;
    // this.container.alpha -= 0.08;
    // if (this.container.alpha <= 0.08) {
    this.container.visible = false;
    // this.container.alpha = 1;
    // this.container.scale.y = 1;
    this.container.fading = false;
    // }
  };

  topLevelBG = new PIXI.Sprite(bg22x2TopText);
  leftLevelBG = new PIXI.Sprite(bg22x2SideText);
  leftLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG = new PIXI.Sprite(bg22x2SideText);
  rightLevelBG2 = new PIXI.Sprite(bg22x2SideText);
  bottomLevelBG = new PIXI.Sprite(bg22x2TopText);
  topLevelBG.height = bottomLevelBG.height = leftLevelBG.width = rightLevelBG.width = leftLevelBG2.width = rightLevelBG2.width =
    blockSize * menuUnitFactor;
  topLevelBG.width = bottomLevelBG.width = topLevelBG.height * 11;
  leftLevelBG.height = rightLevelBG.height = leftLevelBG2.height = rightLevelBG2.height =
    topLevelBG.width;

  topLevelBG.x = bottomLevelBG.x = blockSize * menuUnitFactor;

  leftLevelBG2.y = rightLevelBG2.y = leftLevelBG.y + leftLevelBG.height;

  rightLevelBG.x = rightLevelBG2.x = this.container.width - rightLevelBG.width;

  this.container.addChild(topLevelBG);
  this.container.addChild(leftLevelBG);
  this.container.addChild(leftLevelBG2);
  this.container.addChild(rightLevelBG);
  this.container.addChild(rightLevelBG2);
  this.container.addChild(bottomLevelBG);

  this.border = new Border(
    borders['green'],
    mainBorderThickness,
    this,
    this.bg.width - (blockSize / menuUnitFactor) * 4,
    window.innerHeight - (blockSize / menuUnitFactor) * 3,
    (blockSize / menuUnitFactor) * 2,
    (blockSize / menuUnitFactor) * 2
  );

  bottomLevelBG.y = (blockSize / menuUnitFactor) * 2 + this.border.sizeY;

  this.standardStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: nameSize + 'px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.8,
    leading: miniBlockSize
  };
  this.headerStyle = {
    fontFamily: 'Press Start 2P',
    fontSize: blockSize + 'px',
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: this.bg.width * 0.6,
    leading: miniBlockSize
  };

  headerBox = new TextButton(this, 'TIMED', 'green', 0, this.headerStyle, 0, 0);
  headerBox.container.x =
    this.bg.x + this.bg.width / 2 - headerBox.bg.width / 2;
  headerBox.container.y = blockSize / menuUnitFactor;
  this.container.addChild(headerBox.container);

  this.congratsText1 = new PIXI.Text('CONGRATULATIONS', this.standardStyle);
  this.congratsText1.tint = 0xff0000;
  this.congratsText2 = new PIXI.Text(
    'YOU ARE A TETRIS MASTER.',
    this.standardStyle
  );
  this.congratsText3 = new PIXI.Text(
    'PLEASE ENTER YOUR NAME',
    this.standardStyle
  );

  this.congratsText1.anchor.x = this.congratsText2.anchor.x = this.congratsText3.anchor.x = 0.5;
  this.congratsText1.x = this.congratsText2.x = this.congratsText3.x =
    this.bg.width / 2;

  if (!landscape) {
    this.congratsText1.y = this.bg.height * 0.35;
  } else {
    this.congratsText1.y = this.bg.height * 0.5;
  }
  this.congratsText2.y = this.congratsText1.y + blockSize * 2;
  this.congratsText3.y = this.congratsText2.y + blockSize * 3.75;

  this.container.addChild(
    this.congratsText1,
    this.congratsText2,
    this.congratsText3
  );

  this.skipButton = new TextButton(this, 'SKIP', 'red', 1, this.standardStyle);
  this.skipButton.container.x =
    this.bg.width / 2 - this.skipButton.container.width / 2;
  this.skipButton.container.y =
    this.bg.height - this.skipButton.container.height * 2;
  this.skipButton.container.interactive = true;
  this.skipButton.container.on('pointerdown', function() {
    timedNameEntryScreen.container.visible = false;
    $('#nameentry').css('display', 'none');
    resetToTitle();
  });

  stage.addChild(this.container);
}
