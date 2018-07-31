currentBag = []
bagSize = 7
queueNewBag()
pieceIndex = 0
function queueNewBag() {
    typeQueue.length = 0
    var shuffled2Set = []
    for (var i=0;i<bagSize;i++) {
        var index = i
        if (index >= 7) {
            index -= 7
        }
        // console.log("pushing a " + pieceTypes[index])
        shuffled2Set.push(pieceTypes[index])
    }
    shuffle(shuffled2Set)
    for (var i=0;i<shuffled2Set.length;i++) {
        typeQueue.push(shuffled2Set[i])
    }

    // console.log("new queue ")
    // console.log(typeQueue)

}

function queuePieces(num) {
    

    for (var i=0; i<num; i++) {
        var current = new Tetro(typeQueue[pieceIndex],currentLevel);

        current.compensateForShape()
        current.container.x = queueDisplay.bg.x+borderBuffer;
        current.container.y = queueDisplay.container.y+topSpace+queueDisplay.border.thickness+miniBlockSize;

        current.container.y += (queueSlotHeight)*(i);
        // if (i === num-1) {
        //     lowestQueuePositionX = current.container.x;
        //     lowestQueuePositionY = current.container.y;
        // }
        current.container.x += miniBlockSize + queueDisplay.border.thickness;
        current.container.y += miniBlockSize + queueDisplay.border.thickness;
        current.container.y -= miniBlockSize;
        if (current.type === "eye") {
            current.container.x -= miniBlockSize/2;
            current.container.y -= miniBlockSize/2;
        }
        if (current.type === "owe") {
            current.container.x += miniBlockSize/2;
            current.container.y += miniBlockSize;
        }

       if (i>1) {
           console.log("i is " + i + " and making invisible")
        //    current.container.visible = false;
       } else {
           console.log("i is " + i + " and showing")
       }



        queue.push(current);
    }

}

function releasePiece(position) {
    released++
    
    // console.log("released now " + released)
    atBat = queue[0];
    pieceStats[atBat.type]++
    updateStatArea()
    atBat.fallSpeed = globalFallSpeed;
    if (!atBat.container.visible) {
        atBat.container.visible = true;
    }
    atBat.container.scale.x *= miniBlockFactor;
    atBat.container.scale.y *= miniBlockFactor;
    atBat.container.x = pieceBG.x+(blockSize*position);
    atBat.lane = position;
    atBat.row = 0;
    atBat.container.x = Math.round(atBat.container.x);
    atBat.container.y = Math.round(atBat.container.y);
    atBat.container.y = pieceBG.y;
    atBat.born = counter;
    pieceContainer.setChildIndex(atBat.container,1);
    if (atBat.container.alpha < 1) {
        atBat.container.alpha = 1;
    }
    if (atBat.type)
    atBat.compensateForShape();

    if (atBat.edges.bottom > atBat.actualHeight-1) {
        var fromTop = atBat.edges.bottom-(atBat.actualHeight-1);
    } else {
        var fromTop = 0;
    }
    if (atBat.type === "eye") {
        atBat.shift(-1,-1);
    }
    atBat.container.y -= fromTop*blockSize;
    atBat.row -= fromTop;
    queue.shift();
//     for (var i=0; i<queueLength; i++) {
//         if (queue[i]) {
//             queue[i].container.y -= queueSlotHeight;
// //            queue[i].container.alpha = 1-((1/queueLength)*i);
//         }
//     }
//    var newborn = new Tetro("owe",1);

    // if (queueVisible === 0) {
    //     var current = new Tetro(typeQueue[0],currentLevel);
    //     queue.push(current);
    //     current.container.visible = false;
    // } else {


    // // var newborn = new Tetro(typeQueue[0],currentLevel);

    // // newborn.compensateForShape();
    // // newborn.container.x = queueDisplay.bg.x;

    // // newborn.container.y = lowestQueuePositionY;
    // // newborn.container.x = lowestQueuePositionX;
    // // newborn.container.x += miniBlockSize + queueDisplay.border.thickness;
    // // newborn.container.y += miniBlockSize + queueDisplay.border.thickness;
    // // newborn.container.y -= miniBlockSize;

    // // if (newborn.type === "eye") {
    // //     newborn.container.x -= miniBlockSize/2;
    // //     newborn.container.y -= miniBlockSize/2;
    // // }
    // // if (newborn.type === "owe") {
    // //     newborn.container.x += miniBlockSize/2;
    // //     newborn.container.y += miniBlockSize;
    // // }
    // // queue.push(newborn);
    // };
}

