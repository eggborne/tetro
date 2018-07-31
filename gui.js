function ToggleBar(owner,posX,posY,sizeX,sizeY,label,toggle1Text,toggle2Text,toggle1Action,toggle2Action,booleanCheck) {
    this.container = new PIXI.Container()
    this.backing = new PIXI.Sprite(pixelText);
    this.backing.tint = 0x222222;
    this.backing.anchor.x = 0;
    this.backing.width = sizeX;
    this.backing.height = sizeY;
    this.backing.x = posX
    this.backing.y = posY
    this.labelText = new PIXI.Text(label,owner.headerTextStyle);
    this.labelText.anchor.x = 0;
    this.labelText.x = this.backing.x+miniBlockSize;
    this.labelText.y = this.backing.y+(this.backing.height/2)-(this.labelText.height/2)
    this.toggleText2 = new PIXI.Text(toggle2Text,owner.onOffTextStyle);
    this.toggleText2.x = this.backing.x+this.backing.width-miniBlockSize-this.toggleText2.width;
    this.toggleText1 = new PIXI.Text(toggle1Text,owner.onOffTextStyle);
    this.toggleText1.x = this.toggleText2.x-miniBlockSize*3-this.toggleText1.width;
    this.toggleText2.y = this.toggleText1.y = this.labelText.y;
    this.toggleText1.highlight = new PIXI.Sprite(pixelText);
    this.toggleText2.highlight = new PIXI.Sprite(pixelText);
    this.toggleText1.highlight.height = this.toggleText2.highlight.height = this.backing.height;
    this.toggleText1.highlight.width = this.toggleText1.width+miniBlockSize*3;
    this.toggleText2.highlight.width = this.toggleText1.highlight.width
    this.toggleText1.highlight.y = this.toggleText2.highlight.y = this.backing.y;
    this.toggleText1.highlight.x = this.toggleText1.x-miniBlockSize*1.5;
    this.toggleText2.highlight.x = this.toggleText2.x-miniBlockSize*1.5;
    this.toggleText1.highlight.interactive = this.toggleText1.interactive = this.toggleText2.interactive = this.toggleText2.highlight.interactive = true;
    this.toggleText1.highlight.tint = this.toggleText2.highlight.tint = menuHighlightColor
    this.toggleText1.highlight.partner = this.toggleText2.highlight
    this.toggleText2.highlight.partner = this.toggleText1.highlight
    this.toggleText2.partner = this.toggleText1
    this.toggleText1.partner = this.toggleText2
    this.toggleText2.x = this.toggleText2.highlight.x+(this.toggleText2.highlight.width/2)-(this.toggleText2.width/2)
    this.toggleText1.highlight.on("pointerdown",function(){
        this.partner.alpha = 0;
        this.alpha = 1;
        toggle1Action()
        if (SFXOn) {
            selectSound.play();
        }

    })
    this.toggleText2.highlight.on("pointerdown",function(){
        this.partner.alpha = 0;
        this.alpha = 1;
        toggle2Action()
        if (SFXOn) {
            selectSound.play();
        }
    })
    this.toggleText1.on("pointerdown",function(){
        this.partner.highlight.alpha = 0;
        this.highlight.alpha = 1;
        toggle1Action()
        if (SFXOn) {
            selectSound.play();
        }
    })
    this.toggleText2.on("pointerdown",function(){
        this.partner.highlight.alpha = 0;
        this.highlight.alpha = 1;
        toggle2Action()
        if (SFXOn) {
            selectSound.play();
        }
    })

    if (booleanCheck) {
        this.toggleText2.highlight.alpha = 0
        this.toggleText1.highlight.alpha = 1
    } else {
        this.toggleText2.highlight.alpha = 1
        this.toggleText1.highlight.alpha = 0
    }

    this.container.addChild(this.backing)
    this.container.addChild(this.labelText)
    this.container.addChild(this.toggleText2.highlight)
    this.container.addChild(this.toggleText1.highlight)
    this.container.addChild(this.toggleText2)
    this.container.addChild(this.toggleText1)
}

