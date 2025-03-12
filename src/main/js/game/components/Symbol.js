define(require => {
    const PIXI = require("com/pixijs/pixi");
    const Pressable = require("skbJet/componentManchester/standardIW/components/pressable");
    const utils = require("skbJet/componentManchester/standardIW/layout/utils");
    const autoPlay = require("skbJet/componentManchester/standardIW/autoPlay");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const orientation = require("skbJet/componentManchester/standardIW/orientation");
    const animationController = require("game/components/animation/animationController");
    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const numbers = require("game/state/numbers");
    const audio = require("skbJet/componentManchester/standardIW/audio");
    
    require("com/gsap/TimelineMax");
    require("com/gsap/TweenMax");
    require("com/gsap/easing/CustomEase");
    require("com/gsap/plugins/PixiPlugin");

    const Tween = window.TweenMax;
    const Timeline = window.TimelineMax;
    
    const symbol = {
        "1": "sym1",
        "2": "sym2",
        "3": "sym3",
        "4": "sym4",
        "5": "sym5",
        "6": "sym6",
        "7": "sym7",
        "8": "sym8",
        "9": "sym9",
        "W": "symWild"
    };

    class Symbol extends Pressable {
        constructor(index) {
            super();

            this.enabled = false;
            this.index = index;
            this.symbolLetter = undefined;
            this.spineAnimPlaying = false;
            this.idleAnimPlaying = false;
            this.revealing = false;
            this.WIDTH = 200;
            this.HEIGHT = 200;

            // Create all the empty sprites
            this.valueSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this.win = PIXI.Sprite.fromFrame("sym8Selected");
            this.winFlare = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("Glow00").map(PIXI.Texture.from));
            this.winParticles = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("spirals00").map(PIXI.Texture.from));
            this.revealAnim = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("reveal" + (index % 2 ? "Purple" : "Yellow")).map(PIXI.Texture.from));
            this.bonusSunburst = PIXI.Sprite.fromFrame("sunburst");
            Tween.to(this.bonusSunburst, config.sunburstRotateTime, {rotation: Math.PI * 2, repeat: -1, ease: "Linear.easeNone"});

            this.spineAnim = animationController.getAnimation("wild8s").spineObject;

            // Center everything
            this.valueSprite.anchor.set(0.5);
            this.win.anchor.set(0.5);
            this.winFlare.anchor.set(0.5);
            this.winParticles.anchor.set(0.5);
            this.bonusSunburst.anchor.set(0.5);
            this.revealAnim.anchor.set(0.5);

            this.winningSymbol = false;

            this.win.visible = false;
            this.winFlare.visible = false;
            this.winFlare.gotoAndStop(0);
            this.winParticles.visible = false;
            this.winParticles.loop = false;
            this.winParticles.gotoAndStop(0);
            this.bonusSunburst.visible = false;
            this.revealAnim.loop = false;
            this.revealAnim.gotoAndStop(0);
            this.revealAnim.visible = true;


            this.particleContainer = new PIXI.Container();
            this.particleContainer.addChild(this.winFlare, this.winParticles);
            this.particleContainer.name = "particleContainer";

            this.resultContainer = new PIXI.Container();
            this.resultContainer.addChild(this.bonusSunburst, this.valueSprite, this.win);
            this.resultContainer.visible = false;
            this.resultContainer.name = "resultContainer";

            //Idle
            this.idleAnimName = "dancingSymbol" + String(index);
            this.idleAnim = animationController.getAnimation(this.idleAnimName).spineObject;
            this.idleAnim.position.set(15, 8); //idle anim is a bit off

            this.idleAnim.update(0); //this needs to run before hacking texture
            this.idleTex = PIXI.Texture.from("reveal" + (index % 2 ? "Purple" : "Yellow") + "01");
            this.idleAnim.hackTextureBySlotName("dollar", this.idleTex, {width: this.revealAnim.width, height: this.revealAnim.height});

            this.addChild(this.resultContainer, this.revealAnim);

            // State
            this.revealed = false;
        
            this.resize();

            // Interactivity
            this.hitArea = new PIXI.Rectangle(
                -(this.WIDTH / 2).valueOf(),
                -(this.HEIGHT / 2).valueOf(),
                this.WIDTH.valueOf(),
                this.HEIGHT.valueOf()
            );
            this.on("press", async () => {
                msgBus.publish("Game.SymbolPressed", this);
                if (!autoPlay.enabled) {
                    this.reveal();
                }
            });
            this.on("pointerover", () => {
                if(this.enabled) {                 
                    Tween.to(this.scale, config.mouseOverTime, {x: config.mouseOverScale, y: config.mouseOverScale, ease: "Elastic.easeOut.config(1, 1)"});
                    Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: config.mouseOverScale, y: config.mouseOverScale, ease: "Elastic.easeOut.config(1, 1)"});
                }
            });
            this.on("pointerout", () => {
                Tween.to(this.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
                Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: this._idleScale.x, y: this._idleScale.y, ease: "Elastic.easeOut.config(1, 1)"});
            });

            msgBus.subscribe("GameSize.OrientationChange", this.resize.bind(this));
            msgBus.subscribe("animation.end", data => {
                if(data.index === this.idleAnimName) {
                    this.idleAnim.alpha = 0;
                    this.revealAnim.alpha = 1;
                }
            });
            msgBus.subscribe("Game.animationController.Update", (name) => {
                if(name === this.idleAnimName) {
                    ///re=hack textures
                    this.idleAnim = animationController.getAnimation(this.idleAnimName).spineObject;
                    this.idleAnim.update(0); //this needs to run before hacking texture

                    this.idleTex = PIXI.Texture.from("reveal" + (index % 2 ? "Purple" : "Yellow") + "01");
                    this.idleAnim.hackTextureBySlotName("dollar", this.idleTex, {width: this.revealAnim.width, height: this.revealAnim.height});
                }
                if(name === "wild8s") {
                    this.spineAnim = animationController.getAnimation("wild8s").spineObject;
                }
            });
        }

        resize() {
            if(orientation.get() === orientation.LANDSCAPE) {
                this.valueSprite.scale.set(0.8);
                this.win.scale.set(0.8);
                this.bonusSunburst.scale.set(0.8);
                this.revealAnim.scale.set(0.8);
                this.spineAnim.scale.set(0.8);
                this.idleAnim.scale.set(0.8);
            } else {
                this.valueSprite.scale.set(1);
                this.win.scale.set(1);
                this.bonusSunburst.scale.set(1);
                this.revealAnim.scale.set(1);
                this.spineAnim.scale.set(1);
                this.idleAnim.scale.set(1);
            }
            this.scale.set(1);
            this._idleScale = {x: this.idleAnim.scale.x, y: this.idleAnim.scale.y};
        }

        enable() {
            return new Promise(resolve => {
                this.reveal = resolve;
                this.enabled = true;
            }).then(() => {
                this.enabled = false;
            });
        }

        populate(value) {
            this.valueSprite.texture = PIXI.Texture.fromFrame(symbol[value]);
            this.revealAnim.visible = true;
            this.revealAnim.gotoAndStop(0);
            this.symbolLetter = value;
        }

        prompt() {
            if(!this.revealing && !this.revealed) {
                this.idleAnim.alpha = 1;
                this.revealAnim.alpha = 0;

                if(!this.idleAnimPlaying) {
                    msgBus.publish("animation.play", { index: this.idleAnimName, anim: "intro", loop: false, onComplete: () => {
                        msgBus.publish("animation.play", { index: this.idleAnimName, anim: "loop", loop: true });
                    }});
                    this.idleAnimPlaying = true;
                }
            }
        }

        cancelPrompt() {
            if(this.idleAnimPlaying) {
                this.idleAnimPlaying = false;
                msgBus.publish("animation.play", { index: this.idleAnimName, anim: "outro", loop: false });
            }
        }

        disable() {
            this.enabled = false;
            this.reveal = undefined;
        }

        reset(duration) {
            let d = duration !== undefined ? duration : config.symbolResetTime;
            return new Promise(resolve => {
                let res = resolve;
                this.matched = false;
                this.symbolLetter = undefined;

                if(this.revealed) {
                    this.revealed = false;
                    this.revealAnim.animationSpeed = -Math.abs(this.revealAnim.animationSpeed);
                    this.revealAnim.onComplete = () => {
                        this.revealAnim.animationSpeed = -this.revealAnim.animationSpeed;
                    };
                    this.revealAnim.gotoAndPlay(this.revealAnim.totalFrames - 1);
                    this.revealAnim.visible = true;
                    this.revealAnim.alpha = 1;    
                }

                new Timeline({
                    onComplete: () => {
                        this.winFlare.visible = false;
                        this.winParticles.visible = false;
                        this.win.visible = false;
                        this.bonusSunburst.visible = false;
                        this.valueSprite.visible = true;
                        this.valueSprite.alpha = 1;
                        this.valueSprite.texture = PIXI.Texture.EMPTY;
                        this.resultContainer.visible = false;
                        this.spineAnimPlaying = false;
                        this.idleAnimPlaying = false;
                        res();
                    }
                })
                    .to(this.resultContainer, d, {alpha: 0}, 0)
                    .to(this.spineAnim, d, {alpha: 0}, 0)
                    .to(this.winFlare, d, {alpha: 0}, 0)
                    .to(this.winParticles, d, {alpha: 0}, 0);
            });
        }

        async uncover() {
            Tween.to(this.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
            Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
            this.revealing = true;
            this.idleAnim.alpha = 0;
            this.revealAnim.alpha = 1;
            const bonus = numbers.state === "BONUSGAME";
            audio.playSequential(bonus ? "bonusTileReveal" : "tileReveal");
            if (this.revealAnim.textures && this.revealAnim.textures.length > 1) {
                //disable info button during reveal (re-enabled by symbolList)
                // msgBus.publish("UI.updateButtons", {
                //     help: { enabled: false, visible: true }
                // });
                await new Promise(resolve => {
                    // bring to front in case the animation overlaps neighboring cards
                    this.revealAnim.parent.parent.setChildIndex(
                        this.revealAnim.parent,
                        this.revealAnim.parent.parent.children.length - 1
                    );

                    // Calculate the animation's duration in seconds
                    const duration = this.revealAnim.textures.length / this.revealAnim.animationSpeed / 60;
                    const halfDuration = duration / 2;
                    // Tween in the results over the 2nd half of the animation
                    this.resultContainer.visible = true;
                    new Timeline()
                        .fromTo(
                            this.resultContainer,
                            halfDuration,
                            { alpha: 0 },
                            { alpha: 1, delay: halfDuration }
                        )
                        .to(this.resultContainer.scale, config.symbolValuePulseTime, {x: config.symbolValuePulseScale, y:config.symbolValuePulseScale}, duration)
                        .to(this.resultContainer.scale, config.symbolValuePulseTime, {x: 1, y: 1});
                    
                    // Wait for the animation to complete before resolving
                    this.revealAnim.onComplete = () => {
                        this.revealAnim.visible = false;
                        this.revealed = true;
                        this.revealing = false;
                        if (Pressable._lock === this) {
                            Pressable._lock = null;
                        }
                        resolve();
                    };

                    // Disable interactivity to prevent re-reveal, then switch to the animation
                    this.enabled = false;
                    this.revealAnim.gotoAndPlay(0);
                });
            } else {
                // Otherwise just a swap from the cover to the resultsContainer
                this.resultContainer.visible = true;
                this.revealAnim.visible = false;
                this.revealed = true;
            }
        }

        presentWin() {
            return new Promise(resolve => {
                this.winResolve = resolve;
                if(this.symbolLetter == "W") {
                    this.win.visible =false;
                    //avoid animating wild 8 twice
                    if(this.spineAnimPlaying) {                        
                        this.winResolve();
                        return;
                    }
                    //animate wild 8
                    this.spineAnimPlaying = true;
                    this.bonusSunburst.visible = true;
                    this.spineAnim.visible = config.animateWildSymbol;
                    this.spineAnim.x = this.parent.x;
                    this.spineAnim.y = this.parent.y;
                    this.spineAnim.parent.setChildIndex(this.spineAnim, this.spineAnim.parent.children.length - 1);
                    //force the wild8s animation back to frame 0
                    msgBus.publish("animation.play", { index: "wild8s", anim: "wobble" });
                    msgBus.publish("animation.clear", { index: "wild8s", anim: "wobble" });

                    new Timeline({
                        onComplete: () => {
                            this.winResolve();
                        }
                    })
                        .fromTo(this.bonusSunburst, config.sunburstFadeInTime, {alpha: 0}, {alpha: 0.4}, 0)
                        .fromTo(this.spineAnim, config.wild8sAnimFadeInTime, {alpha: 0}, {alpha: config.animateWildSymbol ? 1 : 0}, 0)
                        .call(() => {
                            msgBus.publish("animation.play", { index: "wild8s", anim: "wobble" }); 
                        }, null, null, 0)
                        .to(this.bonusSunburst, config.sunburstFadeOutTime, {alpha: config.animateWildSymbol ? 0 : 1}, config.wild8sAnimFadeInTime)
                        .to(this.valueSprite, config.wild8ValueFadeOutTime, {alpha: config.animateWildSymbol ? 0 : 1}, config.wild8sAnimFadeInTime);
                } else {
                    this.winFlare.visible = true;
                    this.winParticles.visible = true;
                    this.win.visible = true;

                    this.winFlare.gotoAndPlay(0);
                    new Timeline()
                        .fromTo(this.win, config.winHighlightFadeInTime, {alpha: 0}, {alpha: 1})
                        .fromTo(this.valueSprite, config.winHighlightFadeInTime, {alpha: 1}, {alpha: 0})
                        .fromTo(this.winFlare, config.winFlareFadeInTime, {alpha: 0}, {alpha: 1}, 1)
                        .call(() => {
                            this.winParticles.alpha = 1;
                            this.winParticles.onComplete = () => {
                                this.winResolve();
                            };
                            this.winParticles.gotoAndPlay(0);
                        }, null, config.winParticlesDelay)
                        .to(this.winFlare, config.winFlareFadeOutTime, {alpha: 0}, config.winHighlightFadeInTime + config.winFlareDuration);
                }
            });
        }     

        match() {
            this.matched = true;
            this.win.visible = true;
        }

        static fromContainer(container, particleContainer, index) {
            const symbol = new Symbol(index);
            container.addChildAt(symbol, 0);
            container.symbol = symbol;
            particleContainer.addChild(symbol.particleContainer);

            symbol.particleContainer.position.set(container.x, container.y);
            return symbol;
        }
    }

    return Symbol;
});
