define(function(require) {
    const PIXI = require("com/pixijs/pixi");
    const utils = require("skbJet/componentManchester/standardIW/layout/utils");
    const app = require("skbJet/componentManchester/standardIW/app");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const displayList = require("skbJet/componentManchester/standardIW/displayList");
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const audio = require("skbJet/componentManchester/standardIW/audio");
    const audioPlayer = require("skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer");
    const symbolList = require("game/components/symbolList");
    const resLib = require("skbJet/component/resourceLoader/resourceLib");
    const autoPlay = require("skbJet/componentManchester/standardIW/autoPlay");
    const revealAll = require("game/revealAll");
    const numbers = require("game/state/numbers");
    const FittedText = require("skbJet/componentManchester/standardIW/components/fittedText");
    const textStyles = require("skbJet/componentManchester/standardIW/textStyles");
    const animationController = require("game/components/animation/animationController");
    const animationView = require("game/components/animation/animationView");
    const fontColors = require("skbJet/componentManchester/standardIW/fontColors");

    require("com/gsap/TweenMax");
    require("com/gsap/TimelineMax");
    require("com/gsap/easing/CustomEase");

    const Tween = window.TweenMax;
    const Timeline = window.TimelineMax;

    let bonusGamesLeft = 0;
    let resolveResult = null;
    let resultClosing = false;
    let largeResultClosing = false;

    let transitionSprites = [];
    let bonusGamesLeftSwirlSprites = [];
    let _spam = false;
    let attractBuy;
    let attractTry;
    let attractMtM;
    let firstSwirl = false;

    function init() {

        displayList.logoAnim.visible = config.animateLogo;
        displayList.logoFixed.visible = !config.animateLogo;
        bonusGamesLeft = 0;

        displayList.animationLayer.alpha = 0;
        displayList.resultPlaque.alpha = 0;
        displayList.largeResultPlaque.alpha = 0;
        displayList.bonusGamesLeft.alpha = 0;
        displayList.bonusText.alpha = 0;

        for (let i = 0; i < config.transitionParticles; i++) {
            transitionSprites.push(new PIXI.extras.AnimatedSprite(utils.findFrameSequence("spirals00").map(PIXI.Texture.from)));
        }
        transitionSprites.forEach(ts => {
            ts.anchor.set(0.5);
            ts.loop = false;
        });

        let bonusLast = new FittedText(resLib.i18n.game.Game.bonusTextLast);
        bonusLast.style = textStyles.parse("bonusGamesLeft");
        //textStyles.parse doesn't pick up stroke colours or maxWidth
        if (bonusLast.style.stroke && PIXI.utils.TextureCache[bonusLast.style.stroke] !== undefined) {
            bonusLast.style.stroke = fontColors(bonusLast.style.stroke);
        }


        if (resLib.i18n.game.Game.bonusTextLast != "") {

            bonusGamesLeftSwirlSprites["1"] = bonusLast;
            bonusGamesLeftSwirlSprites["1"].anchor.set(1, 0.5);
            bonusGamesLeftSwirlSprites["1"].position.set(120, -30);

        } else {


            bonusGamesLeftSwirlSprites["1"] = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("swirl1_").map(PIXI.Texture.from));
            bonusGamesLeftSwirlSprites["1"].anchor.set(0.5);
        }


        bonusGamesLeftSwirlSprites["2"] = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("swirl2_").map(PIXI.Texture.from));
        bonusGamesLeftSwirlSprites["2"].anchor.set(0.5);
        bonusGamesLeftSwirlSprites["3"] = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("swirl3_").map(PIXI.Texture.from));
        bonusGamesLeftSwirlSprites["3"].anchor.set(0.5);
        numbers.nextState = "BASEGAME";

        attractBuy = animationController.getAnimation("buttonAttract_buy").spineObject;
        attractTry = animationController.getAnimation("buttonAttract_try").spineObject;
        attractMtM = animationController.getAnimation("buttonAttract_moveToMoney").spineObject;
        msgBus.subscribe("UI.hideHelp", startAttractMode);
        msgBus.subscribe("UI.showHelp", endAttractMode);
        msgBus.subscribe("animation.end", data => {
            if (data.index === "buttonAttract_buy" || data.index === "buttonAttract_try") {
                attractBuy.alpha = 0;
                attractTry.alpha = 0;
                attractMtM.alpha = 0;
            }
        });
        msgBus.subscribe("UI.updateButtons", data => {
            if (data.home && data.home.enabled && numbers.state !== "PURCHASE" && numbers.state !== "ENDOFGAME") {
                msgBus.publish("UI.updateButtons", {
                    home: { enabled: false, visible: true }
                });
            }
        });
        msgBus.subscribe("Game.animationController.Update", (name) => {
            switch (name) {
                case "buttonAttract_buy":
                    attractBuy = animationController.getAnimation("buttonAttract_buy").spineObject;
                    break;
                case "buttonAttract_try":
                    attractTry = animationController.getAnimation("buttonAttract_try").spineObject;
                    break;
                case "buttonAttract_moveToMoney":
                    attractMtM = animationController.getAnimation("buttonAttract_moveToMoney").spineObject;
            }
        });
        //HACK: re-init animation view after one second (WILD8S-231)
        setTimeout(() => {
            animationView.init();
        }, 1000);
        startAttractMode();
    }

    async function startAttractMode() {
        new Promise((resolve, reject) => {
            let ts = Date.now();
            let poll = () => {
                if (Date.now() - ts > config.pollTimeout * 1000) {
                    reject();
                } else if (displayList.buyButton.visible && displayList.buyButton.enabled) {
                    resolve();
                } else if (displayList.tryButton.visible && displayList.tryButton.enabled) {
                    resolve();
                } else {
                    setTimeout(poll, config.pollInterval * 1000);
                }
            };
            poll();
        }).then(
            () => {
                if (displayList.buyButton.visible && displayList.buyButton.enabled) {
                    attractBuy.visible = true;
                    attractBuy.alpha = 1;
                    attractBuy.scale.set(0.86);
                    msgBus.publish("animation.play", {
                        index: "buttonAttract_buy",
                        anim: "animation",
                        loop: false
                    });
                } else if (displayList.tryButton.visible && displayList.tryButton.enabled) {
                    attractTry.visible = true;
                    attractTry.alpha = 1;
                    attractTry.scale.set(0.86);
                    msgBus.publish("animation.play", {
                        index: "buttonAttract_try",
                        anim: "animation",
                        loop: false
                    });
                    if (displayList.moveToMoneyButton.visible && displayList.moveToMoneyButton.enabled) {
                        attractMtM.visible = true;
                        attractMtM.alpha = 1;
                        attractMtM.scale.set(0.86);
                        msgBus.publish("animation.play", {
                            index: "buttonAttract_moveToMoney",
                            anim: "animation",
                            loop: false
                        });
                    }
                }
                setTimeout(startAttractMode, config.attractInterval * 1000);
            },
            () => {
                //no-op
            }
        );
    }

    function endAttractMode() {
        attractBuy.visible = false;
        msgBus.publish("animation.clear", {
            index: "buttonAttract_buy",
            anim: "animation"
        });
        attractTry.visible = false;
        msgBus.publish("animation.clear", {
            index: "buttonAttract_try",
            anim: "animation"
        });
        attractMtM.visible = false;
        msgBus.publish("animation.clear", {
            index: "buttonAttract_moveToMoney",
            anim: "animation"
        });
    }

    function startSpammingSprites(showButtons) {
        _spam = true;
        displayList.animationLayer.alpha = 1;

        if (!firstSwirl) {
            firstSwirl = true;

            //if(bonusGamesLeft === 1 ){
            displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextLastWord : resLib.i18n.game.Game.bonusTextSingle;

            //}

            //displayList.bonusText.text = resLib.i18n.game.Game.bonusTextSingle;
        } else {
            displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextPlural : resLib.i18n.game.Game.bonusTextSingle;

        }


        if (!showButtons) {
            Tween.to(displayList.ticketSelectBarSmall, 0.5, {
                alpha: 0
            });
            Tween.to(displayList.buttonBar, 0.5, {
                alpha: 0
            });
        }

        transitionSprites.forEach(function spamSprite(spr) {


            scatterAndPlay(spr, Math.random() * 1000);
        });
        if (config.animateLogo && !numbers.logoAnimPlaying) {
            msgBus.publish("animation.play", {
                index: "animLogo",
                anim: "animation",
                loop: false
            });
        }

    }

    async function stopSpammingSprites() {
        _spam = false;
        Tween.to(displayList.ticketSelectBarSmall, 0.5, {
            alpha: numbers.state === "BONUSGAME" ? 0.5 : 1
        });
        Tween.to(displayList.buttonBar, 0.5, {
            alpha: 1
        });



        return new Promise(resolve => {
            let poll = () => {
                if (transitionSprites.filter(ts => ts.parent !== null).length === 0) {
                    setTimeout(resolve, config.transition_spamDelay * 1000);
                } else {
                    setTimeout(poll, config.pollInterval * 1000);
                }
            };
            poll();
        });
    }

    //randomly position, scale and play an animated sprite after a delay
    function scatterAndPlay(spr, delay) {


        if (_spam) {
            let hw = displayList.animationLayer.x;
            let hh = displayList.animationLayer.y;
            setTimeout(() => {
                spr.scale.set(2 - Math.random());
                spr.x = (1 - (2 * Math.random())) * hw;
                spr.y = (1 - (2 * Math.random())) * hh;
                displayList.animationLayer.addChild(spr);
                spr.loop = false;
                spr.gotoAndPlay(0);
                spr.onComplete = () => {
                    displayList.animationLayer.removeChild(spr);
                    scatterAndPlay(spr, 0);
                };
            }, delay);
        }
    }

    async function startBaseGame() {
        endAttractMode();
        numbers.state = "BASEGAME";

        bonusGamesLeft = 0;

        msgBus.publish("UI.updateButtons", {
            autoPlay: {
                enabled: false,
                visible: true
            },
            help: {
                enabled: false,
                visible: true
            }
        });
        displayList.gameGrid.interactiveChildren = false;
    }

    async function startBonusGame(scenario) {
        audio.play("transition", false);
        audio.play("musicNight", true);

        // This seems to fix the audio stopping at end of first loop
        audioPlayer.pauseChannel(0);
        audioPlayer.resumeChannel(0);
        ///



        bonusGamesLeft = scenario.bonusGames.length;
        if (bonusGamesLeft === 1) {
            numbers.nextState = "BASEGAME";
        } else {
            numbers.nextState = "BONUSGAME";
        }

        displayList.bonusGamesLeft.addChild(bonusGamesLeftSwirlSprites[bonusGamesLeft]);
        bonusGamesLeftSwirlSprites[bonusGamesLeft].gotoAndStop(0);
        bonusGamesLeftSwirlSprites[bonusGamesLeft].alpha = 0;
        startSpammingSprites();
        await transition();
        numbers.state = "BONUSGAME";

    }

    async function reset() {
        return new Promise(async resolve => {
            // Make sure we hide the result
            msgBus.publish('UI.hideResult');

            await symbolList.reset();
            numbers.state = "PURCHASE";
            if (config.animateLogo) {
                msgBus.publish("animation.clear", {
                    index: "animLogo",
                    anim: "animation"
                });
            }
            startAttractMode();
            resolve();
        });
    }

    async function baseGame(turn) {
        displayList.gameGrid.interactiveChildren = false;
        await symbolList.populate(turn);

        var proms = [...symbolList.enable()];
        msgBus.publish("UI.updateButtons", {
            autoPlay: {
                enabled: true,
                visible: true
            },
            help: {
                enabled: true,
                visible: true
            },
            home: {
                enabled: false,
                visible: true
            }
        });
        displayList.gameGrid.interactiveChildren = true;
        await Promise.all(proms);
        msgBus.publish("UI.updateButtons", {
            autoPlay: {
                enabled: false,
                visible: false
            },
            help: {
                enabled: false,
                visible: true
            },
            home: {
                enabled: false,
                visible: true
            }
        });
    }

    async function bonusGame(turn) {


        displayList.gameGrid.interactiveChildren = false;
        swirlBonusGamesLeft(bonusGamesLeft);
        await symbolList.reset();
        await stopSpammingSprites();
        await symbolList.populate(turn);
        displayList.gameGrid.interactiveChildren = !autoPlay._enabled;

        if (resLib.i18n.game.Game.bonusTextLast != "") {

            displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextSingle : resLib.i18n.game.Game.bonusTextPlural;
        } else {

            //displayList.bonusText.text = resLib.i18n.game.Game.bonusTextPlural;

            displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextLastWord : resLib.i18n.game.Game.bonusTextPlural;


        }


        //force autoplay of bonus game
        if (!autoPlay._enabled) {
            msgBus.publish("Game.AutoPlayStart");
        }
        msgBus.publish("UI.updateButtons", {
            autoPlay: false,
            help: {
                enabled: false,
                visible: true
            },
            home: {
                enabled: false,
                visible: true
            }
        });
        new Timeline()
            .call(revealAll.start, null, null, config.autoPlayInterval);
        await Promise.all([...symbolList.enable()]);
        bonusGamesLeft--;


    }

    async function swirlBonusGamesLeft(target) {

        //ONLY FOR PL
        //if (resLib.i18n.game.Game.bonusTextLast == "") {
        //  displayList.bonusText.text = resLib.i18n.game.Game.bonusTextPlural;
        //}

        //if (resLib.i18n.game.Game.bonusTextLast == "") {

        //  displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextLastWord : resLib.i18n.game.Game.bonusTextPlural;
        //}

        let s = displayList.bonusGamesLeft.children[0];
        let e = bonusGamesLeftSwirlSprites[String(target)];
        if (s === e) {
            //start of the bonus game
            //wait for the swirl spam to stop, then swirl in
            s.alpha = 0;
            await stopSpammingSprites();
            audio.play("bonusTurnIncrease");
            await new Promise(resolve => {
                s.onComplete = () => {
                    s.gotoAndStop(0);
                    resolve();
                };
                s.loop = false;
                s.animationSpeed = -Math.abs(s.animationSpeed);
                s.gotoAndPlay(s.totalFrames - 1);
                Tween.to(s, s.totalFrames, {
                    alpha: 1,
                    useFrames: true
                });
            });
            return;
        }
        await new Promise(resolve => {

            audio.play("bonusTurnIncrease");


            if (resLib.i18n.game.Game.bonusTextLast != "") {

                if (target === 1) {
                    displayList.bonusText.text = resLib.i18n.game.Game.bonusTextSingle;
                } else {
                    displayList.bonusText.text = resLib.i18n.game.Game.bonusTextPlural;
                }

            } else {


                displayList.bonusText.text = (bonusGamesLeft === 1) ? resLib.i18n.game.Game.bonusTextLastWord : resLib.i18n.game.Game.bonusTextPlural;

            }


            if (s.gotoAndPlay !== undefined) {
                s.onComplete = () => {
                    displayList.bonusGamesLeft.removeChild(s);
                };
                s.loop = false;
                s.animationSpeed = Math.abs(s.animationSpeed);
                s.gotoAndPlay(0);
                Tween.to(s, s.totalFrames, {
                    alpha: 0,
                    useFrames: true
                });
            }

            displayList.bonusGamesLeft.addChild(e);
            e.alpha = 0;
            if (e.gotoAndPlay === undefined) {
                new Timeline({
                        onComplete: () => {
                            if (e.updateText !== undefined) {
                                e.maxWidth = 500; // force maxWidth on animation end
                                e.updateText();
                            }
                            resolve();
                        }
                    })
                    .fromTo(e, config.bonusGameLastPulseTime * 0.8, {
                        alpha: 0
                    }, {
                        alpha: 1
                    }, 0)
                    .fromTo(e.scale, config.bonusGameLastPulseTime * 0.8, {
                        x: 0,
                        y: 0
                    }, {
                        x: 1.2,
                        y: 1.2
                    }, 0)
                    .to(e.scale, config.bonusGameLastPulseTime * 0.2, {
                        x: 1,
                        y: 1
                    }, config.bonusGameLastPulseTime * 0.8);
            } else {
                e.onComplete = () => {
                    e.gotoAndStop(0);
                    resolve();
                };
                e.animationSpeed = -Math.abs(e.animationSpeed);
                e.loop = false;
                e.gotoAndPlay(e.totalFrames - 1);
                Tween.to(e, e.totalFrames, {
                    alpha: 1,
                    useFrames: true
                });
            }
        });
    }

    async function endGame() {
        await new Promise(resolve => {
            msgBus.publish("UI.updateButtons", {
                autoPlay: {
                    enabled: false,
                    visible: true
                },
            });
            displayList.gameGrid.interactiveChildren = false;
            numbers.state = "ENDOFGAME";
            new Timeline({
                    onComplete: () => {
                        displayList.bonusGamesLeft.removeChildren();
                    }
                })
                .to(displayList.bonusText, config.bonusGameFadeOutTime, {
                    alpha: 0
                }, 0)
                .to(displayList.bonusGamesLeft, config.bonusGameFadeOutTime, {
                    alpha: 0
                }, 0);

            resolve();
        });
    }

    async function transition() {
        await new Promise(resolve => {
            if (numbers.nextState === "BONUSGAME") { //TARGET state
                new Timeline({
                        onComplete: resolve
                    })
                    .fromTo(displayList.infoText, config.baseGameFadeOutTime, {
                        alpha: 1
                    }, {
                        alpha: 0
                    }, 0)
                    .fromTo(displayList.infoSymbol, config.baseGameFadeOutTime, {
                        alpha: 1
                    }, {
                        alpha: 0
                    }, 0)
                    .fromTo(displayList.backgroundBonusGame, config.bonusGameFadeInTime, {
                        alpha: 0
                    }, {
                        alpha: 1
                    }, config.bonusGameFadeInDelay)
                    .fromTo(displayList.bonusGamesLeft, config.bonusGameFadeInTime, {
                        alpha: 0
                    }, {
                        alpha: 1
                    }, config.bonusGameFadeInDelay)
                    .fromTo(displayList.bonusText, config.bonusGameFadeInTime, {
                        alpha: 0
                    }, {
                        alpha: 1,
                    }, config.bonusGameFadeInDelay);
            } else {
                new Timeline({
                        onComplete: resolve
                    })
                    .to(displayList.bonusGamesLeft, config.bonusGameFadeOutTime, {
                        alpha: 0
                    }, 0)
                    .to(displayList.bonusText, config.bonusGameFadeOutTime, {
                        alpha: 0
                    }, 0)
                    .to(displayList.backgroundBonusGame, config.bonusGameFadeOutTime, {
                        alpha: 0
                    }, 0)
                    .to(displayList.infoText, config.baseGameFadeInTime, {
                        alpha: 1
                    }, config.baseGameFadeInDelay)
                    .to(displayList.infoSymbol, config.baseGameFadeInTime, {
                        alpha: 1
                    }, config.baseGameFadeInDelay);
            }
        });
    }

    async function showResult(winAmount) {
        resultClosing = false;

        let win = winAmount > 0;
        if (!win && numbers.state !== "ENDOFGAME") {
            return new Promise(resolve => {
                new Timeline().call(resolve, null, null, config.autoPlayGameInterval);
            });
        }
        return new Promise(resolve => {
            resolveResult = resolve;

            if (win && numbers.state === "ENDOFGAME") {
                startSpammingSprites();
                stopSpammingSprites();
            }
            displayList.resultWinLabel.visible = win && (numbers.state !== "ENDOFGAME");
            displayList.resultTotalWinLabel.visible = win && (numbers.state === "ENDOFGAME");

            displayList.resultWinText.visible = win;
            displayList.resultLoseText.visible = !win;

            displayList.resultWinLabel.text = resLib.i18n.game.Game.message_win[SKBeInstant.config.wagerType];
            displayList.resultTotalWinLabel.text = resLib.i18n.game.Game.message_totalWin[SKBeInstant.config.wagerType] + (config.mockData ? "(MOCK)" : "");

            displayList.resultWinText.text = win ? SKBeInstant.formatCurrency(winAmount).formattedAmount : "XXXX";

            resultClosing = false;

            new Timeline()
                .fromTo(displayList.resultPlaque, config.resultPlaqueFadeInTime, {
                    alpha: 0
                }, {
                    alpha: 1
                }, config.resultPlaqueDelay)
                .call(() => {
                    app.stage.on("pointerdown", closeResult);
                    app.stage.interactive = true;
                })
                .call(closeResult, null, null, config.resultPlaqueDuration);
        });
    }

    async function showLargeResult(winAmount) {
        largeResultClosing = false;
        let win = winAmount > 0;

        if (displayList.resultPlaque.alpha > 0) {
            await closeResult();
        }

        return new Promise(resolve => {
            resolveResult = resolve;

            if (win) {
                displayList.largeResultWinTitle.text = resLib.i18n.game.Game.message_largeTitle[SKBeInstant.config.wagerType];
                displayList.largeResultWinTitle.visible = true;

                displayList.largeResultWinLabel.text = resLib.i18n.game.Game.message_largeLabel[SKBeInstant.config.wagerType];
                displayList.largeResultNonWinLabel.text = "";

                displayList.largeResultWinText.text = SKBeInstant.formatCurrency(winAmount).formattedAmount;
                displayList.largeResultWinText.visible = true;

            } else {

                displayList.largeResultWinTitle.visible = false;

                displayList.largeResultWinLabel.text = "";
                displayList.largeResultNonWinLabel.text = resLib.i18n.game.Game.message_nonWin;

                displayList.largeResultWinText.visible = false;
            }

            largeResultClosing = false;
            new Timeline()
                .fromTo(displayList.largeResultPlaque, config.largeResultPlaqueFadeInTime, {
                    alpha: 0
                }, {
                    alpha: 1
                }, config.largeResultPlaqueDelay)
                .call(() => {
                    if (win) {
                        startSpammingSprites(true);
                    }
                    app.stage.on("pointerdown", closeLargeResult);
                    app.stage.interactive = true;
                });
        });
    }

    function closeLargeResult() {
        if (displayList.largeResultPlaque.alpha === 0) {
            return;
        }
        if (!largeResultClosing) {
            largeResultClosing = true;
            app.stage.off("pointerdown", closeLargeResult);
            new Timeline({
                    onComplete: () => {
                        resolveResult();
                        stopSpammingSprites();
                    }
                })
                .fromTo(displayList.largeResultPlaque, config.largeResultPlaqueFadeOutTime, {
                    alpha: 1
                }, {
                    alpha: 0
                });
        }
    }

    function closeResult() {
        if (!resultClosing) {
            resultClosing = true;
            app.stage.off("pointerdown", closeResult);
            new Timeline({
                    onComplete: resolveResult
                })
                .fromTo(displayList.resultPlaque, config.resultPlaqueFadeOutTime, {
                    alpha: 1
                }, {
                    alpha: 0
                });
        }
    }

    return {
        init,
        reset,
        startBaseGame,
        startBonusGame,
        baseGame,
        bonusGame,
        endGame,
        showResult,
        showLargeResult,
        closeLargeResult,
        transition,
        startSpammingSprites,
        stopSpammingSprites,
        startAttractMode,
        endAttractMode,
        swirlBonusGamesLeft,
        get bonusGamesLeft() {
            return bonusGamesLeft;
        }
    };
});