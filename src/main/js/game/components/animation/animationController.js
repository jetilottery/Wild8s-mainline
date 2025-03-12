define(require => {

    const resources = require("skbJet/component/resourceLoader/resourceLib");
    const PIXI = require("com/pixijs/pixi");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");

    require("com/gsap/TweenLite");

    const Tween = window.TweenLite;


    let animationList = {
    };

    function addAnimation(value) {
        let anim =  new PIXI.spine.Spine( resources.spine[value.file].spineData );
        if(animationList[value.index]) {
            // replacing anim
            anim.alpha = animationList[value.index].spineObject.alpha;
            anim.scale.set(animationList[value.index].spineObject.scale.x, animationList[value.index].spineObject.scale.y);
            anim.pivot.set(animationList[value.index].spineObject.pivot.x, animationList[value.index].spineObject.pivot.y);
            anim.position.set(animationList[value.index].spineObject.x, animationList[value.index].spineObject.y);
            value.container.removeChild(animationList[value.index].spineObject);
        } else {
            animationList[value.index] = {};
            anim.position.set(value.x, value.y);
            anim.pivot.set(value.pivotX, value.pivotY);
            anim.alpha = value.alpha;
        }
        animationList[value.index].index = value.index;
        animationList[value.index].spineObject = anim;
        animationList[value.index].name = value.name;
        animationList[value.index].loop = value.loop;
        animationList[value.index].loopCount = 0;

        if(value.back === undefined) {
            value.container.addChild(anim);
        } else {
            value.container.addChildAt(anim,0);
        }
        msgBus.publish("Game.animationController.Update", value.index);
    }

    function getAnimation(value) {
        return animationList[value];
    }

    function getAnimationList() {
        return animationList;
    }

    function playAnimation(value) {
        let loop = false;
        if(typeof value.loop === "number" && value.loop > 1) {
            animationList[value.index].loopCount = value.loop;
        } else {
            loop = value.loop;
        }

        if(value.onComplete && typeof value.onComplete === "function") {
            animationList[value.index].spineObject.state.onComplete = value.onComplete;
        } else {
            animationList[value.index].spineObject.state.onComplete = () => {
                if(loop === false) {
                    animationList[value.index].loopCount--;
                    if(animationList[value.index].loopCount > 0) {
                        playAnimation(value);
                    } else {
                        msgBus.publish("animation.end", value);
                    }    
                }
            };    
        }

        animationList[value.index].spineObject.state.setAnimation(
            0,
            value.anim,
            loop === undefined ? animationList[value.index].loop : loop
        );
    }

    function clearAnimation(value) {
        let track = animationList[value.index].spineObject.state.tracks.filter(track => track && track.animation.name === value.anim)[0];
        if(track) {
            animationList[value.index].spineObject.state.clearTrack(track.trackIndex);
        }
    }

    function queueAnimation(value) {
        animationList[value.index].spineObject.state.addAnimation(
            0,
            value.anim,
            value.loop === undefined ? animationList[value.index].loop : value.loop
        );
    }

    function fadeBetween(current,next,time) {
        Tween.to(current,time,{
           alpha:0
        });
        Tween.to(next,time,{
            alpha:1
        });
    }

    return {
        getAnimation,
        playAnimation,
        clearAnimation,
        queueAnimation,
        fadeBetween,
        getAnimationList,
        addAnimation
    };

});