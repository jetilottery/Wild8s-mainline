define(function(require) {
  const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
  const config = require("skbJet/componentManchester/standardIW/gameConfig");
  const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
  const displayList = require("skbJet/componentManchester/standardIW/displayList");
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const scenarioData = require("skbJet/componentManchester/standardIW/scenarioData");
  const meterData = require("skbJet/componentManchester/standardIW/meterData");
  const revealAll = require("game/revealAll");
  const gamePlay = require("game/gamePlay");
  const numbers = require("game/state/numbers");
  const audio = require("skbJet/componentManchester/standardIW/audio");
  const audioPlayer = require("skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer");

  // Listen for autoplay activation which triggers the remaining cards to reveal automatically
  msgBus.subscribe("Game.AutoPlayStart", revealAll.start);

  // Listen for autoplay deactivation which cancels the revealAll timeline
  msgBus.subscribe("Game.AutoPlayStop", revealAll.stop);

  // SDLX-130: For some reason the background music sometimes plays when you turn the sound on at game start. Force audio to switch off if this happens.
  function cycleAudio() {
    msgBus.unsubscribe("Game.AudioOn", cycleAudio);

    // kill all audio and re-enable
    audioPlayer.stopAll();
    audio.enable();

    //set music loop if required
    switch(numbers.state) {
        case "BASEGAME":
            audio.play("music", true, 1.0);
            break;
        case "BONUSGAME":
            audio.play("musicNight", true, 1.0);
    }
    // This seems to fix the audio stopping at end of first loop
    audioPlayer.pauseChannel(0);
    audioPlayer.resumeChannel(0);
    ///
  }
  msgBus.subscribe("Game.AudioOn", cycleAudio);
  
  let symbolsPressed = 0;
  msgBus.subscribe("Game.SymbolPressed", (symbol) => {
    console.log("SYMBOL PRESS: ");
    console.log(symbol);
    symbolsPressed++;
    if(symbolsPressed >= 11) { //WILD8S-238: Disable help immediately when all symbols + prizeboxes are pressed.
      msgBus.publish("UI.updateButtons", {
        help: { enabled: false }
      });
    }
  });

  //start main game
  async function startTurn() {
    msgBus.subscribe("Game.AudioOn", cycleAudio);
    symbolsPressed = 0;
    if (numbers.nextState === "BASEGAME") {
      await gamePlay.startBaseGame();
    }
    gameFlow.next("REVEAL_TURN");
  }
  gameFlow.handle(startTurn, "START_TURN");

  //next game
  async function revealTurn() {
    symbolsPressed = 0;
    if (numbers.state === "BASEGAME") {
      await gamePlay.baseGame(scenarioData.turn);
      if (scenarioData.scenario.wildCard) {
        audio.play("winPopup");
        let basePrize = scenarioData.scenario.baseGame.wins.includes(true) ? scenarioData.scenario.prizeTable[scenarioData.turn.prize] * parseInt(scenarioData.turn.multiplier) : 0;
        await gamePlay.showResult(basePrize);
        await gamePlay.startBonusGame(scenarioData.scenario);
      } else {
        await gamePlay.endGame();
      }
    } else if (numbers.state === "BONUSGAME") {
      let bonusPrize = scenarioData.turn.wins.includes(true) ? scenarioData.scenario.prizeTable[scenarioData.turn.prize] * parseInt(scenarioData.turn.multiplier) : 0;
      await gamePlay.bonusGame(scenarioData.turn);
      await gamePlay.showResult(bonusPrize);
    }
    gameFlow.next("END_TURN");
  }
  gameFlow.handle(revealTurn, "REVEAL_TURN");

  //End of game
  async function endReveal() {
    symbolsPressed = 0;
    if (numbers.state !== "ENDOFGAME") {
      await gamePlay.endGame();
    }

    if(config.bypassSmallResultScreen) {
      gamePlay.showResult(scenarioData.scenario.totalWin);
    }

    if (config.mockData) {
      meterData.win = meterData.totalWin;
      displayList.winValue.text = SKBeInstant.formatCurrency(scenarioData.scenario.totalWin).formattedAmount + "(MOCK)";
    }
    gameFlow.next("REVEAL_COMPLETE");
  }
  gameFlow.handle(endReveal, "END_REVEAL");
});