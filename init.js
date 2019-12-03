fullScreen = false;
FRAMERATE = 60;
timeSinceLastDrawn = 0;
origX = window.innerWidth;
origY = window.innerHeight;
origScreenX = screen.width;
origScreenY = screen.height;
currentSize = { x: window.innerWidth, y: window.innerHeight };
HWRATIO = currentSize.x / currentSize.y;

topSpace = window.innerHeight * 0.075;

tetrisRed = 0xe44437;
tetrisBlue = 0x77c8ff;
tetrisYellow = 0xeafc66;
tetrisGreen = 0x4efe77;
levelSelectHighlightColor = 0xfeac4e;
levelSelectNumeralColor = tetrisRed;
menuHighlightColor = 0x21af34;

blocksPerWidth = 10;

panicMode = false;
sensitivityX = 1;
sensitivityY = 1;
SFXOn = false;
colors = [
  // solid zee and ell, outline and others
  [0x77c8ff, 0x6e5df3],
  [0x7eee49, 0x06b72f],
  [0xff76fe, 0xdf2fb7],
  [0x4efe77, 0x6e5df3],
  [0x3afcb6, 0xf33177],
  [0xb6a5ff, 0x3afcb6],
  [0x808080, 0xe44437],
  [0xca084e, 0xaf3fe4],
  [0xe44437, 0x6e5df3],
  [0xfeac4e, 0xe44437]
];
levelData = {
  0: { fallRate: 48 },
  1: { fallRate: 43 },
  2: { fallRate: 38 },
  3: { fallRate: 33 },
  4: { fallRate: 28 },
  5: { fallRate: 23 },
  6: { fallRate: 18 },
  7: { fallRate: 13 },
  8: { fallRate: 8 },
  9: { fallRate: 6 },
  10: { fallRate: 5 },
  11: { fallRate: 5 },
  12: { fallRate: 5 },
  13: { fallRate: 4 },
  14: { fallRate: 4 },
  15: { fallRate: 4 },
  16: { fallRate: 3 },
  17: { fallRate: 3 },
  18: { fallRate: 3 },
  19: { fallRate: 2 },
  20: { fallRate: 2 },
  21: { fallRate: 2 },
  22: { fallRate: 2 },
  23: { fallRate: 2 },
  24: { fallRate: 2 },
  25: { fallRate: 2 },
  26: { fallRate: 2 },
  27: { fallRate: 2 },
  28: { fallRate: 2 }
};
pieceStats = {
  eye: 0,
  owe: 0,
  tee: 0,
  jay: 0,
  ell: 0,
  ess: 0,
  zee: 0
};
fallRates = ['INSTANT', 'QUICK', 'NORMAL'];
pieceInfo = {
  eye: {
    bgSize: 4,
    anchorPoint: [2, 2],
    initialPositions: [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2]
    ],
    white: true
  },
  owe: {
    bgSize: 2,
    anchorPoint: [0.5, 0.5],
    initialPositions: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ],
    white: true
  },
  tee: {
    bgSize: 3,
    anchorPoint: [1, 1],
    initialPositions: [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ],
    white: true
  },
  jay: {
    bgSize: 3,
    anchorPoint: [1, 1],
    initialPositions: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2]
    ],
    white: false
  },
  ell: {
    bgSize: 3,
    anchorPoint: [1, 1],
    initialPositions: [
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2]
    ],
    white: false,
    color: true
  },
  ess: {
    bgSize: 3,
    anchorPoint: [1.5, 1.5],
    initialPositions: [
      [0, 2],
      [1, 2],
      [1, 1],
      [2, 1]
    ],
    white: false
  },
  zee: {
    bgSize: 3,
    anchorPoint: [1.5, 1.5],
    initialPositions: [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2]
    ],
    white: false,
    color: true
  }
};
timeBonuses = [2, 5, 10, 20];

skin = 'NES';

DASTime = 16;
DASInterval = 6;
ARETime = 10;
hardDrop = false;
lastLanded = -99;
if (window.innerWidth > window.innerHeight) {
  landscape = true;
} else {
  landscape = false;
}

invisibleMode = false;
pieceGrid = false;
ghostPiece = true;
gameName = 'tetro';
gameMode = 'endless';
queueVisible = 2;
chosenStartLevel = 0;
currentNameEntered = '';

destroyingBlocks = false;
topEndlessScore = 10000;
topTimedScore = 20;
forcedFallRate = 1;
queueLength = 2;

gameSize = { x: window.innerWidth, y: window.innerHeight };
bgColor = 0x808080;
isTouchDevice = 'ontouchstart' in document.documentElement;
isIOS = /(ipad|iphone|ipod)/g.test(navigator.userAgent.toLowerCase());
optionsScreen = undefined;
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
endlessScoreArray = [];
survivalScoreArray = [];
timedScoreArray = [];
typeQueue = [];

