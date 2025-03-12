define(require => {

    const animationController = require("game/components/animation/animationController");
    //const orientation = require("skbJet/componentManchester/standardIW/orientation");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const displayList = require("skbJet/componentManchester/standardIW/displayList");

    async function init() {
        animationController.addAnimation({
            index: "wild8s",
            file: "wild8s",
            loop: true,
            x: 0,
            y: 0,
            pivotX:0,
            pivotY:0,
            alpha: 0,
            container: displayList.playerNumbers
        });

        animationController.addAnimation({
            index: "animLogo",
            file: "animLogo",
            loop: "true",
            x: 0,
            y: 0,
            pivotX:0,
            pivotY:0,
            alpha: 1,
            container: displayList.logoAnim
        });

        animationController.addAnimation({
            index: "dancingSymbol0",
            container: displayList.symbol0,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX: 0.5, pivotY: 0.5, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol1",
            container: displayList.symbol1,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol2",
            container: displayList.symbol2,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol3",
            container: displayList.symbol3,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol4",
            container: displayList.symbol4,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol5",
            container: displayList.symbol5,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol6",
            container: displayList.symbol6,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol7",
            container: displayList.symbol7,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
        animationController.addAnimation({
            index: "dancingSymbol8",
            container: displayList.symbol8,
            file: "dancingSymPortrait", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "prizeBoxIdle_landscape",
            container: displayList.prizeBox,
            file: "landscapeIdle", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "bonusBoxIdle_landscape",
            container: displayList.bonusBox,
            file: "landscapeIdle", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "prizeBoxIdle_portrait",
            container: displayList.prizeBox,
            file: "portraitIdle", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "bonusBoxIdle_portrait",
            container: displayList.bonusBox,
            file: "portraitIdle", loop: false, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "buttonAttract_buy",
            container: displayList.buyButton,
            file: "buttonIdle", loop: true, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "buttonAttract_try",
            container: displayList.tryButton,
            file: "buttonIdle", loop: true, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });

        animationController.addAnimation({
            index: "buttonAttract_moveToMoney",
            container: displayList.moveToMoneyButton,
            file: "buttonIdle", loop: true, x: 0, y: 0, pivotX:0, pivotY:0, alpha: 0
        });
    }

    msgBus.subscribe("animation.play", data => {
        animationController.playAnimation(data);
    });

    msgBus.subscribe("animation.add", data => {
        animationController.queueAnimation(data);
    });

    msgBus.subscribe("animation.clear", data => {
        animationController.clearAnimation(data);
    });

    // msgBus.subscribe("animation.queue",data=>{
    //
    // });

    return {
        init
    };

});