function SelectBar(owner,posX,posY,sizeX,sizeY,label,togglesArray) {
    this.container = new PIXI.Container()
    this.selections = []
    this.backing = new PIXI.Sprite(pixelText);
    this.backing.tint = 0x222222;
    this.backing.anchor.x = 0;
    this.backing.width = sizeX;
    this.backing.height = sizeY;
    this.backing.x = posX
    this.backing.y = posY
    this.labelText = new PIXI.Text(label,owner.headerTextStyle);
    this.labelText.anchor.x = 0;
    this.labelText.x = this.backing.x+miniBlockSize;
    this.labelText.y = this.backing.y+(this.backing.height/2)-(this.labelText.height/2)
    


    // this.toggleText2 = new PIXI.Text(toggle2Text,owner.onOffTextStyle);
    // this.toggleText2.x = this.backing.x+this.backing.width-miniBlockSize-this.toggleText2.width;
    // this.toggleText1 = new PIXI.Text(toggle1Text,owner.onOffTextStyle);
    // this.toggleText1.x = this.toggleText2.x-miniBlockSize*2-this.toggleText1.width;
    // this.toggleText2.y = this.toggleText1.y = this.labelText.y;
    // this.toggleText1.highlight = new PIXI.Sprite(pixelText);
    // this.toggleText2.highlight = new PIXI.Sprite(pixelText);
    // this.toggleText1.highlight.height = this.toggleText2.highlight.height = this.backing.height;
    // this.toggleText1.highlight.width = this.toggleText1.width+miniBlockSize*2;
    // this.toggleText2.highlight.width = this.toggleText2.width+miniBlockSize*2;
    // this.toggleText1.highlight.y = this.toggleText2.highlight.y = this.backing.y;
    // this.toggleText1.highlight.x = this.toggleText1.x-miniBlockSize;
    // this.toggleText2.highlight.x = this.toggleText2.x-miniBlockSize;
    // this.toggleText1.highlight.interactive = this.toggleText1.interactive = this.toggleText2.interactive = this.toggleText2.highlight.interactive = true;
    // this.toggleText1.highlight.tint = this.toggleText2.highlight.tint = menuHighlightColor
    // this.toggleText1.highlight.partner = this.toggleText2.highlight
    // this.toggleText2.highlight.partner = this.toggleText1.highlight
    // this.toggleText2.partner = this.toggleText1
    // this.toggleText1.partner = this.toggleText2
    // this.toggleText1.highlight.on("pointerdown",function(){
    //     this.partner.alpha = 0;
    //     this.alpha = 1;
    //     toggle1Action()
    //     if (SFXOn) {
    //         selectSound.play();
    //     }

    // })
    // this.toggleText2.highlight.on("pointerdown",function(){
    //     this.partner.alpha = 0;
    //     this.alpha = 1;
    //     toggle2Action()
    //     if (SFXOn) {
    //         selectSound.play();
    //     }
    // })
    // this.toggleText1.on("pointerdown",function(){
    //     this.partner.highlight.alpha = 0;
    //     this.highlight.alpha = 1;
    //     toggle1Action()
    //     if (SFXOn) {
    //         selectSound.play();
    //     }
    // })
    // this.toggleText2.on("pointerdown",function(){
    //     this.partner.highlight.alpha = 0;
    //     this.highlight.alpha = 1;
    //     toggle2Action()
    //     if (SFXOn) {
    //         selectSound.play();
    //     }
    // })

    // if (booleanCheck) {
    //     this.toggleText2.highlight.alpha = 0
    //     this.toggleText1.highlight.alpha = 1
    // } else {
    //     this.toggleText2.highlight.alpha = 1
    //     this.toggleText1.highlight.alpha = 0
    // }

    this.container.addChild(this.backing)
    this.container.addChild(this.labelText)
    for (var t=0;t<togglesArray.length;t++) {
        if (t%2===0) {
            var toggleText = new PIXI.Text(togglesArray[t],owner.onOffTextStyle);
            toggleText.x = this.backing.x+this.backing.width-miniBlockSize-toggleText.width
            
            toggleText.y = this.labelText.y
            toggleText.highlight = new PIXI.Sprite(pixelText);
            toggleText.highlight.alpha = 0
            if (t===4) {
                toggleText.highlight.alpha = 1
            }
            toggleText.highlight.owner = this
            toggleText.highlight.height = this.backing.height
            toggleText.highlight.width = toggleText.width+(miniBlockSize*2)
            toggleText.highlight.tint = menuHighlightColor
            if (t>0) {
                
                toggleText.x = this.selections[this.selections.length-1].x-(toggleText.width*1.2)
            }
            toggleText.highlight.x = toggleText.x-miniBlockSize;
            toggleText.highlight.y = this.backing.y
            toggleText.interactive = toggleText.highlight.interactive = true
            this.selections.push(toggleText.highlight)
            this.container.addChild(toggleText.highlight)
            this.container.addChild(toggleText)
        } else {
            this.selections[this.selections.length-1].on("pointerdown",togglesArray[t])
        }
        
    }
    
}

