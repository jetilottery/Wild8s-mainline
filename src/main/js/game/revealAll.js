define(require => {
  const Timeline = require("com/gsap/TimelineLite");
  const config = require("skbJet/componentManchester/standardIW/gameConfig");
  const displayList = require("skbJet/componentManchester/standardIW/displayList");
  const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
  const symbolList = require("game/components/symbolList");
  const autoPlay = require("skbJet/componentManchester/standardIW/autoPlay");

  let revealAllTimeline;

  function start() {
    // disable all interaction at the parent container level
    displayList.gameGrid.interactiveChildren = false;

    msgBus.publish("UI.updateButtons", {
      help: { enabled: false, visible: true }
    });

    if(revealAllTimeline) {
      revealAllTimeline.resume();
    } else {
      const revealAll = symbolList.revealAll();
      revealAllTimeline = new Timeline();

      // reveal all tiles
      revealAllTimeline
        .add(
          new Timeline({ tweens: revealAll.boxes, stagger: config.autoPlayTime / symbolList.tiles.length })
        )
        .add(
          new Timeline({ tweens: revealAll.symbols, stagger: config.autoPlayTime / symbolList.tiles.length, delay: config.autoPlayBoxSymbolInterval })
        );
      return revealAllTimeline;
    }
  }
  msgBus.subscribe("game.prizeBoxAutoReveal", start);

  function stop() {
    // kill the revealAll timeline if active
    if (revealAllTimeline) {
      revealAllTimeline.pause();
      displayList.gameGrid.interactiveChildren = true;
    }
  }

  function onReset() {
    if(revealAllTimeline) {
      revealAllTimeline.kill();
    }
    revealAllTimeline = undefined;
    msgBus.publish("UI.updateButtons", {autoPlay: {enabled: config.toggleAutoplay}});
  }
  msgBus.subscribe("game.reset", onReset);

  function onTileRevealed() {
    if(!autoPlay._enabled) {
      revealAllTimeline = undefined;
    }
  }
  msgBus.subscribe("game.tileRevealed", onTileRevealed);

  return {
    start,
    stop,
  };
});
