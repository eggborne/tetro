function countDownGameTime() {
    if ((atBat && !atBat.dropped) && counter > 0 && counter % 60 === 0) {
            
            if (SFXOn && gameTime < 5) {
                selectSound.play();
            }
            
            if (gameMode === "survival") {
                gameTime--;
                lineScore.changeNumber(gameTime)
                playerScore += 1;
                playerScoreNumber.container.removeChildren(true);
                playerScoreNumber = new TextNumeral(miniBlockSize,playfield.sizeX+scoreDisplay.border.thickness+borderBuffer,scoreDisplay.label.y+(miniBlockSize*6),playerScore,6)
                if (gameTime === 0) {
                    lost = counter;
                    curtain = new Curtain();
                    if (BGMusic !== undefined) {
                        BGMusic.normal.stop();
                    };
                    if (invisibleMode) {
                        changeBlockVisibility(true);
                    };
                    if (SFXOn) {
                        deathSound.play();
                    }
                }
            }
            if (gameMode === "timed") {
                timedLimit--;
                lineScore.changeNumber(timedLimit)
                if (timedLimit === 0) {
                    lost = counter;
                    curtain = new Curtain();
                    if (BGMusic !== undefined) {
                        BGMusic.normal.stop();
                    };
                    if (invisibleMode) {
                        changeBlockVisibility(true);
                    };
                    if (SFXOn) {
                        deathSound.play();
                    }
                }


                if (playerScore > topTimedScore) {
                    topTimedScore = playerScore;
                    topScoreNumber.changeNumber(topTimedScore)
                }
            }
            
        }
            
}

function laneBeingTouched() {
    var distanceFromLeft = Math.abs(cursor.x-(pieceBG.x+pieceBuffer))-blockSize/2;

    var actualLane = Math.round(distanceFromLeft/blockSize);
    if ((atBat.type === "zee" || atBat.type === "ess") && (atBat.position === "right" || atBat.position === "left")) {
//        actualLane--;
    }
    if (atBat.type === "eye" && (atBat.position === "right" || atBat.position === "left")) {
//        actualLane -= 3;
    }
    return actualLane;

}

establishFallSpeedForLevel = function() {
    console.log("establishing falll speed at " + counter)
    if (currentLevel <= 28) {
        globalFallSpeed = levelData[currentLevel].fallRate
    } else {
        globalFallSpeed = 1
    }
    console.log("fall speed now " + globalFallSpeed)
}

colorForLevel = function(level) {
    var index = 0;
    var levelString = currentLevel.toString();
    return levelString.charAt(levelString.length-1);
}

function lanePointIsIn(posX) {
    var distanceFromLeft = posX-pieceBG.x;
    var actualLane = Math.floor(distanceFromLeft/blockSize);
    return actualLane;
}

function getActualCoords(origX,origY) {
    var adjScale = 1/container.scale.x;
    return {x:adjScale*(origX-currentSize.x/2)+(currentSize.x/2), y: adjScale*(origY-currentSize.y/2)+(currentSize.y/2)};
}

function distanceFromABtoXY(a,b,x,y) {
    var distanceX = x-a;
    var distanceY = y-b;
    return Math.round( Math.sqrt( (distanceX*distanceX)+(distanceY*distanceY) ));
}
function pointAtAngle(x,y,angle,distance) {
    return {x:x+distance*Math.cos(angle),y:y+distance*Math.sin(angle)};
};

function angleOfPointABFromXY(a,b,x,y) {
    return Math.atan2(b-y,a-x)+(Math.PI/2);
};

function toPercent(dec) {
    return Math.round(dec*100);
}

function rectangleATouchingB(a,b) {
    var touching = (
        a.contains(b.x,b.y) ||
            a.contains(b.x+b.width,b.y) ||
            a.contains(b.x,b.y+b.height) ||
            a.contains(b.x+b.width,b.y+b.height) ||
            b.contains(a.x,a.y) ||
            b.contains(a.x+a.width,a.y) ||
            b.contains(a.x,a.y+a.height) ||
            b.contains(a.x+a.width,a.y+a.height)
        );
    return touching;
};