function TextButton(owner,text,borderColor,divisor,style,extraWidth,yPadding) {
    this.container = new PIXI.Container()
    if (style) {
        var textStyle = style
    } else {
        var textStyle = owner.startStyle
    }
    this.text = new PIXI.Text(text,textStyle)
    if (yPadding) {
        var vertPadding = yPadding
    } else {
        var vertPadding = 0
    }
    this.bg = new PIXI.Sprite(pixelText)
    if (extraWidth) {
        this.bg.width = (this.text.width+blockSize*1.5)+extraWidth
    } else {
        this.bg.width = this.text.width+blockSize*1.5
    }
    this.bg.height = (this.text.height+blockSize*1.25)+(vertPadding*2)
    this.bg.tint = 0x000000
    this.text.x = (this.bg.width/2)-(this.text.width/2)
    
    this.container.addChild(this.bg)
    if (divisor) {
        var thickness = mainBorderThickness*divisor
    } else {
        var thickness = mainBorderThickness
    }
    this.text.y = (this.bg.height/2)-(this.text.height/2)
    this.border = new Border(borders[borderColor],thickness,this,this.bg.width,this.bg.height,0,0,false,false)
    this.changeBorder = function(newBorder) {
        this.border.container.destroy()
        this.border = new Border(borders[newBorder],thickness,this,this.bg.width,this.bg.height,0,0,false,false)
    
    }
    
    this.container.addChild(this.text)
    owner.container.addChild(this.container)
}

function ScoreEntry(parent) {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.width = parent.displayWidth
	this.bg.height = blockSize*1.45
	// this.bg.anchor.set(0.5)
	this.bg.tint = 0x000000
	this.rankField = new PIXI.Text('',parent.rankStyle)
	this.nameField = new PIXI.Text('',parent.nameStyle)
	this.scoreField = new PIXI.Text('',parent.scoreStyle)
	this.scoreField.anchor.x = 1
	this.rankField.anchor.y = this.nameField.anchor.y = this.scoreField.anchor.y = 0.5
	this.rankField.y = this.nameField.y = this.scoreField.y = this.bg.y+(this.bg.height/2)
    if (landscape) {
        this.rankField.x = this.bg.x+(this.bg.width*0.05)
        this.nameField.x = this.bg.x+(this.bg.width*0.27)
        this.scoreField.x = this.bg.x+(this.bg.width*0.95)
    } else {
        this.rankField.x = this.bg.x+(this.bg.width*0.05)
        this.nameField.x = this.bg.x+(this.bg.width*0.27)
        this.scoreField.x = this.bg.x+(this.bg.width*0.95)
    }
	this.container.addChild(this.bg)
	this.container.addChild(this.rankField)
	this.container.addChild(this.nameField)
	this.container.addChild(this.scoreField)
}

