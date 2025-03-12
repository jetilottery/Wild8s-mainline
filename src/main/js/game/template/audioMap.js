define({
    // IMPLEMENT: Map SFX to channels

    /* 
     * If audio assets are named nicely you can do:
     * {
     *  fileName: channelNumber
     * }
     * 
     * Otherwise use a nice name for the keys and include the filename and channel as an array:
     * {
     *  soundName: ["Ugly_sound_file_V2-final", channelNumber]
     * }
     */

    music: ["MusicLoopDay", 0],
    musicNight: ["BonusMusicLoop", 0],
    winTerminator: ["MusicTermWin", 1],
    loseTerminator: ["MusicTermLose", 1],
    lineMatch:["LineMatch01", 2],
    lineMatchWild: ["lineMatchWild", 3],
    lineNumbersHighlight: ["lineNumbershighlight", 4],
    costDown: ["BetDown", 1],
    costUp: ["BetUp", 2],
    costMax: ["BetMax", 3],
    transition: ["FreeSpinsTransition", 2],
    winPopup: ["WinPopUp", 8],
    bonusTurnIncrease: ["BonusTurnsIncrease", 9],
    bonusTurnCounter: ["BonusTurnsCounter", 10],
    bonusDrop:["BonusDrop",11],

    /*
     * Audio groups
     * A game can include multiple variations of each of these sounds. Ensure each variation starts
     * with the same name plus some kind of ordered suffix. Each time a sound group plays the next 
     * item in the group will be used.
     */

    tileReveal01: ["TileReveal01", 6],
    tileReveal02: ["TileReveal02", 7],

    bonusTileReveal01: ["BonusTileReveal", 5],
    bonusTileReveal02: ["BonusTileReveal2", 6],

    prizeBoxReveal01:["PrizeBoxReveal", 8],
    prizeBoxReveal02:["PrizeBoxReveal", 9],
    

    /*
     * Optional audio
     * The following audio is optional and will be ignored if not included
     */

    buy: ["ButtonPlay", 4],
    click: ["PlayAgainButton", 4],
    playAgain: ["PlayAgainButton", 4]
});
