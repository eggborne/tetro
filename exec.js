


function update() {
    if (titleScreen.container.visible && counter === 0) { 
        
        var randRotation = (randomInt(-1,1));
        titleScreen.castleContainer.x += randRotation;
        titleScreen.castleContainer.y += randomInt(-1,1);
        if (Date.now() % 2 === 0 ) {
            titleScreen.castleContainer.rotation += (Math.PI/360)*randRotation;
            if (Math.abs(titleScreen.castleContainer.rotation) > (Math.PI/360)*5) {
                titleScreen.castleContainer.rotation -= (Math.PI/360)*randRotation*2;
            }
            if (Math.abs(titleScreen.castleContainer.x-(window.innerWidth/2)) > (titleScreen.castleContainer.width/2)) {
                titleScreen.castleContainer.x -= randRotation;
            }
            titleScreen.castleFlameLeft.alpha = 1
            titleScreen.castleFlameRight.alpha = 0
        } else {
            titleScreen.castleFlameLeft.alpha = 0
            titleScreen.castleFlameRight.alpha = 1
        }
        titleCounter++
        if (titleCounter % 600 === 0 ) {
            getTotalLinesFromDatabase()
        }
        titleScreen.space1.y += blockSize;
        titleScreen.space2.y += blockSize;
        titleScreen.space3.y += blockSize;
        if (titleScreen.space1.y > window.innerHeight) {
            titleScreen.space1.y -= titleScreen.space1.height*2
        }
        if (titleScreen.space2.y > window.innerHeight) {
            titleScreen.space2.y -= titleScreen.space2.height*2
        }if (titleScreen.space3.y > window.innerHeight) {
            titleScreen.space3.y -= titleScreen.space3.height*2
        }
    }
    if (highScoreScreen.container.visible) {
        highScoreScreen.flashArrows()
    }

    if (lost < 0) {
        if (started && counter === 0) {
           changeBlockColorsToLevel(colorForLevel(currentLevel));
            // queueNewBag()
            queuePieces(1)
            levelScore.container.removeChildren();
            levelScore = undefined;
            levelScore = new TextNumeral(miniBlockSize,levelDisplay.label.x+(levelDisplay.label.width/2),miniBlockSize/2+scoreDisplay.bg.height+queueDisplay.bg.height+levelDisplay.bg.height,currentLevel,2);
            levelScore.container.x -= levelScore.container.width/2;
            establishFallSpeedForLevel();

        }
        if (counter === 1 && BGMusic !== undefined) {
            BGMusic.normal.stop();
            BGMusic.normal.play();

        }


//        if (BGMusic !== undefined) {
//        if (lowestRowOccupied() < 6 && !panicMode) {
//            BGMusic.normal.rate = 1.5;
//            panicMode = true;
//        } else if (lowestRowOccupied() >= 6 && panicMode) {
//            BGMusic.normal.rate = 1;
//            panicMode = false;
//        }
//        };
    
        if (gameSelectScreen.container.visible) {
            musicSelectionField.flashArrows();
            if (gameMode === "endless") {
                gameSelectionBox1.flashArrows();
            } 
            if (gameMode === "survival") {
                gameSelectionBox2.flashArrows();

            }
            if (gameMode === "timed") {
                gameSelectionBox3.flashArrows();

            }
        }
        if (levelSelectScreen && levelSelectScreen.container.visible) {

            if (levelSelectScreen.levelBox.highlighter.alpha === 1) {
                levelSelectScreen.levelBox.highlighter.alpha = 0;
            } else {
                levelSelectScreen.levelBox.highlighter.alpha = 1;
            }

        }
        if (survivalLevelSelectScreen && survivalLevelSelectScreen.container.visible) {

        }

        if (titleScreen.container.fading) {
            titleScreen.fade();
        }
        if (gameSelectScreen.container.fading) {
            gameSelectScreen.fade();

        }
        if (levelSelectScreen && levelSelectScreen.container.fading) {
            levelSelectScreen.fade();
        }
        if (survivalLevelSelectScreen && survivalLevelSelectScreen.container.fading) {
            survivalLevelSelectScreen.fade();
        }

        if (started && !atBat && !destroyingBlocks) {
            if (counter-lastLanded >= ARETime) {
                releasePiece(4);

                if (queue.length !== 2) {
                    queuePieces(1)
                }
                if (released%bagSize === 0) {
                    queueNewBag()
                }
            }
        }

        if (started && gameMode === "survival") {
            countDownGameTime()
        } else if (started && gameMode === "timed") {
            countDownGameTime()
        }
        if (atBat) {
            
            if (ghostPiece) {
                if (!atBat.ghost) {
                    atBat.birthGhost()
                }
            }
            checkKeyInputs();
            if (startedDragLocation && !swipingDown) {
                if (atBat.fallSpeed !== forcedFallRate && 
                Math.abs(touchingAtLastFrame.y-touchingAt.y) < 30 && 
                counter-startedDragTime > 3 && 
                Math.abs(startedDragLocation.x-touchingAt.x) > dragDeadZoneX) {
                    atBat.shift(-(startedDragLocation.x-touchingAt.x)/Math.abs(startedDragLocation.x-touchingAt.x),-(startedDragLocation.x-touchingAt.x)/Math.abs(startedDragLocation.x-touchingAt.x))
                    startedDragLocation.x = touchingAt.x;
                }

            };
            if (atBat.fallSpeed === forcedFallRate && startedDragTime === counter) {
                atBat.dropped = false;
                atBat.forced = false;
                atBat.fallSpeed = globalFallSpeed;
                cancelledDrop = true;
            }
        if (counter !== 0 && counter-atBat.born > atBat.fallSpeed && atBat.born !== counter && atBat.born !== counter-1 && counter !== atBat.born+atBat.fallSpeed && (counter-atBat.born) % atBat.fallSpeed === 0) {
            if (gameMode !== "survival" && gameMode !== "timed" && (atBat.forced || atBat.dropped)) {
                forceBonus++;
            }
            
            atBat.advance()
             
        }
        if (atBat && (atBat.forced || atBat.dropped)) {
            if (forcedFallRate === 0) { // instant drop
                atBat.goToBottom()
            }
        }
    }
        if (destroyingBlocks) {
            if ((counter-linesScored) < 18) {
                if (lineRows.length === 4) {
                    flashBG();
                }
                if ((counter-linesScored) % 2 === 0 ) {
                    for (var i=0;i<lineRows.length;i++) {
                       lineCovers[i].width += blockSize;
                    }

                };

            } else {
                if (invisibleMode) {
                    changeBlockVisibility(false);
                };
                for (var i=0;i<lineRows.length;i++) {
                    removeLine(lineRows[i]);
                }
                for (var i=0;i<lineCovers.length;i++) {
                    lineCovers[i].width = 0;
                }
                destroyingBlocks = false;
                if (lineRows.length === 4) {
                    fourLineFlasher.visible = false;
                }
                lineRows = [];
                lineCovers = [];
                if (leveledThisFrame) {
//                    lineSound.stop();
                    if (SFXOn) {
                        levelUpSound.play();
                    }
                    leveledThisFrame = false;
                }
            }

        }

        if (touchingAt) {
            touchingAtLastFrame = touchingAt;
        }

    } else { // lost >= 0
        
        curtain.drop();
        if (BGMusic) {
            BGMusic.normal.stop();
        };
    }

    // timeSinceLastDrawn = Date.now()-lastDrawn;

    if (started) {
        counter++
    }

    renderer.render(stage);
    lastDrawn = Date.now();
    game = requestAnimationFrame(update);

};