function updateScoreboard(modeArray) {
	for (var e=0;e<modeArray.length;e++) {
		// if (highScoreScreen.scores[e].rankField.text === "") {
			// highScoreScreen.scores[e].rankField.text = rankify(e+1)
		// }
		var entry = modeArray[e]
		var row = e
		var nameString = entry[0].toUpperCase()
		var scoreString = entry[1]
        if (modeArray === endlessScoreArray) {
            highScoreScreen.endlessScores[e].nameField.text = nameString
		    highScoreScreen.endlessScores[e].scoreField.text = scoreString
            if (e === 0) {
                topEndlessScore = entry[1]
            }
        } else if (modeArray === survivalScoreArray) {
            highScoreScreen.survivalScores[e].nameField.text = nameString
		    highScoreScreen.survivalScores[e].scoreField.text = scoreString
            if (e === 0) {
                topSurvivalScore = entry[1]
            }
        } else if (modeArray === timedScoreArray) {
            highScoreScreen.timedScores[e].nameField.text = nameString
		    highScoreScreen.timedScores[e].scoreField.text = scoreString
            if (e === 0) {
                topTimedScore = entry[1]
            }
        }
        
		
		// if (nameString === currentNameEntered.toUpperCase() && scoreString.toString() === playerFootScore.toString()) {
		// 	highScoreScreen.scores[e].rankField.tint = 0x00ff00
		// 	highScoreScreen.scores[e].nameField.tint = 0x00ff00
		// 	highScoreScreen.scores[e].scoreField.tint = 0x00ff00
		// 	var displayY = highScoreScreen.listContainer.origY - ((e-4)*(highScoreScreen.bg.height*0.05))
		// 	if (e > 13) {
		// 		highScoreScreen.listContainer.y = displayY
		// 	}
		// } else {
		// 	highScoreScreen.scores[e].rankField.tint = 0xffffff
		// 	highScoreScreen.scores[e].nameField.tint = 0xffffff
		// 	highScoreScreen.scores[e].scoreField.tint = 0xffffff
		// }
	}
}
function borderedLabelBox(labelSprite,border,bThickness,bufferX,bufferY,selectable) {
    this.container = new PIXI.Container();
    this.label = labelSprite
    this.bg = new PIXI.Sprite(pixelText);
    
    if (selectable) {
        this.container.interactive = true;
        this.selected = false;
        this.container.leftSelectArrow = new PIXI.Sprite(selectArrowText);
        this.container.rightSelectArrow = new PIXI.Sprite(selectArrowText);
        this.container.leftSelectArrow.width = this.container.leftSelectArrow.height = this.container.rightSelectArrow.width = this.container.rightSelectArrow.height = this.label.height;
        this.bg.width = this.label.width + (this.container.leftSelectArrow.width*2) + (bThickness*2) + bufferX*4;
        this.container.leftSelectArrow.y = this.container.rightSelectArrow.y = this.bg.x + bThickness + bufferY;
        this.container.leftSelectArrow.x = this.bg.x + bThickness;
        this.container.rightSelectArrow.scale.x *= -1;
        this.container.rightSelectArrow.x = (this.bg.x+this.bg.width) - bThickness;
        
        // this.container.rightSelectArrow.x -= this.container.rightSelectArrow.width;
        this.container.on("pointerdown",function() {
            this.select(true);
        });
        this.flashArrows = function() {
            if (this.container.visible) {
                this.container.visible = false
                this.container.visible = false
            } else {
                this.container.visible = true;
                this.container.visible = true;
            }
        }
    } else {
        this.bg.width = this.label.width + (bThickness*2) + bufferX*2;
    }

    this.bg.height = this.label.height + (bThickness*2) + bufferY*2;
    this.label.y = this.bg.y + (this.bg.height/2) - (this.label.height/2.1)
    this.container.arrowY = this.bg.y + bThickness + bufferY;
    this.container.addChild(this.bg);

    this.bg.tint = 0x000000;

    var leftBuffer = (this.bg.width-(bThickness*2)-this.label.width)/2;
    if (selectable) {
        this.label.x = this.bg.x + this.container.leftSelectArrow.width + bThickness + bufferX*2;
        this.container.addChild(this.container.leftSelectArrow);
        this.container.addChild(this.container.rightSelectArrow);
        this.selected = true;
        this.flashArrows = function() {
            if (this.container.leftSelectArrow.visible === false) {
                this.container.leftSelectArrow.visible = true;
                this.container.rightSelectArrow.visible = true;
            } else {
                this.container.leftSelectArrow.visible = false;
                this.container.rightSelectArrow.visible = false;
            }
        }
        this.container.select = function(withSound) {
            this.leftSelectArrow.y = this.arrowY;
            this.rightSelectArrow.y = this.arrowY;
            if (SFXOn && withSound) {
                selectSound.play();
            }
        }
    } else {
        this.label.x = this.bg.x + bThickness + bufferX;
    }

    this.border = new Border(borders[border],bThickness,this,this.bg.width,this.bg.height,this.bg.x,this.bg.y);




    this.container.addChild(this.label);

}

