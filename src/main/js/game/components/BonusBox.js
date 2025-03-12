define(require => {
    const PrizeBox = require("./PrizeBox");
    const textStyles = require("skbJet/componentManchester/standardIW/textStyles");
    const orientation = require("skbJet/componentManchester/standardIW/orientation");
    const animationController = require("game/components/animation/animationController");

    class BonusBox extends PrizeBox {
        constructor(foilString, index) {
            super(foilString, index);

            this.foilText.style = textStyles.parse("bonusBoxFoil");
            this.valueText.style = textStyles.parse("bonusBoxPrize");

            this.idleAnimName = "bonusBoxIdle_";

            let suffix = (orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait");
            this.idleAnim = animationController.getAnimation(this.idleAnimName + suffix).spineObject;
        }

        static fromContainer(container, foilString, index) {
            const boBox = new BonusBox(foilString, index);
            container.addChildAt(boBox, 0);
            container.symbol = boBox;
            return boBox;
        }
    }
    
    return BonusBox;
});
