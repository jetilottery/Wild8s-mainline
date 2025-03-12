define(function(require) {
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const scenarioData = require("skbJet/componentManchester/standardIW/scenarioData");
    const gamePlay = require("game/gamePlay");
    const audio = require("skbJet/componentManchester/standardIW/audio");
    const meterData = require("skbJet/componentManchester/standardIW/meterData");
    //  const displayList = require("skbJet/componentManchester/standardIW/displayList");


    function resultScreen() {
        const winner = meterData.totalWin > 0;
        const bonusPlayed = scenarioData.scenario.wildCard;

        let terminator = winner ? "winTerminator" : "loseTerminator";
        if (bonusPlayed) {
            audio.fadeOut("musicNight", config.resultMusicFadeOutDuration);
        } else {
            audio.fadeOut("music", config.resultMusicFadeOutDuration);
        }

        //if (config.showLargeResultPlaque || (!winner && config.showNonWinResultPlaque)) {
        //audio.play(terminator);
        //gamePlay.showLargeResult(scenarioData.scenario.totalWin);
        //}

        if (winner) {

            audio.play(terminator);
            gamePlay.showLargeResult(scenarioData.scenario.totalWin);

        } else {

            if (config.showNonWinResultPlaque === true) {
                audio.play(terminator);
                gamePlay.showLargeResult(scenarioData.scenario.totalWin);
            }
        }


        msgBus.publish("UI.updateButtons", {
            home: { enabled: true, visible: true }
        });
        gamePlay.startAttractMode();
    }
    gameFlow.handle(resultScreen, "RESULT_SCREEN");
});