function borderedSelectBox(columns,selectionTextArray,border,bThickness,bufferX,bufferY,offOption) {
    this.container = new PIXI.Container();
    this.bg = new PIXI.Sprite(pixelText);
    this.container.addChild(this.bg);
    var numberOfChoices = selectionTextArray.length;
    this.labels = [];

    var boxLabels = this.labels;

    this.selectedChoice = undefined;


    if (offOption) {
        var offLabel = new PIXI.Sprite(offText);
        offLabel.hwRatio = offLabel.height/offLabel.width;
        offLabel.height = blockSize/menuUnitFactor/1.25;
        offLabel.width = offLabel.height/offLabel.hwRatio;
    };
    for (var i=0;i<numberOfChoices;i++) {
        var currentLabel = new PIXI.Sprite(selectionTextArray[i]);
        currentLabel.hwRatio = currentLabel.height/currentLabel.width;
        currentLabel.height = blockSize/menuUnitFactor/1.25;
        currentLabel.width = currentLabel.height/currentLabel.hwRatio;

        var labelNumber = new TextNumeral(currentLabel.height,currentLabel.x+(currentLabel.width+bufferX/2),currentLabel.y,i+1,1);
        var fullEntry = new PIXI.Container();
        fullEntry.numeralWidth = labelNumber.container.width;
        fullEntry.addChild(currentLabel);
        fullEntry.addChild(labelNumber.container);
        if (musicSelections[i].normal.loaded) {
            fullEntry.alpha = 1;
        } else {
            fullEntry.alpha = 0.5;
        }
        fullEntry.selected = false;
        this.labels.push(fullEntry)
        this.container.addChild(fullEntry)
    }

    this.bg.alpha = 1
    this.container.leftSelectArrow = new PIXI.Sprite(selectArrowText);
    var LArrow = this.container.leftSelectArrow;
    this.container.rightSelectArrow = new PIXI.Sprite(selectArrowText);
    var RArrow = this.container.rightSelectArrow;
    this.container.leftSelectArrow.width = this.container.leftSelectArrow.height = this.container.rightSelectArrow.width = this.container.rightSelectArrow.height = this.labels[0].height;



//    this.bg.width = entryWidth + (this.container.leftSelectArrow.width*2) + (bThickness*2) + bufferX*4;
    this.container.leftSelectArrow.y = this.container.rightSelectArrow.y = this.bg.x + bThickness + bufferY;

//    this.container.leftSelectArrow.x = this.bg.x + bThickness;
//    this.container.rightSelectArrow.x = (this.bg.x+this.bg.width) - (bThickness + this.container.rightSelectArrow.width);
    this.container.rightSelectArrow.scale.x *= -1;
    this.container.rightSelectArrow.x -= this.container.rightSelectArrow.width;
    var choicesHigh = (numberOfChoices /= columns);

    if (offOption) {
        choicesHigh++;
    };

    this.bg.height = (bThickness*2) + bufferY*2 + ((choicesHigh)*this.labels[0].height*2) - this.labels[0].height;
    this.bg.tint = 0x000000;

    this.container.addChild(this.container.leftSelectArrow);
    this.container.addChild(this.container.rightSelectArrow);
    this.selected = true;
    this.flashArrows = function() {
        if (this.container.leftSelectArrow.alpha === 0) {
            this.container.leftSelectArrow.alpha = 1;
            this.container.rightSelectArrow.alpha = 1;
        } else {
            this.container.leftSelectArrow.alpha = 0;
            this.container.rightSelectArrow.alpha = 0;
        }
    }

    PIXI.Container.prototype.select = function(withSound) {
        LArrow.x = this.x-LArrow.width-(bufferX*2);
        RArrow.x = this.x+this.numeralWidth+this.width+(bufferX*2);
        LArrow.y = this.y;
        RArrow.y = this.y;

        if (!LArrow.visible) {
            LArrow.visible = true;
            RArrow.visible = true;
        }

        changeMusic(this.selection);

        if (SFXOn && withSound) {
            selectSound.play();
        }

    }
        for (var c=0;c<columns;c++) {

        for (var k=0;k<numberOfChoices;k++) {
            // this.labels[k+(c*numberOfChoices)].x = this.container.x + (c*(this.labels[k].width+this.labels[k].numeralWidth+bufferX*2+LArrow.width)) + bThickness + (bufferX*2) + LArrow.width;
            this.labels[k+(c*numberOfChoices)].x = this.container.x + bThickness + LArrow.width + bufferX*4
    //        this.labels[k].x = this.bg.x + (this.bg.width/2) - (this.labels[k].width/2);
            this.labels[k+(c*numberOfChoices)].y = (this.bg.y + bThickness + bufferY) + (this.labels[0].height*2*k);
            this.labels[k+(c*numberOfChoices)].selection = k+(c*numberOfChoices);
            this.labels[k+(c*numberOfChoices)].interactive = true;


            this.labels[k+(c*numberOfChoices)].on("touchstart",function() {
                if (this.alpha === 1) {
                    this.select(true);
                }
            });
            this.labels[k+(c*numberOfChoices)].on("mousedown",function() {
                if (this.alpha === 1) {
                    this.select(true);
                }
            });

        };
    };

    if (offOption) {

        offLabel.y = this.labels[numberOfChoices-1].y + this.labels[0].height*2;
        this.container.addChild(offLabel);
        this.labels.push(offLabel);
        offLabel.interactive = true;
        offLabel.select = function(withSound) {
            LArrow.x = this.x-(blockSize/menuUnitFactor)-(bufferX*2)
            LArrow.y = this.y;
            RArrow.x = this.x+this.width+(blockSize/menuUnitFactor)+(bufferX*2);
            RArrow.y = this.y;

            if (SFXOn && withSound) {
                selectSound.play();
            }
            if (BGMusic !== undefined) {
                BGMusic.normal.stop();
                BGMusic = undefined;
            };

        }
        offLabel.on("touchstart",function() {
            this.select(true);
        });
        offLabel.on("mousedown",function() {
            this.select(true);
        });


    }

    if (this.container.width > window.innerWidth) {
        var overage = this.container.width - window.innerWidth
        this.container.width = window.innerWidth;
        this.container.x = 0;
    };
    this.bg.width = ((this.labels[0].width)*columns) + (bufferX*columns*4) + (LArrow.width*columns*2) + (bThickness*columns*4);
    offLabel.x = this.bg.x + (this.bg.width/2) - (offLabel.width/2);
    if (BGMusic === undefined) {
        offLabel.select(false);
    } else {
        LArrow.x = this.labels[musicSelections.indexOf(BGMusic)].x-LArrow.width-(bufferX*2);
        RArrow.x = this.labels[musicSelections.indexOf(BGMusic)].x+this.labels[musicSelections.indexOf(BGMusic)].numeralWidth+this.labels[musicSelections.indexOf(BGMusic)].width+(bufferX*2);
        LArrow.y = this.labels[musicSelections.indexOf(BGMusic)].y;
        RArrow.y = this.labels[musicSelections.indexOf(BGMusic)].y;
    }
    this.border = new Border(borders[border],bThickness,this,this.bg.width,this.bg.height,this.bg.x,this.bg.y,true,tetrisYellow);



}

