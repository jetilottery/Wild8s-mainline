define(function (require) {
    //const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const prizeData = require("skbJet/componentManchester/standardIW/prizeData");
    //const debug = require("game/components/debug/force");

    //const dummyString = "M,4,88236548W|C,3,287875488|J,2,828486728|I,1,832848682";

    return function scenarioTransform(scenarioString) {
        // split the string into the three components; winning, instant and player numbers
        let games = /*config.mockData ? debug.mechanic.split("|") :*/ scenarioString.split("|");
        let prizeTable = /*config.mockData ? debug.mockPrizeTable :*/ prizeData.prizeTable;
        let [baseGame, bonusGame_1, bonusGame_2, bonusGame_3 ] = games.map(game => {
            let [pri, mul, val] = game.split(",");
            return {
                prize: pri,
                multiplier: parseInt(mul),
                values: val.split("")
            };
        });

        function parseLine(...input) {
            return input.reduce((prev, curr) => { return prev && ["W", "8"].includes(curr); }, true);
        }

        let wildCard = baseGame.values.indexOf("W") > -1;

        baseGame.wins = [
            parseLine(baseGame.values[6], baseGame.values[7], baseGame.values[8]),
            parseLine(baseGame.values[3], baseGame.values[4], baseGame.values[5]),
            parseLine(baseGame.values[0], baseGame.values[1], baseGame.values[2]),
            parseLine(baseGame.values[6], baseGame.values[3], baseGame.values[0]),
            parseLine(baseGame.values[7], baseGame.values[4], baseGame.values[1]),
            parseLine(baseGame.values[8], baseGame.values[5], baseGame.values[2]),
            parseLine(baseGame.values[6], baseGame.values[4], baseGame.values[2]),
            parseLine(baseGame.values[0], baseGame.values[4], baseGame.values[8])            
        ];
        if(wildCard) {
            bonusGame_1.wins = [
                parseLine(bonusGame_1.values[6], bonusGame_1.values[7], bonusGame_1.values[8]),
                parseLine(bonusGame_1.values[3], bonusGame_1.values[4], bonusGame_1.values[5]),
                parseLine(bonusGame_1.values[0], bonusGame_1.values[1], bonusGame_1.values[2]),
                parseLine(bonusGame_1.values[6], bonusGame_1.values[3], bonusGame_1.values[0]),
                parseLine(bonusGame_1.values[7], bonusGame_1.values[4], bonusGame_1.values[1]),
                parseLine(bonusGame_1.values[8], bonusGame_1.values[5], bonusGame_1.values[2]),
                parseLine(bonusGame_1.values[6], bonusGame_1.values[4], bonusGame_1.values[2]),
                parseLine(bonusGame_1.values[0], bonusGame_1.values[4], bonusGame_1.values[8])
            ];
            bonusGame_2.wins = [
                parseLine(bonusGame_2.values[6], bonusGame_2.values[7], bonusGame_2.values[8]),
                parseLine(bonusGame_2.values[3], bonusGame_2.values[4], bonusGame_2.values[5]),
                parseLine(bonusGame_2.values[0], bonusGame_2.values[1], bonusGame_2.values[2]),
                parseLine(bonusGame_2.values[6], bonusGame_2.values[3], bonusGame_2.values[0]),
                parseLine(bonusGame_2.values[7], bonusGame_2.values[4], bonusGame_2.values[1]),
                parseLine(bonusGame_2.values[8], bonusGame_2.values[5], bonusGame_2.values[2]),
                parseLine(bonusGame_2.values[6], bonusGame_2.values[4], bonusGame_2.values[2]),
                parseLine(bonusGame_2.values[0], bonusGame_2.values[4], bonusGame_2.values[8])
            ];
            bonusGame_3.wins = [
                parseLine(bonusGame_3.values[6], bonusGame_3.values[7], bonusGame_3.values[8]),
                parseLine(bonusGame_3.values[3], bonusGame_3.values[4], bonusGame_3.values[5]),
                parseLine(bonusGame_3.values[0], bonusGame_3.values[1], bonusGame_3.values[2]),
                parseLine(bonusGame_3.values[6], bonusGame_3.values[3], bonusGame_3.values[0]),
                parseLine(bonusGame_3.values[7], bonusGame_3.values[4], bonusGame_3.values[1]),
                parseLine(bonusGame_3.values[8], bonusGame_3.values[5], bonusGame_3.values[2]),
                parseLine(bonusGame_3.values[6], bonusGame_3.values[4], bonusGame_3.values[2]),
                parseLine(bonusGame_3.values[0], bonusGame_3.values[4], bonusGame_3.values[8])
            ];    
        }

        return {
            baseGame,
            bonusGames: [bonusGame_1, bonusGame_2, bonusGame_3],
            wildCard,
            prizeTable,
            get totalWin() {
                let totalPrize = 0;
                if(baseGame.wins.includes(true)) {
                    totalPrize += prizeTable[baseGame.prize] * baseGame.multiplier;
                }
                if(wildCard) {
                    this.bonusGames.forEach(bg => {
                        totalPrize += bg.wins.includes(true) ? prizeTable[bg.prize] * bg.multiplier : 0;
                    });
                }
                return totalPrize;
            },
            get turns() {
                return wildCard ? [baseGame, bonusGame_1, bonusGame_2, bonusGame_3] : [baseGame, undefined, undefined, undefined];
            }
        };
    };
});