gameOptions = {
  actionKeys: {
    'WALK LEFT': 'a',
    'WALK RIGHT': 'd',
    'JUMP': 'w',
    'CROUCH': 's',
    'PUNCH/WEAPON': 'j',
    'KICK': 'k',
    'THROW WEAPON': 'l'
  },
  buttonMappings: {
    0: { action: 'rotateCCW' },
    1: { action: 'rotateCW' },
    2: { action: '' },
    3: { action: '' },
    4: { action: '' },
    5: { action: '' },
    6: { action: '' },
    7: { action: '' },
    8: { action: 'select' },
    9: { action: 'start' },
    10: { action: '' },
    11: { action: '' },
    12: { action: 'up' },
    13: { action: 'down' },
    14: { action: 'left' },
    15: { action: 'right' }
  },
  actionButtons: {
    'WALK LEFT': 'left',
    'WALK RIGHT': 'right',
    'JUMP': 'up',
    'CROUCH': 'down',
    'PUNCH/WEAPON': 'y',
    'KICK': 'b',
    'THROW WEAPON': 'x'
  }
}



userGamepad = null;

window.addEventListener('load', () => {
  window.addEventListener("gamepaddisconnected", (e) => {
    console.error("Gamepad " + e.gamepad.index + " disconnected!");
    userGamepad = undefined;
    gamepadPollingInterval = setInterval(checkForNewGamepads, 1000);
    document.body.classList.remove('gamepad-connected');
  });
  
  gamepadPollingInterval = ('ongamepadconnected' in window) ? null : setInterval(checkForNewGamepads, 1000);
});
// userGamepad = new UserGamepad();