shorterDirectionToAngle = function(rot1,rot2) {
    var a = radToDeg(rot1);
    var b = radToDeg(rot2);
    if (b==0) {
        if (a <= 180) {
            return "ccw";

        } else {
            return "cw";

        };
    };
    if (a==0) {
        if (b <= 180) {
            return "cw";

        } else {
            return "ccw";

        };
    };
    if (a >= 270 && b <= 90) {
        return "cw";

    };
    if (b >= 270 && a <= 90) {
        return "ccw";
    };
    var diff = Math.abs(b-a);
    if (diff > 180) {
        var dist = Math.abs(diff-360);
        // it's the longer distance!
    } else {
        var dist = Math.abs(diff);
        // it's the shorter distance!
    };
    if (a+dist == b) {
        return "cw"

    } else {
        return "ccw";

    };
};

quadrantOfRadians = function(radians) {
    var quadrant = 0;
    if (radians >= 0 && radians < Math.PI/2) {
        quadrant = 1;
    } else if (radians >= Math.PI/2 && radians < Math.PI) {
        quadrant = 2;
    } else if (radians >= Math.PI && radians < Math.PI*1.5) {
        quadrant = 3;
    } else if (radians >= Math.PI*1.5 && radians < Math.PI*2) {
        quadrant = 4;
    };
    return quadrant;
};

degToRad = function(radians) {
    return radians*(Math.PI/180);
};

radToDeg = function(radians) {
    deg = radians*(180/Math.PI);
    if (deg < 0) {
        deg += 360;
    } else if (deg > 359) {
        deg -= 360;
    };
    return radians*(180/Math.PI);
};

function reset() {
    document.body.removeChild(renderer.view);
    clearTimeout(game);
    init(window.innerWidth,window.innerHeight);
};

function fullscreen() {
    var el = document.body;
//    fullScreen = true;
    if (el.webkitRequestFullscreen) {

        el.webkitRequestFullscreen();
    } else {

        el.mozRequestFullScreen()
    }

}

function exitFullscreen() {
//    fullScreen = false;
    if (document.exitFullScreen) {
        document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }

};

function randomColor() {
    var characters = [0,"x"];
    while (characters.length < 8) {
        characters.push(hexDigits[randomInt(0,15)]);
        while (characters[0] > hexDigits[5]) {
            characters.splice(0,1);
            characters.push(hexDigits[randomInt(0,15)]);
        };
    };
    return characters.join("");
};

function checkKeyInputs() {
    if (((counter-lastLanded) >= ARETime*2 && !atBat.forced && pressingS) || pressedSAt === counter || atBat.droppedAt === counter) {
        atBat.forced = true;
        atBat.fallSpeed = forcedFallRate;
    }
    if (!hardDrop && !pressingS && atBat.forced) {
        atBat.forced = false;
        atBat.fallSpeed = globalFallSpeed;
    }
    if (pressingA) {
        var sincePressed = counter-pressedAAt
        if (pressedAAt === counter || (sincePressed) === DASTime || sincePressed>DASTime && sincePressed % DASInterval === 0 ) {
            atBat.shift(-1,-1);
        };
    }
    if (pressingD) {
        var sincePressed = counter-pressedDAt
        if (pressedDAt === counter || (counter-pressedDAt) === DASTime || sincePressed>DASTime && sincePressed % DASInterval === 0 ) {
            atBat.shift(1,1);
        };
    }
    if (pressingQ) {
        if (pressedQAt === counter || clicked === counter) {
            atBat.turn("ccw",true);
        };
    }
    if (pressingE) {
        if (pressedEAt === counter || rightClicked === counter) {
            atBat.turn("cw",true);
           
        };
    }
}