function DottedSquareNumeralBox(entries,sizeX,sizeY,posX,posY,borderThickness,startingNum) {
    this.container = new PIXI.Container();
    this.bg = new PIXI.Sprite(pixelText);
    this.container.width = this.bg.width = sizeX;
    this.container.height = this.bg.height = sizeY;
    this.container.x = this.bg.x = posX;
    this.container.y = this.bg.y = posY;

    this.bg.tint = 0x000000;
    this.container.addChild(this.bg)

    var highlightBox = this.highlighter = new PIXI.Sprite(pixelText);
    this.highlighter.tint = levelSelectHighlightColor;
    this.highlighter.width = this.highlighter.height = blockSize*menuUnitFactor;
    this.highlighter.x = this.bg.x+borderThickness;
    this.highlighter.y = this.bg.y+borderThickness;




    var numeralPositions = [];

    var rows = Math.ceil(entries/((sizeX-(borderThickness*2))/this.highlighter.width));
    
    var columns = Math.ceil(entries/((sizeY-(borderThickness*2))/this.highlighter.width));
    this.border = Border(borders["dotted"],borderThickness,this,sizeX,sizeY,posX,posY,true,tetrisGreen);
    var segmentsNeededX = Math.floor(sizeX/borderThickness);
    var segmentsNeededY = Math.floor(sizeY/borderThickness);
    for (var r=0; r<rows;r++) {
        currentY = (this.container.y+borderThickness)+(r*(this.highlighter.width+borderThickness)+this.highlighter.width/4);

        for (var c=0; c<columns;c++) {

            var digitsLong = (c+(r*columns)).toString().length;
            currentX = (this.bg.x+borderThickness)+(c*(this.highlighter.width+borderThickness)*digitsLong)+this.highlighter.width/4;
            if (digitsLong === 2) {
                currentX = (this.bg.x+borderThickness)+(c*(this.highlighter.width+borderThickness))+this.highlighter.width/4;
            }
            var numeral = new TextNumeral(this.highlighter.width/2,currentX,currentY,startingNum+(c+(r*columns)),digitsLong,tetrisRed,true)
            numeralPositions.push({x:currentX,y:currentY})
            if (c+(r*columns)<(entries/rows)-1) {
                var verticalDivider = new DottedPlank(borderThickness,segmentsNeededY,"vertical",this.highlighter.x+((c+1)*(this.highlighter.width+borderThickness)),this.container.y,tetrisGreen);
            }

            if (digitsLong === 2) {
                numeral.container.scale.x *= 0.8
                numeral.container.x -= numeral.container.width*0.15
                numeral.container.x+=(numeral.container.width*0.3*c)

            }

            this.container.addChild(numeral.container);
            this.container.addChild(verticalDivider.container);
            if (r>0) {
                var horizontalDivider = new DottedPlank(borderThickness,segmentsNeededX,"horizontal",posX,this.container.y+(numeral.container.height+borderThickness/2)*r,tetrisGreen);
                
                this.container.addChild(horizontalDivider.container)
            }

        }
    }
    this.highlighter.x = numeralPositions[chosenStartLevel].x-(this.highlighter.width/4);
    this.highlighter.y = numeralPositions[chosenStartLevel].y-(this.highlighter.width/4);
    this.container.interactive = true;
    this.container.pointerdown = function(event){
        this.data = event.data;
        var cursorX = this.data.getLocalPosition(this).x;
        var cursorY = this.data.getLocalPosition(this).y;
        var rowSelected = Math.floor(cursorY/(this.height/rows));
        var columnSelected = Math.floor(cursorX/(this.width/columns));
        currentLevel = (rowSelected*columns)+columnSelected;
        chosenStartLevel = currentLevel;
        levelSelectScreen.levelBox.highlighter.x = numeralPositions[currentLevel].x-(levelSelectScreen.levelBox.highlighter.width/4);
        levelSelectScreen.levelBox.highlighter.y = numeralPositions[currentLevel].y-(levelSelectScreen.levelBox.highlighter.width/4);
        
        
        changeBlockColorsToLevel(colorForLevel(currentLevel));
        if (SFXOn) {
            selectSound.play();
        }

    }
   
    this.container.addChild(this.highlighter)


}

