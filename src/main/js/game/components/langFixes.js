define(require=> {

    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

    function applyLangFix() {
        if(displayList.moveToMoneyButton !== undefined)
            displayList.moveToMoneyButton.label.maxWidth = 250;
        if(displayList.tryButton !== undefined)
            displayList.tryButton.label.maxWidth = 250;
        if(displayList.playAgainButton !== undefined)
            displayList.playAgainButton.label.maxWidth = 250;
        if(displayList.winPlaqueValue !== undefined)
            displayList.winPlaqueValue.maxWidth = 600;
        if(displayList.ticketSelectCostValue !== undefined)
            displayList.ticketSelectCostValue.maxWidth = 400;
        if(displayList.tryAgainButton !== undefined)
            displayList.tryAgainButton.label.maxWidth = 250;
    }

    msgBus.subscribe('game.applyLangFix',applyLangFix);
    msgBus.subscribe('GameSize.OrientationChange',applyLangFix);

});