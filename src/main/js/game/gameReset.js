define(function(require) {
  const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
  const winUpTo = require("game/components/winUpTo");
  const audio = require("skbJet/componentManchester/standardIW/audio");
  const config  = require("skbJet/componentManchester/standardIW/gameConfig");
  const gamePlay = require("game/gamePlay");
  const numbers = require("game/state/numbers");
  const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
  const displayList = require("skbJet/componentManchester/standardIW/displayList");
  const animationView = require("game/components/animation/animationView");

  require("com/gsap/TweenMax");

  const Tween = window.TweenMax;

  async function gameReset() {    
    if(config.showLargeResultPlaque) {
      gamePlay.closeLargeResult();
    }

    if(numbers.state !== "BASEGAME") {
      numbers.nextState = "BASEGAME";
      Tween.delayedCall(config.transition_delayFrames, gamePlay.reset, null, null, true);
      await gamePlay.transition();
    } else {
      await gamePlay.reset();
    }

    numbers.reset();
    winUpTo.reset();

    // Fade out the win/lose terminator in case it is still playing
    if (audio.isPlaying("winTerminator")) {
      audio.fadeOut("winTerminator", 1);
    }
    if (audio.isPlaying("loseTerminator")) {
      audio.fadeOut("loseTerminator", 1);
    }

    // Fade out any visible Plaques
    Tween.to(displayList.resultPlaque, 0.5, {alpha: 0});
    Tween.to(displayList.largeResultPlaque, 0.5, {alpha: 0});

    //re-init spines (WILD8S-231)
    animationView.init();
  }

  async function prepareOrReset() {
    await gameReset();
    gameFlow.next();
  }

  msgBus.subscribe("TicketSelect.CostUp", gameReset);
  msgBus.subscribe("TicketSelect.CostDown", gameReset);
  msgBus.subscribe("TicketSelect.CostMax", gameReset);

  gameFlow.handle(prepareOrReset, "GAME_RESET");
  gameFlow.handle(prepareOrReset, "GAME_PREPARE");
});
