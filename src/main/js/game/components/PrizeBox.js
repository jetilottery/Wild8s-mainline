define(require => {
    const PIXI = require("com/pixijs/pixi");
    const app = require("skbJet/componentManchester/standardIW/app");
	const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const orientation = require("skbJet/componentManchester/standardIW/orientation");
    const FittedText = require('skbJet/componentManchester/standardIW/components/fittedText');
    const textStyles = require("skbJet/componentManchester/standardIW/textStyles");
    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const animationController = require("game/components/animation/animationController");
    const audio = require("skbJet/componentManchester/standardIW/audio");
    const maths = require("skbJet/componentLondon/utils/maths");

    require("com/gsap/TweenMax");
    require("com/gsap/TimelineMax");
    require("com/gsap/easing/CustomEase");
    require("com/gsap/plugins/PixiPlugin");
    
    const Timeline = window.TimelineMax;
    const Tween = window.TweenMax;

    class PrizeBox extends Pressable {
        constructor(foilString, index) {
            super();

            // Create all the empty sprites
            this.backgroundSprite = PIXI.Sprite.fromFrame("pbBoxBG" + (orientation.get() === orientation.LANDSCAPE ? "Landscape" : "Portrait"));
            this.valueText = new FittedText("XXXX");
            this.valueText.style = textStyles.parse("prizeBoxPrize");
            this.foil = new PIXI.Container();
            this.foilSprite = PIXI.Sprite.fromFrame("pbBoxFoil" + (orientation.get() === orientation.LANDSCAPE ? "Landscape" : "Portrait"));
            this.gutter = 0;
            this.antiFoilTex = PIXI.RenderTexture.create(this.foilSprite.width + this.gutter, this.foilSprite.height + this.gutter);
            this.antiFoil = new PIXI.Sprite(this.antiFoilTex);
            this.foilText = new FittedText(foilString);
            this.foilText.style = textStyles.parse("prizeBoxFoil");

            //centre everything
            this.backgroundSprite.anchor.set(0.5);
            this.valueText.anchor.set(0.5);
            this.foilText.anchor.set(0.5);
            this.antiFoil.anchor.set(0.5);

            this.WIDTH = this.backgroundSprite.width;
            this.HEIGHT = this.backgroundSprite.height;
            this.TEXT_PADDING = 10;

            this.valueText.maxWidth = this.WIDTH - this.TEXT_PADDING * 2;
            this.foilText.maxWidth = this.WIDTH - this.TEXT_PADDING * 2;

            this.foil.addChild(this.foilSprite, this.foilText);

            // Center everything
            this.backgroundSprite.anchor.set(0.5);
            this.valueText.anchor.set(0.5);
            this.foilSprite.anchor.set(0.5);

            this.valueText.visible = false;

            //Idle
            this.idleAnimName = "prizeBoxIdle_";
            let suffix = (orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait");
            this.idleAnim = animationController.getAnimation(this.idleAnimName + suffix).spineObject;

            this.addChild(this.backgroundSprite, this.valueText, this.foil);

            // State
            this.revealed = false;
            this.revealing = false;
            this.enabled = false;

            //symbolList identifiers
            this.index = index;
            this.symbolLetter = "B";

            // Interactivity
            this.hitArea = new PIXI.Rectangle(
                -(this.WIDTH / 2).valueOf(),
                -(this.HEIGHT / 2).valueOf(),
                this.WIDTH.valueOf(),
                this.HEIGHT.valueOf()
            );
            this.on('press', async () => {
                msgBus.publish("Game.SymbolPressed", this);
                if (!autoPlay.enabled) {
                    this.reveal();
                }
            });
            this.on("pointerover", () => {
                if(this.enabled) {
                    this._scale = {x: this.scale.x, y: this.scale.y};
                    Tween.to(this.scale, config.mouseOverTime, {x: config.mouseOverScale, y: config.mouseOverScale, ease: "Elastic.easeOut.config(1, 1)"});
                    Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: config.mouseOverScale, y: config.mouseOverScale, ease: "Elastic.easeOut.config(1, 1)"});
                }
            });
            this.on("pointerout", () => {
                Tween.to(this.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
                Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
            });

            msgBus.subscribe("GameSize.OrientationChange", this.resize.bind(this));
            msgBus.subscribe("animation.end", data => {
                if(data.index.includes(this.idleAnimName)) {
                    this.idleAnim.alpha = 0;
                }
            });
            msgBus.subscribe("Game.animationController.Update", (name) => {
                if(this.idleAnimName === name) {
                    this.idleAnim = animationController.getAnimation(this.idleAnimName + suffix).spineObject;
                }
            });
            this.resize();
            this.clearScratches();
        }

        resize() {
            if(!this.backgroundSprite) {
                return;
            }
            var l = orientation.get() === orientation.LANDSCAPE;
            this.backgroundSprite.texture = PIXI.Texture.fromFrame("pbBoxBG" + (l ? "Landscape" : "Portrait"));
            this.foilSprite.texture = PIXI.Texture.fromFrame("pbBoxFoil" + (l ? "Landscape" : "Portrait"));
            this.foil.visible = !this.revealed;
            this.valueText.visible = this.revealed;

            this.idleAnim.alpha = 0;
            this.idleAnim = animationController.getAnimation(this.idleAnimName + (l ? "landscape" : "portrait")).spineObject;

            this.WIDTH = this.backgroundSprite.width;
            this.HEIGHT = this.backgroundSprite.height;
            this.valueText.maxWidth = this.WIDTH - this.TEXT_PADDING * 2;
            this.scale.set(1);
        }

        enable() {
            return new Promise(resolve => {
                this.reveal = resolve;
                this.enabled = true;
            }).then(() => {
                this.enabled = false;
            });
        }

        populate(text) {
            this.valueText.text = text;
            this.foil.visible = true;
        }

        prompt() {
            if(!this.revealing && !this.revealed) {
                this.idleAnim.alpha = 1;
                this.idleAnim.scale.set(this.scale.x, this.scale.y);
                let suffix = (orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait");
                msgBus.publish("animation.play", { index: this.idleAnimName + suffix, anim: "animation", loop: true });    
            }
        }

        cancelPrompt() {
            this.idleAnim.alpha = 0;
        }

        disable() {
            this.enabled = false;
            this.reveal = undefined;
        }

        clearScratches() {
            if(!this.foil.parent) {
                return;
            }

            //Size antifoil to cover whole foil (accounting for rotation of the tile)
			let b = maths.rotatedBounds(this.foil.getLocalBounds(), this.foil.parent.rotation, 10);
			this.antiFoilTex.resize(b.width + this.gutter, b.height + this.gutter);

			//Fill with white alpha 1
			let g = new PIXI.Graphics();
			g.beginFill(0xFFFFFF, 1);
			g.drawRect(0, 0, this.antiFoilTex.width, this.antiFoilTex.height);
			app.renderer.render(g, this.antiFoilTex);

			this.foil.mask = this.antiFoil;
			this.foil.parent.addChild(this.antiFoil);
        }

        async uncover() {
            Tween.to(this.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
            Tween.to(this.idleAnim.scale, config.mouseOverTime, {x: 1, y: 1, ease: "Elastic.easeOut.config(1, 1)"});
            this.backgroundSprite.alpha = 1;
            this.valueText.alpha = 1;
            this.foilSprite.alpha = 1;
            this.idleAnim.alpha = 0;
            this.revealing = true;
            this.valueText.visible = true;
            audio.playSequential("prizeBoxReveal", false);

            return new Promise(resolve => {
                //disable info button during reveal (re-enabled by symbolList)
                // msgBus.publish("UI.updateButtons", {
                //     help: { enabled: false, visible: true }
                // });
                this.wipe(new PIXI.Sprite.fromFrame("wipeBrush"), config.prizeBoxRevealTime);
                new Timeline({
                    onComplete: () => {
                        this.revealed = true;
                        this.revealing = false;
                        if (Pressable._lock === this) {
                            Pressable._lock = null;
                        }
                        resolve();
                    }
                })
                    .fromTo(this.valueText, config.prizeBoxRevealTime, {alpha: 0}, {alpha: 1});
                
				this.valueText.visible = true;
			});
        }
        
        async wipe(brushSprite, duration) {
            return new Promise(resolve => {
                let gp = this.foilSprite.getGlobalPosition();
                let brushPos = {x: gp.x + (this.foilSprite.width / 2) + brushSprite.width, y: gp.y};
                let brushPosPrev = {x: brushPos.x, y: brushPos.y};
                brushSprite.anchor.set(0.5);
                brushSprite.position.set(brushPos.x, brushPos.y);
                app.stage.addChildAt(brushSprite, 0);

                Tween.to(brushPos, duration, {
                    x: -(this.foilSprite.width / 2) - brushSprite.width,
                    onUpdate: function () {
                        let dist =  maths.pointDistance(brushPosPrev, brushPos);
                        let points = [];
                        for(let i = 0; i < dist; i += 10) {
                            points.push(maths.lerp(brushPosPrev, brushPos, (i / dist)));
                        }
                        this.scratchFoil({
                            brushSprite: brushSprite,
                            points: points
                        });
                        brushPosPrev.x = brushPos.x;
                        brushPosPrev.y = brushPos.y;
                    },
                    onUpdateScope: this,
                    onComplete: function() {
                        resolve();
                    },
                    onCompleteScope: this
                });
            });
        }

        scratchFoil(data) {
            for(let i = 0; i < data.points.length; i++) {
                let wt = this.antiFoil.worldTransform;
                let p = wt.applyInverse(data.points[i]);
                data.brushSprite.x = p.x + this.antiFoil.width / 2;
                data.brushSprite.y = p.y + this.antiFoil.height / 2;
                data.brushSprite.scale.set(1/wt.a, 1/wt.d);
                app.renderer.render(data.brushSprite, this.antiFoilTex, false, false, false);
                data.brushSprite.scale.set(1);
            }
        }

        reset() {
            return new Promise(async resolve => {
                this.foilSprite.visible = true;
                this.foilSprite.alpha = 1;
                this.valueText.text = "XXXX";
                this.valueText.visible = false;
                this.matched = false;
                await this.wipe(new PIXI.Sprite.fromFrame("wipeBrushWhite"), config.prizeBoxResetTime);
                this.revealed = false;
                resolve();
            });
        }

        static fromContainer(container, foilString, index) {
            const pmBox = new PrizeBox(foilString, index);
            container.addChildAt(pmBox, 0);
            container.symbol = pmBox;
            return pmBox;
        }
    }

    return PrizeBox;
});