function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getScoresFromDatabase(gameName,populate,display) {
    console.log("CALLING FOR SCORES!!")
    if (gameName === "tetro-endless") {
        var scoreArray = endlessScoreArray
    }
    if (gameName === "tetro-survival") {
        var scoreArray = survivalScoreArray
    }
    if (gameName === "tetro-timed") {
        var scoreArray = timedScoreArray
    }
    $.ajax({ type: "get",   
        url: "/scripts/getscores.php",
        data: {game:gameName},
        
        success : function(text)
        {   
            scoreArray.length = 0
            pairArray = text.split(" - ")
            for (item in pairArray) {
                if (scoreArray.length < 10) {
                    var scoreEntry = pairArray[item].split(" ")
                    var literalName = scoreEntry[0]
                    if (scoreEntry.length > 2) {
                        var fixedEntry = []
                        fixedEntry[1] = scoreEntry.pop()
                        fixedEntry[0] = scoreEntry.join(" ")
                        scoreArray.push(fixedEntry)
                    } else if (scoreEntry.length === 2) {
                        scoreArray.push(scoreEntry)
                    }
                }
            }
            if (!populate) {
                curtain.container.visible = false
                var tenth = scoreArray[scoreArray.length-1][1]
                console.log("last place score is " + tenth)
                console.log("player score is " + playerScore)
                if (scoreArray.length < 10) {
                    console.log("only " + scoreArray.length + "scores though, so score goes in!") 
                    tenth = 0
                }
                if (playerScore > 0 && playerScore > tenth) {
                    if (gameMode === "endless") {
                        endlessNameEntryScreen.container.visible = true
                    }
                    if (gameMode === "survival") {
                        survivalNameEntryScreen.container.visible = true
                    }
                    if (gameMode === "timed") {
                        timedNameEntryScreen.container.visible = true
                    }
                    $('#nameentry').css('display','block')
                } else {
                    resetToTitle()
                }
            } else {
                if (scoreArray.length > 0) {
                    updateScoreboard(scoreArray)
                }
                if (display) {
                    highScoreScreen.container.visible = true
                }
            }
        },
        error: function(){
            console.log('Could not connect to get!');
            scoreArray = [["cunts",1212]]
        }
    });

}
function saveScoreToDatabase(gameName,playerName,playerScore,reset) {
    
    $.ajax({ type: "post",   
        url: "/scripts/savescores.php", 
        data: {game:gameName,name:playerName,score:playerScore},
        success : function(data)
        {
            getScoresFromDatabase(gameName,true)
            if (reset) {
                resetToTitle()
                
            }
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}

function getTotalLinesFromDatabase() {
    $.ajax({ type: "get",   
        url: "/scripts/getlines.php",
        
        success : function(text)
        {
            if (text.length < 20) {
                titleScreen.totalLineCount.text = "total lines scored: " + text
                lastKnownCount = text
            } else {
                titleScreen.totalLineCount.text = "total lines scored: unavailable"
            }
            
        },
        error: function(){
            console.log('Could not connect to get lines!');
        }
    });

}
function sendLinesScoredToDatabase(numOfLines) {
    $.ajax({ type: "post",   
        url: "/scripts/sendlinesscored.php",
        data: {lines:numOfLines},
        success : function(data)
        {   
            console.log("updating total line count...")
            
            getTotalLinesFromDatabase()
            
            
        },
        error: function(){
            console.log('Could not connect to add lines!');
        }
    });
}
function rankify(num) {
	var lastNum = num.toString()[num.toString().length-1]
	var penultNum = num.toString()[num.toString().length-2]
	var suffix = "th"
	if (lastNum == 1) {
		if (penultNum == 1) { // 11th
			suffix = "th"
		} else {
			suffix = "st" //
		}
	} else if (lastNum == 2) {
		if (penultNum == 1) { // 12th
			suffix = "th"
		} else {
			suffix = "nd"
		}
	} else if (lastNum == 3) {
		if (penultNum == 1) { // 13th
			suffix = "th"
		} else {
			suffix = "rd"
		}
	}
	return num + suffix
}

function resetToTitle() {
    started = false;
    lastLanded = -99
    titleScreen.container.visible = true;
    gameSelectScreen.container.visible = true;
    if (levelSelectScreen) {
        levelSelectScreen.container.visible = true;
    }
    if (survivalLevelSelectScreen) {
        survivalLevelSelectScreen.container.visible = true;
    }
    gameSelectScreen.container.visible = true;
    if (SFXOn) {
        confirmSound.play();
    }

    if (BGMusic) {
        BGMusic.normal.stop;
    }
    game = undefined;
    init();
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffled(array) {

}