function Block(ownerType,posX,posY,color,white) {
    this.bg = new PIXI.Sprite(blockBGText);
    this.owner = undefined;
    if (skin === "NES") {
        this.middle = new PIXI.Sprite(blockCenterText);
        this.highlight = new PIXI.Sprite(blockHighlightText);
    } else if (skin === "GB") {
        this.middle = new PIXI.Sprite(blockCenterText);
        if (ownerType === "ell") {
            this.blockText = new PIXI.Sprite(gbEllText)
        }
        if (ownerType === "ess") {
            this.blockText = new PIXI.Sprite(gbEssText)
        }
        if (ownerType === "tee") {
            this.blockText = new PIXI.Sprite(gbTeeText)
        }
        if (ownerType === "jay") {
            this.blockText = new PIXI.Sprite(gbJayText)
        }
        if (ownerType === "zee") {
            this.blockText = new PIXI.Sprite(gbZeeText)
        }
        if (ownerType === "eye" || ownerType === "owe") {
            this.blockText = new PIXI.Sprite(gbWhiteText)
        }
        this.blockText.width = this.blockText.height = blockSize
    }
    var white = pieceInfo[ownerType].white;
    this.container = new PIXI.Container();
    this.container.addChild(this.bg);
    if (skin === "NES") {
        this.container.addChild(this.middle);
        this.container.addChild(this.highlight);
    } else if (skin === "GB") {
        // this.container.addChild(this.middle);
        this.container.addChild(this.blockText);
    }
    
    this.ownerType = ownerType;
    if (skin === "NES") {
        this.bg.tint = this.middle.tint = color;
        if (white) {
            this.middle.tint = 0xffffff;
        }
    }
    this.container.width = this.container.height = blockSize;
    this.container.x = posX
    this.container.y = posY
    blocks.push(this);

}