function DottedPlank(size,segmentsLong,orientation,posX,posY,color) {
    this.container = new PIXI.Container();
    this.container.x = posX;
    this.container.y = posY;
    for (var i=0;i<segmentsLong;i++) {
        var currentSegment = new PIXI.Sprite(borderPlankTextDotted);
        currentSegment.tint = color;
        currentSegment.height = currentSegment.width = size;
        if (orientation === "vertical") {
            currentSegment.rotation += Math.PI/2;
//            currentSegment.x = posX+size;
            currentSegment.y = posY+(i*size);
        } else {
            currentSegment.x = posX+(i*size);
            currentSegment.y = posY;
        }
        this.container.addChild(currentSegment);
    }
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
function createSprites() {
    id = PIXI.loader.resources["assets/spritesheet.json"].textures
    pixelText = id["pixel.bmp"];
    tileText = id["tile.png"];
    bgText = id["spacebg.jpg"];
    blockBGText = id["blockbg.png"];
    gbEllText = id["gbell.png"];
    gbEssText = id["gbess.png"];
    gbJayText = id["gbjay.png"];
    gbTeeText = id["gbtee.png"];
    gbZeeText = id["gbzee.png"];
    gbWhiteText = id["gbwhite.png"];
    blockCenterText = id["whitecenter.png"];
    blockHighlightText = id["whitehighlight.png"];
    borderCornerText1 = id["bcorner.png"];
    borderPlankText1 = id["bplank.png"];
    borderCornerText2 = id["smallbcorner.bmp"];
    borderPlankText2 = id["smallbplank.bmp"];
    borderCornerTextRed = id["redcorner.bmp"];
    borderPlankTextRed = id["redplank.bmp"];
    borderCornerTextThickRed = id["thickredcorner.bmp"];
    borderPlankTextThickRed = id["thickredplank.bmp"];
    borderCornerTextBlue = id["bluecorner.bmp"];
    borderPlankTextBlue = id["blueplank.bmp"];
    borderCornerTextYellow = id["yellowcorner.bmp"];
    borderPlankTextYellow = id["yellowplank.bmp"];
    borderCornerTextDotted = id["dottedcorner.bmp"];
    borderPlankTextDotted = id["dottedsegment.bmp"];
    borderCornerTextGreen = id["greencorner.bmp"];
    borderPlankTextGreen = id["greenplank.bmp"];

    selectArrowText = id["selectarrow.bmp"];
    backArrowText = id["backarrow.png"];
    nextText = id["next.bmp"];
    levelText = id["level.bmp"];
    linesText = id["lines.bmp"];
    topText = id["top.bmp"];
    scoreText = id["score.bmp"];
    gameTypeText = id["gametype.png"];
    musicTypeText = id["musictype.png"];
    onText = id["on.png"];
    offText = id["off.png"];
    musicText = id["music.png"];
    endlessText = id["endless.png"];
    timedText = id["timed.bmp"];
    survivalText = id["survival.png"];
    timeText = id["time.bmp"];
    startText = id["start.png"];
    okText = id["ok.bmp"];

    tetrisLogoText = id["tetrologo.png"];
    castleText = id["castle.png"];
    castleFlameText = id["castleflamesquare.png"];
    playButtonText = id["playbutton.png"];
    optionsButtonText = id["optionsbutton.png"];
    spaceBGText = id["spacebg.jpg"];
    bg22x2TopText = id["bg22x2-topandbottom.png"];
    bg22x2SideText = id["bg22x2-side.png"];

    numerals = [
        id["zero.png"],
        id["one.png"],
        id["two.png"],
        id["three.png"],
        id["four.png"],
        id["five.png"],
        id["six.png"],
        id["seven.png"],
        id["eight.png"],
        id["nine.png"]
    ]
    borders = {
        fancy:{corner:borderCornerText1,plank:borderPlankText1},
        small:{corner:borderCornerText2,plank:borderPlankText2},
        red:{corner:borderCornerTextRed,plank:borderPlankTextRed},
        thickRed:{corner:borderCornerTextThickRed,plank:borderPlankTextThickRed},
        blue:{corner:borderCornerTextBlue,plank:borderPlankTextBlue},
        yellow:{corner:borderCornerTextYellow,plank:borderPlankTextYellow},
        dotted:{corner:borderCornerTextDotted,plank:borderPlankTextDotted},
        green:{corner:borderCornerTextGreen,plank:borderPlankTextGreen}
    }
}
//confirmSound = selectSound = thudSound = moveSound = turnSound = musicSelections = undefined;
//music1 = music1Fast = music2 = music2Fast = music3 = music3Fast = music4 = music4Fast = music5 = music5Fast = music6 = music6Fast = bgMusic = undefined;

function loadSounds() {
    confirmSound = new Howl({
        src: ['assets/sounds/confirm.ogg'],
        volume: 0.8
    });

    selectSound = new Howl({
        src: ['assets/sounds/select.ogg'],
        volume: 0.8
    });
    thudSound = new Howl({
        src: ['assets/sounds/thud.ogg'],
        volume: 0.8
    });
    moveSound = new Howl({
        src: ['assets/sounds/move.ogg'],
        volume: 0.6
    });
    turnSound = new Howl({
        src: ['assets/sounds/turn.ogg'],
        volume: 0.8
    });

    music1 = new Howl({
        src: ['assets/sounds/nesmusic1.mp3','assets/sounds/nesmusic1.ogg'],
//    buffer: true,
        loop:true,
        loaded: false,
        onplay: function() {
        },
        onload: function() {
            musicSelectionField.labels[0].alpha = 1;
            this.loaded = true;
        },
        onloaderror: function() {
            musicSelectionField.labels[0].alpha = 0.1;
        }

    });

    music2 = new Howl({
        src: ['assets/sounds/nesmusic2.mp3','assets/sounds/nesmusic2.ogg'],
        volume: 0.6,
//    buffer: true,
        loop:true,
        loaded: false,
        onplay: function() {
        },
        onload: function() {
            musicSelectionField.labels[1].alpha = 1;
            this.loaded = true;
        },
        onloaderror: function() {
            musicSelectionField.labels[1].alpha = 0.1;
        }


    });

    music3 = new Howl({
        src: ['assets/sounds/nesmusic3.mp3','assets/sounds/nesmusic3.ogg'],
        volume: 0.5,
//    buffer: true,
        loop: true,
        loaded: false,
        onplay: function() {
        },
        onload: function() {
            musicSelectionField.labels[2].alpha = 1;
            this.loaded = true;
        },
        onloaderror: function() {
            musicSelectionField.labels[2].alpha = 0.1;
        }

    });
//    music1Fast = music2Fast = music3Fast = music4Fast = music5Fast = music6Fast = undefined;
    // music1Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    // music2Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    // music3Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    // music4Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    // music5Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    // music6Fast = new Howl({
    //     src: ['assets/sounds/g.ogg'],
    //     volume: 0.8
    // });
    deathSound = new Howl({
        src: ['assets/sounds/death.ogg'],
        volume: 0.8
    });
    levelUpSound = new Howl({
        src: ['assets/sounds/levelup.ogg'],
        volume: 0.8
    });

    lineSound = new Howl({
        src: ['assets/sounds/line.ogg'],
        volume: 0.8
    });
    fourLineSound = new Howl({
        src: ['assets/sounds/fourline.ogg'],
        volume: 0.8
    });


    musicSelections = [
        {normal:music1,fast:music1},
        {normal:music2,fast:music2},
        {normal:music3,fast:music3},
    ]


}

function loadSpriteSheet() {
	PIXI.loader
	.add("assets/spritesheet.json")

	PIXI.loader.load((loader, resources) => {
		createSprites()
		init(true)
		
	});
}


function changeMusic(newSelection) {
    if (BGMusic !== undefined) {
        BGMusic.normal.stop();
        BGMusic = undefined;
    };

    BGMusic = musicSelections[newSelection]

    BGMusic.normal.play();
}
