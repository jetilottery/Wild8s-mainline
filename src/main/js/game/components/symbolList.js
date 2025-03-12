define(require => {
    const app = require("skbJet/componentManchester/standardIW/app");
    const displayList = require("skbJet/componentManchester/standardIW/displayList");
    const Symbol = require("game/components/Symbol");
    const PrizeBox = require("game/components/PrizeBox");
    const BonusBox = require("game/components/BonusBox");
    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const resLib = require("skbJet/component/resourceLoader/resourceLib");
    const meterData = require("skbJet/componentManchester/standardIW/meterData");
    const scenarioData = require("skbJet/componentManchester/standardIW/scenarioData");
    const SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");
    const audio = require("skbJet/componentManchester/standardIW/audio");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const gameState = require("game/state/numbers");
    

    require("com/gsap/TweenMax");
    const Tween = window.TweenMax;

    let symbolRelation = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    const startData = [
        "928433165",
    ];

    let prizeBox;
    let multiplierBox;
    let autoRevealCounter = undefined;
    let symbols = [];
    let tiles = [];
    let values = [];
    let prize = 0;
    let multiplier = 0;
    let idleTween;
    let numbers;
    let winRecorded = false;

    function init(num) {
        numbers = num;

        idleTween = Tween.to({}, randomIdleDuration(), {
            onComplete: promptIdle,
            paused: true,
        });

        let i;
        for(i = 0; i < 9; i++) {
            symbols[i] = Symbol.fromContainer(displayList["symbol" + i], displayList.particlesLayer, i);
        }
        prizeBox = PrizeBox.fromContainer(displayList.prizeBox, resLib.i18n.game.Game.prizeBox, i);
        i++;
        multiplierBox = BonusBox.fromContainer(displayList.bonusBox, resLib.i18n.game.Game.multiplierBox, i);

        tiles = [prizeBox, multiplierBox].concat(symbols);

        let index = parseInt(((Math.random() * startData.length) + 1) - 1);

        startData[index].toString().split("").forEach((e, i) => {
            symbols[i].populate(e);
        });
        app.stage.on("pointerdown", resetIdle);
    }

    function resetIdle() {
        if(numbers.state !== "PURCHASE") {
            idleTween.play(0);
            tiles.forEach(tile => { tile.cancelPrompt(); });    
        }
    }

    function randomIdleDuration() {
        return (
          config.idleInterval -
          config.idleIntervalVariation +
          Math.random() * config.idleIntervalVariation * 2
        );
    }

    function promptIdle() {
        if(gameState.state === "PURCHASE") {
            idleTween.pause(0);
            tiles.forEach(tile => { tile.cancelPrompt(); });
            return;
        }

        // Check if there are any remaining unrevealed symbols
        const unrevealed = tiles.filter(tile => !tile.revealed);
        if (unrevealed.length === 0) {
          return;
        }

        // Animate all unrevealed symbols
        unrevealed.forEach(tile => tile.prompt());

        // Pick one at random to animate
        //unrevealed[Math.floor(unrevealed.length * Math.random())].prompt();
    }
    msgBus.subscribe("animation.end", data => {
        if(data.index.includes("dancingSymbol")) {
            // Restart the idle timer tween
            idleTween.duration(randomIdleDuration());
            idleTween.play(0);
        }
    });

    async function populate(data) {
        prize = scenarioData.scenario.prizeTable[data.prize];
        multiplier = parseInt(data.multiplier);
        values = data.values;

        prizeBox.populate(SKBeInstant.formatCurrency(prize).formattedAmount);
        multiplierBox.populate("X" + multiplier);
        values.forEach((e, i) => {
            symbols[i].populate(e);
        });
    }

    function enable() {
        idleTween.play(0);        // Restart the idle timer tween
        app.stage.interactive = true;
        return tiles.map(async (tile) => {
            await tile.enable();
            await tile.uncover();
            msgBus.publish("game.tileRevealed", tile); //used by autoplay
            await checkMatch(tile);
            if(tile.symbolLetter === "W") {
                audio.play("bonusDrop");
                tile.presentWin();
            }
            checkAutoRevealPrizeBoxes();
            if(!tilesRevealing() && numbers.state !== "BONUSGAME") {
                //re-enable info button after tile reveal (provided no other tiles are revealing)
                // msgBus.publish("UI.updateButtons", {
                //     help: { enabled: true, visible: true }
                // });
            }
        });
    }

    function tilesRevealing() {
        for(let i = 0; i < tiles.length; i++) {
            if(tiles[i].revealing) {
                return true;
            }
        }
        return false;
    }

    function checkAutoRevealPrizeBoxes() {
        if(!config.autoRevealPrizeBoxes) { return; }

        // Get all the symbol letters yet to be revealed
        const unrevealedSymbolLetters = tiles.filter(tile => !tile.revealed).map(tile => tile.symbolLetter);

        // reset autoRevealCounter if it exists
        autoRevealCounter && autoRevealCounter.kill();
        if(unrevealedSymbolLetters.length && unrevealedSymbolLetters.filter(symbol => symbol === "B").length === unrevealedSymbolLetters.length) {
            //start auto reveal timer if only prize boxes remain
            autoRevealCounter = Tween.delayedCall(config.prizeBoxAutoRevealDelay, () => {
                msgBus.publish("game.prizeBoxAutoReveal");
                autoRevealCounter = undefined;
            });
        }
    }

    //WILD8S-188 - cancel autoRevealPrizeBoxes if help is opened; restart on closing help
    msgBus.subscribe("UI.showHelp", () => {
        autoRevealCounter && autoRevealCounter.kill();
    });
    msgBus.subscribe("UI.hideHelp", checkAutoRevealPrizeBoxes);

    function revealAll() {
        // Stop the idle timer tween
        idleTween.pause(0);
        app.stage.interactive = false;
        // Get all the symbols yet to be revealed
        const unrevealedBoxes = (prizeBox.revealed ? [] : [prizeBox]).concat(multiplierBox.revealed ? [] : [multiplierBox]);
        const unrevealedSymbols = symbols.filter(symbol => !symbol.revealed && !symbol.revealing);

        // Return an array of tweens that calls reveal on each symbol in turn
        return {
            boxes: unrevealedBoxes.map(box => Tween.delayedCall(0, async () => {
            box.reveal();
            }, null, box)),
            symbols: unrevealedSymbols.map(symbol => Tween.delayedCall(0, async () => {
                symbol.reveal();
            }, null, symbol))
        };
    }

    function checkSymbolRelation(r) {
        return r.reduce((prev, curr) => {
            let included = ["W", "8"].includes(symbols[curr].symbolLetter);
            let revealed = symbols[curr].revealed;
            return prev && included && revealed;
        }, true);
    }

    function checkTileRelation(r) {
        return checkSymbolRelation(r) && tiles[0].revealed && tiles[1].revealed;
    }

    function hasWild(r) {
        return symbols.filter(s => r.includes[s]).map(s => s.symbolLetter).includes("W");
    }

    async function checkMatch(newReveal) {        
        idleTween.pause(0);

        let r, proms = [];
        //Check for three 8"s or two 8"s and a wild in a row
        for(r = 0; r < symbolRelation.length; r++) {
            if(symbolRelation[r].includes(newReveal.index) && checkSymbolRelation(symbolRelation[r])) {
                symbolRelation[r].forEach(s => {
                    symbols[s].match();
                    proms.push(symbols[s].presentWin());
                });
                audio.play("lineNumbersHighlight", false);
                Tween.delayedCall(1, () => {
                    audio.play(hasWild(symbolRelation) ? "lineMatchWild" : "lineMatch");
                    if(config.animateLogo && !numbers.logoAnimPlaying) {
                        msgBus.publish("animation.play", { index: "animLogo", anim: "animation", loop: false });
                    }
                });
                break; //Individual game grids have a maximum of one winning line
            }
        }

        await Promise.all([...proms]);

        ///Check for prize and multiplier revealed before updating winMeter
        for(r = 0; r < symbolRelation.length; r++) {
            if((newReveal.symbolLetter === "B" || symbolRelation[r].includes(newReveal.index)) && checkTileRelation(symbolRelation[r])) {
                if(config.mockData) {
                    let wM = displayList.winValue.text.match(/[\d]/g);
                    let w = 0;
                    if(Array.isArray(wM)) {
                        w = parseInt(wM.join("")) * 100;
                    }
                    displayList.winValue.text = SKBeInstant.formatCurrency(w + (prize * multiplier)).formattedAmount;
                } else {
                    //wait for the plaque to fade in before showing updated winmeter
                    displayList.winMeter.cacheAsBitmap = true; //"freeze" win meter and secretly update it
                    //Guarantee only one win allowed per game board
                    if(!winRecorded) {
                        winRecorded = true;
                        meterData.win += (prize * multiplier);
                    }
                    Tween.delayedCall(config.resultPlaqueFadeInTime + config.resultPlaqueDelay, () => {
                        displayList.winMeter.cacheAsBitmap = false; // unfreeze once the result plaque has been shown
                    });
                }
            }
        }

        idleTween.play(0);
    }
    
    async function reset() {
        let proms = [prizeBox.reset(), multiplierBox.reset(), ...symbols.map(s => s.reset())];
        await Promise.all(proms);
        winRecorded = false;
        msgBus.publish("game.reset"); //used by autoplay
    }

    return {
        init,
        enable,
        populate,
        reset,
        revealAll,
        get tiles() {
            return tiles;
        },
        get symbols() {
            return symbols;
        },
        get prizeBox() {
            return prizeBox;
        },
        get multiplierBox() {
            return multiplierBox;
        }
    };
});