function createRenderer() {
  var actualHeight = window.innerHeight;
  if (optionsScreen !== undefined && optionsScreen.changedScreenMode) {
    actualHeight += 200;
  }
  renderer = PIXI.autoDetectRenderer({
    width: window.innerWidth,
    height: actualHeight,
    autoResize: true,
    powerPreference: 'high-performance',
    // roundPixels: true
  });
  //    console.log("width at render " + window.innerWidth)
  //    console.log("height at render " + window.innerHeight)
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
  if (viewWidth >= viewHeight) {
    shorterDimension = viewHeight;
    longerDimension = viewWidth;
  } else {
    shorterDimension = viewWidth;
    longerDimension = viewHeight;
  }
  renderer.plugins.interaction.interactionFrequency = 1;
  document.body.appendChild(renderer.view);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
modes = ['endless', 'survival', 'timed'];
pieceTypes = ['eye', 'owe', 'tee', 'jay', 'ell', 'ess', 'zee'];
directions = ['north', 'east', 'south', 'west'];

lastDrawn = Date.now();
lastUpdated = Date.now();

BGMusic = undefined;

function setVariables() {
  pieceStats = {
    eye: 0,
    owe: 0,
    tee: 0,
    jay: 0,
    ell: 0,
    ess: 0,
    zee: 0
  };
  if (invisibleMode) {
    multiLineBonuses = [120, 300, 900, 4800];
  } else {
    multiLineBonuses = [40, 100, 300, 1200];
  }
  forceBonus = 0;
  touchingAtLastFrame = undefined;
  linesScored = -1;
  playerScore = 0;
  gameTime = 20;
  timedLimit = 30;
  lineCount = 0;
  pieceHistory = [];
  currentLevel = 0;
  globalFallSpeed = 0;
  lost = -1;
  leveledThisFrame = false;
  lineRows = [];
  lineCovers = [];
  titleLanded = -1;
  pressedSpaceAt = pressedZAt = pressedSAt = pressedAAt = pressedDAt = pressedQAt = pressedEAt = undefined;
  pressingW = pressingE = pressingQ = pressingA = pressingD = pressingS = pressingSpace = false;
  counter = 0;
  swipingDown = false;
  cursor = { x: undefined, y: undefined };
  cursorAtLastFrame = null;
  startingFingerDistance = 0;
  pinched = 0;
  touches = [];
  LMBDown = RMBDown = false;
  clicked = -1;
  rightClicked = -1;
  doubleTapping = false;
  startedDrag = undefined;
  endedDrag = undefined;
  mousedown = false;
  tapped = -1;
  cancelledDrop = false;
  obscuredBlocks = [];
  touchingAt = { x: undefined, y: undefined };
  startedDragLocation = undefined;
  startedDragTime = undefined;
  endedDragLocation = undefined;
  endedDragTime = undefined;
  movingLeftOrRightFast = false;
  futureTypesQueue = [];
  queue = [];
  atBat = undefined;
  lowestQueuePosition = undefined;
  started = false;
  blocks = [];
  released = 0;

  HWRatio = window.innerWidth / window.innerHeight;
  levelSelectScreen = undefined;
  survivalLevelSelectScreen = undefined;
  timedLevelSelectScreen = undefined;
}

function establishDimensionsForScreen() {
  playWidth = window.innerWidth * 0.8;
  mainBorderThickness = playWidth / 20;
  playHeight = playWidth * 2;

  if (playHeight + mainBorderThickness * 2 > window.innerHeight) {
    playHeight = window.innerHeight;
    playWidth = playHeight / 2;
    mainBorderThickness = playWidth / 20;
  }

  playHeight -= mainBorderThickness * 2;
  var playRatio = playHeight / playWidth;
  playHeight = window.innerHeight - topSpace;

  playWidth = playHeight / playRatio;

  blockSize = (playWidth - mainBorderThickness * 2) / 10;
  dropDragDistance = (blockSize / 5) * sensitivityY;
  dragDeadZoneX = (blockSize / 10) * sensitivityX;

  miniBlockFactor = 2;
  menuUnitFactor = 1.5;
  miniBlockSize = blockSize / miniBlockFactor;

  sideBarWidth = miniBlockSize * 8;

  borderBuffer = blockSize / 8;
  queueSlotHeight = miniBlockSize * 4;

  margin = 0;

  stage = new PIXI.Container();
  stage.width = window.innerWidth;
  if (window.innerWidth > window.innerHeight) {
    stage.width = window.innerHeight / 2;
  }
  // stage.height = window.innerHeight;
  stage.interactive = true;
  container = new PIXI.Container();
  pieceContainer = new PIXI.Container();

  stage.addChild(container);

  fourLineFlasher = new PIXI.Sprite(pixelText);
  fourLineFlasher.width = window.innerWidth;
  fourLineFlasher.height = window.innerHeight;
  fourLineFlasher.tint = 0xffffff;
  fourLineFlasher.alpha = 0.6;
  fourLineFlasher.visible = false;
  stage.addChildAt(fourLineFlasher, 1);
  //    stage.x = 0;
  //    stage.y = 0;
}

tappedTime = -1;

gameSelected = false;

//stage.on("touchstart",function(){
//    tappedTime = Date.now();
//    console.log("tapped at " + tappedTime + " and now is " + Date.now())
//})
//stage.on("mousedown",function(){
////    tappedTime = Date.now();
//})

lastKnownCount = 0;

createRenderer();

$('#nameentry').html(
  '<input length="12" maxlength="12" id="nameinput" type="text" autocomplete="off" placeholder="Enter name" name="playername"  /><button id="namesubmitbutton" class="button" type="button" >SUBMIT</button>'
);

$('#namesubmitbutton').on('click', function() {
  currentNameEntered = $('#nameinput').val();
  if (currentNameEntered) {
    $('#nameentry').css('display', 'none');
    if (gameMode === 'endless') {
      endlessNameEntryScreen.container.visible = false;
    }
    if (gameMode === 'survival') {
      survivalNameEntryScreen.container.visible = false;
    }
    saveScoreToDatabase(
      gameName + '-' + gameMode,
      currentNameEntered,
      playerScore,
      true
    );
  }
});

sensitivityY = 10;
sensitivityX = 9;
dropDragMinTime = 30;

function init(firstTime) {
  titleCounter = 0;
  getTotalLinesFromDatabase();

  setVariables();
  var playfieldY = topSpace / 2;
  establishDimensionsForScreen();

  playfield = new Playfield(
    0,
    playfieldY,
    playWidth,
    playHeight,
    'fancy',
    mainBorderThickness
  );

  setUpDisplays();

  titleScreen = new TitleScreen();

  createEmptyGrid();
  gameSelectScreen = new GameSelectScreen();

  pauseScreen = new PauseScreen();
  optionsScreen = new OptionsScreen();
  optionsScreen.container.visible = false;
  highScoreScreen = new HighScoreScreen();
  highScoreScreen.container.visible = false;

  endlessNameEntryScreen = new EndlessNameEntryScreen();
  endlessNameEntryScreen.container.visible = false;
  survivalNameEntryScreen = new SurvivalNameEntryScreen();
  survivalNameEntryScreen.container.visible = false;
  timedNameEntryScreen = new TimedNameEntryScreen();
  timedNameEntryScreen.container.visible = false;
  getScoresFromDatabase(gameName + '-endless', true);
  getScoresFromDatabase(gameName + '-survival', true);
  getScoresFromDatabase(gameName + '-timed', true);
  if (firstTime) {
    update();
  } else {
    titleScreen.container.scale.x = titleScreen.container.scale.y = titleScreen.playButton.alpha = titleScreen.optionsButton.alpha = 1;
    titleScreen.spaceContainer.alpha = 0.48;
  }
}