function Tetro(type,level,ghost) {
    if (!ghost) {
        pieceIndex++
        if (pieceIndex === 7) {
            pieceIndex = 0
        }
        pieceHistory.push(type);
    }
    this.container = new PIXI.Container();
    this.container.x = 0;
    this.container.y = 0;
    this.lane = undefined;
    this.row = undefined;
    this.type = type;
    this.positions = {};
    this.position = "initial";
    this.componentBlocks = [];
    this.lastShifted = -1;
    this.bottomRow = 8

    var white = false;
    var color = colors[colorForLevel(currentLevel)][1];

    this.born = -1;
    this.forced = false;
    this.dropped = false;
    this.droppedAt = -1;
    this.fallSpeed = globalFallSpeed;

    this.bgSize = 3;

    this.offsetX = 0;
    this.offsetY = 0;

    this.ghost = undefined
    this.foundBottom = false

    this.bgSize = pieceInfo[type].bgSize;
    this.anchorPoint = pieceInfo[type].anchorPoint;
    this.positions.initial = pieceInfo[type].initialPositions;
    var white = pieceInfo[type].white;
    if (pieceInfo[type].color) {
        color = colors[colorForLevel(currentLevel)][0];
    }

    this.bg = new PIXI.Sprite(pixelText);
    this.bg.width = this.bg.height = blockSize*this.bgSize;
    this.bg.x = this.container.x;
    this.bg.y = this.container.y;
    this.bg.tint = 0x0000ff;
    this.bg.alpha = 0;

    for (var i=0;i<4;i++) {
        var newBlock = new Block(this.type,this.bg.x+(blockSize*this.positions.initial[i][0]),this.bg.y+(blockSize*this.positions.initial[i][1]),color,white);
        this.componentBlocks.push(newBlock);
        newBlock.owner = this;
        this.container.addChild(this.componentBlocks[i].container);
        // blocks.push(newBlock)
    }

    this.container.addChildAt(this.bg,0)

    this.container.scale.x /= miniBlockFactor;
    this.container.scale.y /= miniBlockFactor;

    pieceContainer.addChild(this.container);

    // this.container.width = Math.round(this.container.width)
    // this.container.height = Math.round(this.container.height)

    // this.container.cacheAsBitmap = true

//    this.container.alpha = 1/queueLength;

    this.changeColor = function(newColor) {
        // this.container.cacheAsBitmap = false
        for (var c=0;c<this.componentBlocks.length;c++) {
            var block = this.componentBlocks[i];
            if (block.ownerType !== "eye" && block.ownerType !== "owe" && block.ownerType !== "tee") {
                if (block.ownerType === "ell" || block.ownerType === "zee") {
                    block.bg.tint = block.middle.tint = colors[levelColors][0];
                } else {
                    block.bg.tint = block.middle.tint = colors[levelColors][1];
                }
            } else {
                block.bg.tint = colors[levelColors][1]
            };
        }
        // this.container.cacheAsBitmap = true
    }

    this.applyToGrid = function() {
        var startingRow = this.row;
        var startingColumn = this.lane;
        for (var i=0; i<4; i++) {
            if (startingRow+this.positions.initial[i][1] >= 0) {
                grid[startingRow+this.positions.initial[i][1]][startingColumn+this.positions.initial[i][0]] = this.componentBlocks[i];
            } else {
                lost = counter;
                return;
            }
        }
    }
    this.touchingGrid = function(aheadX,aheadY) {
        var startingRow = this.row+aheadY;
        if (this.row < 0) {
            startingRow = 0;
        }
        var startingColumn = this.lane+aheadX;
        for (var i=0; i<4; i++) {
            if (grid[startingRow+this.positions.initial[i][1]] && grid[startingRow+this.positions.initial[i][1]][startingColumn+this.positions.initial[i][0]] !== 0) {
                return true;
            };
        }
        return false;
    }
    this.birthGhost = function() {
        this.ghost = new Tetro(this.type,currentLevel,true)
        
        this.ghost.container.width = this.container.width
        this.ghost.container.height = this.container.height
        this.ghost.container.x = this.container.x
        this.ghost.container.y = this.container.y
        
        this.ghost.position = this.position
        if (this.ghost.position === "left") {
            this.ghost.turn("ccw",false)
        } else if (this.ghost.position === "right") {
            this.ghost.turn("cw",false)
        } else if (this.ghost.position === "inverted") {
            this.ghost.turn("cw",false)
            this.ghost.turn("cw",false)
        }

        this.ghost.compensateForShape()
        this.projectGhost()
        this.ghost.container.alpha = 0.25
        // this.ghost.lastTapped = -99
        // this.ghost.container.interactive = true
        // this.ghost.container.on('pointerdown',function(){
        //     if (counter-this.lastTapped < 15) {
        //         atBat.goToBottom()
        //     } else {
        //         this.lastTapped = counter
        //     } 
        // })
        
    }
    this.projectGhost = function() {
        // console.log("projecting ghost at " + counter)
        this.ghost.row = this.row
        this.ghost.lane = this.lane
        this.ghost.goToBottom(true)
    }
    this.land = function(test) {
        lastLanded = counter
        // this.container.cacheAsBitmap = false
        this.compensateForShape();
        this.applyToGrid();
        if (this.ghost) {
            this.ghost.container.destroy()
        }

        for (var i=0; i<grid.length; i++) {
            var row = grid[i];
            var filled = 0;
            for (var k=0; k<row.length; k++) {

                if (row[k] !== 0) {
                    filled++
                    if (filled === 10) {
                        lineRows.push(i);
                        lineCount++;
                        if (gameMode === "endless") {
                            lineScore.container.removeChildren(true);
                            lineScore = undefined;
                            lineScore = new TextNumeral(miniBlockSize,0,(topSpace/2)-miniBlockSize/2,lineCount,3);
                            lineScore.container.x += miniBlockSize/4+linesDisplay.label.width+(window.innerWidth-(playfield.sizeX+sideBarWidth))/2;
                            linesDisplay.fullHeader.addChild(lineScore.container);
                        };
                        linesScored = counter;
//                        if (lineCount > 0 && lineCount % 1 === 0) {
                        if (lineCount > 0 && lineCount === 10+(currentLevel*10)) {
                            currentLevel++;
                            leveledThisFrame = true;
                            levelScore.container.removeChildren();
                            levelScore = undefined;
                            levelScore = new TextNumeral(miniBlockSize,levelDisplay.label.x+(levelDisplay.label.width/2),miniBlockSize/2+scoreDisplay.bg.height+queueDisplay.bg.height+levelDisplay.bg.height,currentLevel,2);
                            levelScore.container.x -= levelScore.container.width/2;
                            changeBlockColorsToLevel(colorForLevel(currentLevel));
                            establishFallSpeedForLevel();
                            if (gameMode === "survival") {
                                // var timeBonus = currentLevel*2;
                                // gameTime += timeBonus;
                                // linesDisplay.fullHeader.removeChild(lineScore.container)
                                // lineScore = undefined;
                                // lineScore = new TextNumeral(miniBlockSize,0,(topSpace/2)-miniBlockSize/2,gameTime,3);
                                // lineScore.container.x = linesDisplay.label.x+linesDisplay.label.width
                                // linesDisplay.fullHeader.addChild(lineScore.container);
                            }
                        }
                    }
                }
            }
        }

        if (linesScored === counter) {
            if (invisibleMode) {
                changeBlockVisibility(true);
            };
            if (gameMode === "survival") {
                var timeBonus = timeBonuses[lineRows.length-1]
                gameTime += timeBonus;
                lineScore.changeNumber(gameTime);
            }
            
            if (leveledThisFrame) {
                var scoringLevel = (currentLevel-1)
            } else {
                var scoringLevel = currentLevel;
            }
            if (SFXOn) {
                if (lineRows.length === 4) {
                    fourLineSound.play();
                } else {
                    lineSound.play();
                }
            }
            if (gameMode === "endless") {
                playerScore += multiLineBonuses[lineRows.length-1]*(scoringLevel+1);
                playerScoreNumber.container.removeChildren(true);
                playerScoreNumber = new TextNumeral(miniBlockSize,playfield.sizeX+scoreDisplay.border.thickness+borderBuffer,scoreDisplay.label.y+(miniBlockSize*6),playerScore,6)
                if (playerScore > topEndlessScore) {
                    topEndlessScore = playerScore;
                    topScoreNumber.changeNumber(topEndlessScore)
                }
            }
            if (gameMode==="survival") {
                if (playerScore > topSurvivalScore) {
                    topSurvivalScore = playerScore;
                    topScoreNumber.changeNumber(topSurvivalScore)
                }
            }
            if (gameMode === "timed") {
                playerScore = lineCount
                playerScoreNumber.container.removeChildren(true);
                playerScoreNumber = new TextNumeral(miniBlockSize,playfield.sizeX+scoreDisplay.border.thickness+borderBuffer,scoreDisplay.label.y+(miniBlockSize*6),playerScore,6)
                if (playerScore > topEndlessScore) {
                    topTimedScore = playerScore;
                    topScoreNumber.changeNumber(topTimedScore)
                }
            }
            
            destroyingBlocks = true;
            for (var i=0;i<lineRows.length;i++) {
                if (lineCovers[lineRows[i]] === undefined) {
                    var cover = lineCover(lineRows[i])
                    pieceContainer.addChild(cover)
                    lineCovers.push(cover)
                }
            }
        } else {
            if (SFXOn) {
                thudSound.play();
            }
            if (forceBonus > 0) {
                playerScore += forceBonus-1;
                playerScoreNumber.container.removeChildren(true);
                playerScoreNumber = new TextNumeral(miniBlockSize,playfield.sizeX+scoreDisplay.border.thickness+borderBuffer,scoreDisplay.label.y+(miniBlockSize*6),playerScore,6)
                forceBonus = 0;
                if (gameMode === "endless") {
                    if (playerScore > topEndlessScore) {
                        topEndlessScore = playerScore;
                        topScoreNumber.changeNumber(topEndlessScore)
                    }
                }
            }
        };

        if (invisibleMode) {
            for (var i=0;i<atBat.componentBlocks.length;i++) {
                atBat.componentBlocks[i].container.visible = false;
                obscuredBlocks.push(atBat.componentBlocks[i]);
            }

        }
        if (lost < 0) {
            atBat = undefined;
        };
    }

    this.positionAfterTurning = function(direction) {
        var newPos = undefined;
        if (direction === "cw") {
            if (this.position === "initial") {
                newPos = "right";
            } else if (this.position === "right") {
                if (this.type === "ell" || this.type === "jay" || this.type === "tee") {
                    newPos = "inverted";
                } else {
                    newPos = "initial";
                }
            } else if (this.position === "left") {
                newPos = "initial";
            } else if (this.position === "inverted") {
                newPos = "left";
            }
        } else {
            if (this.position === "initial") {
                newPos = "left";
            } else if (this.position === "right") {
                newPos = "initial";
            } else if (this.position === "left") {
                if (this.type === "ell" || this.type === "jay" || this.type === "tee") {
                    newPos = "inverted";
                } else {
                    newPos = "initial";
                }
            } else if (this.position === "inverted") {
                newPos = "right";
            }
        }
        return newPos;
    }

    this.edges = {left:undefined,right:undefined,bottom:undefined}

    this.compensateForShape = function() {
        var lowestX = 4;
        var highestY = 0;
        var lowestY = 4;
        var highestX = 0;
        for (var m=0;m<4;m++) {

            if (this.positions.initial[m][0] < lowestX) {
                lowestX = this.positions.initial[m][0];
            }
            if (this.positions.initial[m][1] > highestY) {
                highestY = this.positions.initial[m][1]
            }
            if (this.positions.initial[m][1] < lowestY) {
                lowestY = this.positions.initial[m][1];
            }
            if (this.positions.initial[m][0] > highestX) {
                highestX = this.positions.initial[m][0]
            }

        }
        this.actualWidth = highestX-lowestX+1;
        this.actualHeight = highestY-lowestY+1;

        this.edges.left = this.lane+lowestX;
        this.edges.right = (this.lane+this.bgSize)+(highestX-this.bgSize);
        this.edges.bottom = (this.row+this.bgSize)+(highestY-this.bgSize);



    }

    this.transform = function(direction,tentative) {
        // this.container.cacheAsBitmap = false
        if (this.type === "zee" || this.type === "ess" || this.type === "eye") {
            if (this.position === "initial") {
                direction = "cw";
            } else {
                direction = "ccw"
            }
        }

        var newPattern = [ [],[],[],[] ];

        for (var i=0;i<this.positions.initial.length;i++) {
            // subtract anchor point from every coordinate
            newPattern[i][0] = this.positions.initial[i][0]-this.anchorPoint[0];
            newPattern[i][1] = this.positions.initial[i][1]-this.anchorPoint[1];
            // swap x and y of each
            var newX = newPattern[i][1];
            newPattern[i][1] = newPattern[i][0];
            newPattern[i][0] = newX;
            // change sign of x or y
            if (direction === "ccw") {
                 newPattern[i][1] *= -1;
            } else {
                newPattern[i][0] *= -1;
            }
            // add anchor point back to each
            newPattern[i][0] += this.anchorPoint[0];
            newPattern[i][1] += this.anchorPoint[1];
        }

        for (var k=0;k<4;k++) {
            this.componentBlocks[k].container.x = this.bg.x+(blockSize*newPattern[k][0])
            this.componentBlocks[k].container.y = this.bg.y+(blockSize*newPattern[k][1])
        }
        this.positions.initial = newPattern;
        this.position = this.positionAfterTurning(direction);
        this.compensateForShape();
        if (tentative && (this.edges.left < 0 || this.edges.right > blocksPerWidth-1 || this.touchingGrid(0,0) || this.edges.bottom > 19)) {
            if (direction === "cw") {
                this.transform("ccw",false)
            } else {
                this.transform("cw",false)
            }
//            this.shift(-this.edges.left,-this.edges.left);
//            console.log("compensating right " + (-this.edges.left))
        }
        // this.container.cacheAsBitmap = true
        
    }

    // this.container.interactive = true;
    // this.container.buttonMode = true;

    this.advance = function(test) {
        this.compensateForShape();
        if (test) {
            // console.log("test row now " + this.row)
            // console.log("tester !touchingGrid(0,1) " + !this.touchingGrid(0,1)+ " and edges.bottom < 19 " + (this.edges.bottom < 19))
            // console.log("tester edges.bottom " + this.edges.bottom)
            if (!this.touchingGrid(0,1) && this.edges.bottom < 19) {
                this.container.y += blockSize;
                // console.log("moving ghost down...")
                
                this.row++;
            } else {
                // console.log("ENDING LOOP!")
                // console.log("tester !touchingGrid(0,1) " + !this.touchingGrid(0,1)+ " and edges.bottom < 19 " + (this.edges.bottom < 19))
                // console.log("tester edges.bottom " + this.edges.bottom)
                this.foundBottom = true
                this.bottomRow = this.row
                // console.log("declaring ghost bottom " + this.row)
            }
        } else {
            if (!this.touchingGrid(0,1) && this.edges.bottom < 19) {
                this.container.y += blockSize;
                this.row++;
            } else {
                this.land();
                if (this.row < 0) {
                    lost = counter;
                    curtain = new Curtain();
                    if (SFXOn) {
                        deathSound.play();
                    }
                    if (invisibleMode) {
                        changeBlockVisibility(true);
                    };
    //                BGMusic.fast.stop();
    //                BGMusic.normal.stop();
                }
            }
        }
    }
    this.goToBottom = function(test) {
        this.compensateForShape();
        if (!test) {
            while (lastLanded < counter) {
                this.advance()
            }
        } else {
            while (!this.foundBottom) {
                this.advance(true)
            }
            
        }
    }

    this.seekCursor = function() {
        if (touchingAt.x > pieceBG.x && touchingAt.x < pieceBG.x+pieceBG.width) {

            var boxWidth = this.container.width/blockSize;
            var laneOfCenter = this.lane
            if (this.type !== "ess" && this.type !== "zee") {
                var laneTouching = lanePointIsIn(touchingAt.x)-this.anchorPoint[0];
            } else {
                var laneTouching = lanePointIsIn(touchingAt.x)-1;
            }
            if (this.type === "owe") {
                laneTouching += 0.5;
            }

            if (laneOfCenter < laneTouching) {
                this.shift(1,1);
            } else if ( laneOfCenter > laneTouching) {
                this.shift(-1,-1);
            }

        };
    }

    this.shift = function(spaces,lanes) {
        var spacesToMove = spaces;
        this.compensateForShape()
        if ( ((spaces>0 && !this.touchingGrid(1,0)) || (spaces<0 && !this.touchingGrid(-1,0))) && ( (spaces > 0 && this.edges.right < blocksPerWidth-1) || (spaces < 0 && this.edges.left > 0) ) )  {
            this.container.x += (spaces*blockSize);
            this.lane += lanes;
            if (SFXOn && this.born !== counter) {
                moveSound.stop();
                moveSound.play();
            };
            this.lastShifted = counter;
            if (this.ghost) {
                this.ghost.container.destroy()
                this.ghost = undefined
                this.birthGhost()
            }
        } else {

        }
//        if (this.touchingGrid(0,0)) {
//            this.container.x -= Math.round(spaces*blockSize);
//            this.lane -= lanes;
//            console.log("MOVED BUMP")
//        }
//        console.log("moved TO LANE " + this.lane)

    }

    this.turn = function(direction,tentative) {
        var origPosition = this.position;
        this.transform(direction,tentative);
        if (this.ghost) {
            this.ghost.container.destroy()
            this.ghost = undefined
            this.birthGhost()
        }
        if (this.position !== origPosition) {
            if (SFXOn) {
                turnSound.stop();
                turnSound.play();
            }
        }
    }

    this.container.spin = function(direction) {
        if (direction === "cw") {
            this.rotation += Math.PI/2;
        } else {
            this.rotation -= Math.PI/2;
        }
    }

}