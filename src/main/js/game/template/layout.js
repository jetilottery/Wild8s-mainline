"use strict";

define({
    _BASE_APP: {
        children: ["background", "logo", "winUpTo", "infoSymbol", "infoText", "bonusGamesLeft", "bonusText", "gameGrid", "animationLayer", "resultPlaque", "largeResultPlaque"]
    },

    /*
     * BACKGROUND
     */
    background: {
        type: "container",
        children: ["backgroundBaseGame", "backgroundBonusGame", "gameBG"]
    },
    backgroundBaseGame: {
        type: "sprite",
        anchor: 0,
        x: 0,
        y: 0,
        portrait: {
            texture: "backgroundMainGamePortrait"
        },
        landscape: {
            texture: "backgroundMainGameLandscape"
        }
    },
    backgroundBonusGame: {
        type: "sprite",
        anchor: 0,
        alpha: 0,
        x: 0,
        y: 0,
        portrait: {
            texture: "backgroundBonusGamePortrait"
        },
        landscape: {
            texture: "backgroundBonusGameLandscape"
        }
    },
    gameBG: {
        type: "sprite",
        anchor: 0.5,
        landscape: {
            x: 712,
            y: 378,
            scale: 9,
            texture: "gameZoneLandscape"
        },
        portrait: {
            x: 405,
            y: 576,
            scale: 9,
            texture: "gameZonePortrait"
        }
    },

    /*
     * LOGO
     */
    logo: {
        type: "container",
        landscape: {
            x: 227,
            y: 296,
            scale: 1
        },
        portrait: {
            x: 191,
            y: 243,
            scale: 0.8
        },
        children: ["logoAnim", "logoFixed"]
    },
    logoAnim: {
        type: "container",
        visible: false
    },
    logoFixed: {
        type: "sprite",
        anchor: 0.5,
        texture: "Gamelogo",
        scale: 1.09,
        y: -3
    },

    /*
     * WIN UP TO
     */
    winUpTo: {
        type: "container",
        children: ["winUpToIn", "winUpToOut"],
        landscape: {
            x: 613,
            y: 127,
            scale: 1
        },
        portrait: {
            x: 575,
            y: 122,
            scale: 1
        }
    },
    winUpToIn: {
        type: "container",
        children: ["winUpToInLabel", "winUpToInValue"]
    },
    winUpToInLabel: {
        type: "text",
        string: "winUpTo",
        anchor: 0.5,
        style: "winUpToLabel",
        landscape: {
            x: 15,
            y: 18,
            fontSize: 33,
            maxWidth: 320
        },
        portrait: {
            x: 15,
            y: 18,
            fontSize: 33,
            maxWidth: 350
        },
        align: "center"
    },
    winUpToInValue: {
        type: "text",
        string: "",
        anchor: 0.5,
        maxWidth: 400,
        style: "winUpToValue",
        landscape: {
            x: 2,
            y: 65,
            fontSize: 63,
            maxWidth: 290
        },
        portrait: {
            x: 2,
            y: 65,
            fontSize: 63,
            maxWidth: 350
        },
        align: "center"
    },
    winUpToOut: {
        type: "container",
        children: ["winUpToOutLabel", "winUpToOutValue"]
    },
    winUpToOutLabel: {
        type: "text",
        string: "winUpTo",
        anchor: 0.5,
        maxWidth: 400,
        style: "winUpToLabel",
        landscape: {
            x: 15,
            y: 18,
            fontSize: 33,
            maxWidth: 350
        },
        portrait: {
            x: 15,
            y: 18,
            fontSize: 33,
            maxWidth: 350
        },
        align: "center"
    },
    winUpToOutValue: {
        type: "text",
        string: "",
        anchor: 0.5,
        maxWidth: 400,
        style: "winUpToValue",
        landscape: {
            x: 2,
            y: 65,
            fontSize: 63,
            maxWidth: 290
        },
        portrait: {
            x: 2,
            y: 65,
            fontSize: 63,
            maxWidth: 350
        },
        align: "center"
    },

    /*
     * INFO / BONUS TEXT
     */
    infoSymbol: {
        type: "sprite",
        texture: "turnsPanelSymWild8",
        landscape: {
            x: 107,
            y: 522,
            scale: 1.6
        },
        portrait: {
            x: 5,
            y: 1070,
            scale: 1
        }
    },
    infoText: {
        type: "text",
        style: "infoText",
        anchor: 0.5,
        align: "left",
        landscape: {
            x: 500,
            y: 582
        },
        portrait: {
            x: 435,
            y: 1110
        },
        string: "infoText"
    },
    bonusGamesLeft: {
        type: "container",
        style: "bonusGamesLeft",
        landscape: {
            x: 220,
            y: 582,
            scale: 0.5
        },
        portrait: {
            x: 162,
            y: 1130,
            scale: 0.4
        }
    },
    bonusText: {
        type: "text",
        style: "bonusText",
        string: "bonusTextPlural",
        anchor: 0,
        maxWidth: 450,
        landscape: {
            x: 300,
            y: 524
        },
        portrait: {
            x: 225,
            y: 1070
        }
    },

    /*
     * GAME GRID
     */
    gameGrid: {
        type: "container",
        children: ["gridBG", "bonusBox", "prizeBox", "particlesLayer", "playerNumbers"],
        landscape: {
            x: 1076,
            y: 383
        },
        portrait: {
            x: 405,
            y: 735
        }
    },
    gridBG: {
        type: "sprite",
        anchor: 0.5,
        landscape: {
            scale: 0.72
        },
        portrait: {
            scale: 0.9
        },
        texture: "gameGrid"
    },
    bonusBox: {
        type: "container",
        anchor: 0.5,
        landscape: {
            x: -466,
            y: 47,
            scale: 0.9
        },
        portrait: {
            x: 267,
            y: -401,
            scale: 0.9
        }
    },
    prizeBox: {
        type: "container",
        anchor: 0.5,
        landscape: {
            x: -466,
            y: -83,
            scale: 0.9
        },
        portrait: {
            x: 67,
            y: -401,
            scale: 0.9
        }
    },
    playerNumbers: {
        type: "container",
        children: ["symbol0", "symbol1", "symbol2", "symbol3", "symbol4", "symbol5", "symbol6", "symbol7", "symbol8"],
        landscape: {
            x: 0,
            y: 0,
            scale: 0.85
        },
        portrait: {
            x: 0,
            y: 0,
            scale: 1
        }
    },
    symbol0: {
        type: "container",
        x: -244,
        y: -225
    },
    symbol1: {
        type: "container",
        x: 0,
        y: -225
    },
    symbol2: {
        type: "container",
        x: 244,
        y: -225
    },
    symbol3: {
        type: "container",
        x: -244,
        y: 0
    },
    symbol4: {
        type: "container",
        x: 0,
        y: 0
    },
    symbol5: {
        type: "container",
        x: 244,
        y: 0
    },
    symbol6: {
        type: "container",
        x: -244,
        y: 225
    },
    symbol7: {
        type: "container",
        x: 0,
        y: 225
    },
    symbol8: {
        type: "container",
        x: 244,
        y: 225
    },

    /*
     * PARTICLES
     */
    particlesLayer: {
        type: "container",
        landscape: {
            x: 0,
            y: 0,
            scale: 0.9
        },
        portrait: {
            x: 0,
            y: 0,
            scale: 1
        }
    },

    /*
     * ANIMATION
     */
    animationLayer: {
        landscape: {
            x: 720,
            y: 405
        },
        portrait: {
            x: 405,
            y: 614
        },
        type: "sprite",
        anchor: 0.5
    },

    /*
     * RESULT PLAQUE
     */
    resultPlaque: {
        type: "container",
        children: ["resultBG", "resultWinLabel", "resultTotalWinLabel", "resultLoseText", "resultWinText"],
        landscape: {
            x: 1110,
            y: 383,
            scale: 0.8
        },
        portrait: {
            x: 405,
            y: 640,
            scale: 1
        }
    },
    resultBG: {
        type: "sprite",
        texture: "win-TotalWinPopUpBase",
        anchor: 0.5
    },
    resultWinLabel: {
        type: "text",
        style: "resultLabel",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: 0,
            y: -75
        },
        portrait: {
            x: 0,
            y: -75
        },
        maxWidth: 350
    },
    resultTotalWinLabel: {
        type: "text",
        style: "resultLabel",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: 0,
            y: -75
        },
        portrait: {
            x: 0,
            y: -75
        },
        maxWidth: 350
    },
    resultLoseText: {
        type: "text",
        string: "message_nonWin",
        style: "resultLose",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: 0,
            y: 8
        },
        portrait: {
            x: 0,
            y: 8
        }
    },
    resultWinText: {
        type: "text",
        style: "resultWin",
        anchor: 0.5,
        align: "center",
        maxWidth: 300,
        scale: 0.5,
        landscape: {
            x: 0,
            y: 20
        },
        portrait: {
            x: 0,
            y: 20
        }
    },

    /*
     * LARGE WIN PLAQUE
     */
    largeResultPlaque: {
        type: "container",
        children: ["largeResultBG", "largeResultWinTitle", "largeResultWinLabel", "largeResultNonWinLabel", "largeResultWinText"],
        landscape: {
            x: 731,
            y: 332,
            scale: 0.96
        },
        portrait: {
            x: 405,
            y: 640,
            scale: 0.96
        }
    },
    largeResultBG: {
        type: "sprite",
        texture: "largeResultPlaque",
        anchor: 0.5
    },
    largeResultWinTitle: {
        type: "text",
        style: "largeResultTitle",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: -10,
            y: -143
        },
        portrait: {
            x: -10,
            y: -143
        },
        maxWidth: 700
    },
    largeResultWinLabel: {
        type: "text",
        style: "largeResultLabel",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: -13,
            y: -53
        },
        portrait: {
            x: -13,
            y: -33
        },
        maxWidth: 650
    },
    largeResultNonWinLabel: {
        type: "text",
        style: "largeResultLose",
        anchor: 0.5,
        align: "center",
        landscape: {
            x: -13,
            y: -33
        },
        portrait: {
            x: -13,
            y: -33
        },
        maxWidth: 650
    },
    largeResultWinText: {
        type: "text",
        style: "largeResultWin",
        anchor: 0.5,
        align: "center",
        maxWidth: 500,
        landscape: {
            x: -10,
            y: 97
        },
        portrait: {
            x: -10,
            y: 97
        }
    },

    /*
     * How To Play
     */
    howToPlayPages: {
        type: "container",
        children: ["howToPlayPage1"]
    },
    howToPlayOverlay: {
        type: "sprite",
        scale: 10,
        landscape: {
            texture: "landscape_tutorialOverlay"
        },
        portrait: {
            texture: "portrait_tutorialOverlay"
        }
    },
    howToPlayBackground: {
        type: "sprite",
        landscape: {
            x: 720,
            y: 26,
            texture: "howToPlayPanelLandscape"
        },
        portrait: {
            x: 405,
            y: 44,
            texture: "howToPlayPanelPortrait"
        },
        anchor: {
            x: 0.5
        }
    },
    howToPlayClose: {
        type: "button",
        string: "button_ok",
        landscape: {
            x: 720,
            y: 670,
            scale: 0.72
        },
        portrait: {
            x: 405,
            y: 1137,
            scale: 0.8
        },
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed"
        },
        style: {
            enabled: "tutorialOKButtonEnabled",
            over: "tutorialOKButtonEnabled",
            pressed: "tutorialOKButtonEnabled"
        }
    },
    howToPlayPage1: {
        type: "text",
        string: "page1",
        wordWrap: true,
        anchor: 0.5,
        align: "center",
        landscape: {
            style: "howToPlayTextLandscape",
            x: 720,
            y: 455
        },
        portrait: {
            style: "howToPlayTextPortrait",
            x: 405,
            y: 720
        }
    },
    howToPlayPrevious: {
        type: "button",
        landscape: {
            x: 72,
            y: 418,
            scale: 1
        },
        portrait: {
            x: 38,
            y: 678,
            scale: 0.9
        },
        textures: {
            enabled: "tutorialLeftButtonEnabled",
            disabled: "tutorialLeftButtonDisabled",
            over: "tutorialLeftButtonOver",
            pressed: "tutorialLeftButtonPressed"
        }
    },
    howToPlayNext: {
        type: "button",
        landscape: {
            x: 1368,
            y: 418,
            scale: 1
        },
        portrait: {
            x: 776,
            y: 678,
            scale: 0.9
        },
        textures: {
            enabled: "tutorialRightButtonEnabled",
            disabled: "tutorialRightButtonDisabled",
            over: "tutorialRightButtonOver",
            pressed: "tutorialRightButtonPressed"
        }
    },
    howToPlayIndicators: {
        type: "container",
        children: ["howToPlayIndicatorActive", "howToPlayIndicatorInactive"],
        landscape: {
            x: 720,
            y: 610
        },
        portrait: {
            x: 405,
            y: 1053
        }
    },
    audioButtonContainer: {
        type: "container",
        landscape: {
            x: 136,
            y: 671,
            scale: 0.72
        },
        portrait: {
            x: 118,
            y: 1141,
            scale: 0.9
        }
    },
    versionText: {
        type: "text",
        style: "versionText",
        alpha: 0.3,
        landscape: {
            x: 55,
            y: 140,
        },
        portrait: {
            x: 55,
            y: 210,
        }
    },

    /*
     * TicketSelectBarSmall
     */
    ticketSelectBarSmall: {
        type: "container",
        landscape: {
            x: 548,
            y: 708,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 1195,
            scale: 0.9
        },
        children: ["ticketSelectBarBG", "ticketSelectCostValue", "ticketCostDownButtonStatic", "ticketCostUpButtonStatic", "ticketCostDownButton", "ticketCostUpButton", "ticketCostIndicators"]
    },
    ticketSelectBarBG: {
        type: "sprite",
        anchor: 0.5,
        texture: "pricePointBase"
    },
    ticketSelectCostValue: {
        type: "text",
        portrait: {
            y: -10
        },
        landscape: {
            y: -10
        },
        anchor: 0.5,
        style: "ticketSelectCostValue"
    },
    ticketCostDownButton: {
        type: "button",
        portrait: {
            x: -222
        },
        landscape: {
            x: -222
        },
        textures: {
            enabled: "minusButtonEnabled",
            disabled: "minusButtonDisabled",
            over: "minusButtonOver",
            pressed: "minusButtonPressed"
        }
    },
    ticketCostUpButton: {
        type: "button",
        portrait: {
            x: 222
        },
        landscape: {
            x: 222
        },
        textures: {
            enabled: "plusButtonEnabled",
            disabled: "plusButtonDisabled",
            over: "plusButtonOver",
            pressed: "plusButtonPressed"
        }
    },
    ticketCostIndicators: {
        type: "container",
        children: ["ticketCostIndicatorActive", "ticketCostIndicatorInactive"],
        portrait: {
            y: 23
        },
        landscape: {
            y: 23
        }
    },
    ticketCostIndicatorActive: {
        type: "sprite",
        texture: "pricePointIndicatorActive"
    },
    ticketCostIndicatorInactive: {
        type: "sprite",
        texture: "pricePointIndicatorInactive"
    },

    /*
     * Disabled states
     */
    ticketCostDownButtonStatic: {
        type: "sprite",
        anchor: 0.5,
        portrait: {
            x: -222
        },
        landscape: {
            x: -222
        },
        texture: "minusButtonDisabled"
    },
    ticketCostUpButtonStatic: {
        type: "sprite",
        anchor: 0.5,
        portrait: {
            x: 222
        },
        landscape: {
            x: 222
        },
        texture: "plusButtonDisabled"
    },

    /*
     * FOOTER
     */
    footerContainer: {
        type: "container",
        children: ["footerBG", "balanceMeter", "ticketCostMeter", "winMeter", "divider_1_3", "divider_2_3", "divider_1_2"],
        landscape: {
            y: 753
        },
        portrait: {
            y: 1340
        }
    },
    footerBG: {
        type: "sprite",
        landscape: {
            texture: "landscape_footerBar"
        },
        portrait: {
            texture: "portrait_footerBar"
        },
        scale: 10
    },
    balanceMeter: {
        type: "container",
        children: ["balanceLabel", "balanceValue"],
        portrait: {
            x: 133,
            y: 6
        },
        landscape: {
            x: 240,
            y: 30
        }
    },
    balanceLabel: {
        type: "text",
        string: "footer_balance",
        anchor: 0.5,
        portrait: {
            y: 70,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerLabel"
    },
    balanceValue: {
        type: "text",
        anchor: 0.5,
        alpha: 0,
        portrait: {
            y: 32,
            fontSize: 34,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            fontSize: 26,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerValue"
    },
    ticketCostMeter: {
        type: "container",
        children: ["ticketCostLabel", "ticketCostValue"]
    },
    ticketCostLabel: {
        type: "text",
        string: "footer_ticketCost",
        anchor: 0.5,
        portrait: {
            y: 70,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerLabel"
    },
    ticketCostValue: {
        type: "text",
        anchor: 0.5,
        portrait: {
            y: 32,
            //fontSize: 34,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            //fontSize: 26,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerValue"
    },
    winMeter: {
        type: "container",
        children: ["winLabel", "winValue"]
    },
    winLabel: {
        type: "text",
        string: "footer_win",
        anchor: 0.5,
        portrait: {
            y: 70,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerLabel"
    },
    winValue: {
        type: "text",
        anchor: 0.5,
        portrait: {
            y: 32,
            fontSize: 34,
            anchor: {
                x: 0.5
            }
        },
        landscape: {
            y: 0,
            fontSize: 26,
            anchor: {
                x: 0
            }
        },
        maxWidth: 210,
        style: "footerValue"
    },

    /*
     * DIVIDERS
     */
    divider_1_3: {
        type: "sprite",
        portrait: {
            texture: "UIdividePortrait",
            x: 267,
            y: 50
        },
        landscape: {
            texture: "uiDivideLandscape",
            x: 480,
            y: 28
        },
        anchor: 0.5
    },
    divider_2_3: {
        type: "sprite",
        portrait: {
            texture: "UIdividePortrait",
            x: 538,
            y: 50
        },
        landscape: {
            texture: "uiDivideLandscape",
            x: 960,
            y: 28
        },
        anchor: 0.5
    },
    divider_1_2: {
        type: "sprite",
        portrait: {
            texture: "uiDividePortrait",
            x: 405,
            y: 28
        },
        landscape: {
            texture: "uiDivideLandscape",
            x: 720,
            y: 28
        },
        anchor: 0.5
    },

    /*
     * METER POSITION POINTS
     */
    meter_2_3: {
        type: "point",
        portrait: {
            x: 405,
            y: 6
        },
        landscape: {
            x: 720,
            y: 30
        }
    },
    meter_3_3: {
        type: "point",
        portrait: {
            x: 674,
            y: 6
        },
        landscape: {
            x: 1200,
            y: 30
        }
    },
    meter_1_2: {
        type: "point",
        portrait: {
            x: 225,
            y: 6
        },
        landscape: {
            x: 360,
            y: 30
        }
    },
    meter_2_2: {
        type: "point",
        portrait: {
            x: 675,
            y: 6
        },
        landscape: {
            x: 1080,
            y: 30
        }
    },

    /*
     * UI Panel
     */

    /*
     * BUTTON BAR
     */
    buttonBar: {
        type: "container",
        landscape: {
            x: 0,
            y: 660
        },
        portrait: {
            x: 0,
            y: 1241
        },
        children: ["helpButtonStatic", "helpButton", "homeButtonStatic", "homeButton", "exitButton", "playAgainButton", "tryAgainButton", "buyButton", "tryButton", "moveToMoneyButton", "retryButton"]
    },
    helpButton: {
        type: "button",
        landscape: {
            x: 1385,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 755,
            y: 50,
            scale: 0.9
        },
        textures: {
            enabled: "tutorialButtonEnabled",
            disabled: "tutorialButtonDisabled",
            over: "tutorialButtonOver",
            pressed: "tutorialButtonPressed"
        }
    },
    homeButton: {
        type: "button",
        landscape: {
            x: 55,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 55,
            y: 50,
            scale: 0.9
        },
        textures: {
            enabled: "homeButtonEnabled",
            over: "homeButtonOver",
            pressed: "homeButtonPressed",
            disabled: "homeButtonDisabled"
        }
    },
    exitButton: {
        type: "button",
        landscape: {
            x: 720,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 50,
            scale: 0.9
        },
        string: "button_exit",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },
    buyButton: {
        type: "button",
        landscape: {
            x: 720,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 50,
            scale: 0.9
        },
        string: "button_buy",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },
    tryButton: {
        type: "button",
        landscape: {
            x: 720,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 50,
            scale: 0.9
        },
        string: "button_try",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },
    moveToMoneyButton: {
        type: "button",
        landscape: {
            scale: 0.86
        },
        portrait: {
            scale: 0.9
        },
        string: "button_moveToMoney",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },
    playAgainButton: {
        type: "button",
        landscape: {
            x: 918,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 50,
            scale: 0.9
        },
        string: "button_playAgain",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },
    retryButton: {
        type: "button",
        landscape: { x: 720, y: 50 },
        portrait: { x: 405, y: 50 },
        string: "button_retry",
        textures: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        },
        style: {
            enabled: "mainButtonEnabled",
            over: "mainButtonOver",
            pressed: "mainButtonPressed",
            disabled: "mainButtonDisabled"
        }
    },

    /*
     * BUTTON POSITION POINTS
     */
    buy_default: {
        type: "point",
        landscape: {
            x: 720,
            y: 50
        },
        portrait: {
            x: 405,
            y: 50
        }
    },
    try_default: {
        type: "point",
        landscape: {
            x: 869,
            y: 50
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    playForMoney_default: {
        type: "point",
        landscape: {
            x: 571,
            y: 50
        },
        portrait: {
            x: 255,
            y: 50
        }
    },
    buy_multi: {
        type: "point",
        landscape: {
            x: 918,
            y: 50
        },
        portrait: {
            x: 405,
            y: 50
        }
    },
    try_multi: {
        type: "point",
        landscape: {
            x: 918,
            y: 50
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    try_fixed: {
        type: "point",
        landscape: {
            x: 869,
            y: 50
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    playForMoney_multi: {
        type: "point",
        landscape: {
            x: 1188,
            y: 50
        },
        portrait: {
            x: 255,
            y: 50
        }
    },

    /*
     * Disabled states
     */
    helpButtonStatic: {
        type: "sprite",
        anchor: 0.5,
        landscape: {
            x: 1385,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 755,
            y: 50,
            scale: 0.9
        },
        texture: "tutorialButtonDisabled"
    },
    homeButtonStatic: {
        type: "sprite",
        anchor: 0.5,
        landscape: {
            x: 55,
            y: 50,
            scale: 0.86
        },
        portrait: {
            x: 55,
            y: 50,
            scale: 0.9
        },
        texture: "homeButtonDisabled"
    },

    /*
     * AUTO PLAY BUTTON
     */
    autoPlayButton: {
        type: "container",
        children: ["autoPlayStartButton", "autoPlayStopButton"],
        landscape: {
            scale: 0.86
        },
        portrait: {
            scale: 0.9
        }
    },
    autoPlayButton_default: {
        type: "point",
        landscape: {
            x: 720,
            y: 710
        },
        portrait: {
            x: 405,
            y: 1291
        }
    },
    autoPlayButton_multi: {
        type: "point",
        landscape: {
            x: 918,
            y: 710
        },
        portrait: {
            x: 405,
            y: 1291
        }
    },

    /*
     * ERROR PLAQUE
     */
    errorOverlay: {
        type: "sprite",
        landscape: {
            texture: "landscape_tutorialOverlay"
        },
        portrait: {
            texture: "portrait_tutorialOverlay"
        }
    },
    errorBackground: {
        type: "sprite",
        anchor: {
            x: 0.5
        },
        landscape: {
            x: 720,
            y: 26,
            texture: "howToPlayPanelLandscape"
        },
        portrait: {
            x: 405,
            y: 44,
            texture: "howToPlayPanelPortrait"
        }
    },
    errorMessage: {
        type: "text",
        style: "errorMessage",
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            x: 720,
            y: 460,
            wordWrapWidth: 900
        },
        portrait: {
            x: 405,
            y: 580,
            wordWrapWidth: 700
        }
    },
    errorExit: {
        type: "button",
        string: "button_exit",
        landscape: {
            x: 720,
            y: 660,
            scale: 0.86
        },
        portrait: {
            x: 405,
            y: 1125,
            scale: 0.9
        },
        style: {
            enabled: "errorButtonEnabled",
            over: "errorButtonOver",
            pressed: "errorButtonPressed"
        },
        textures: {
            enabled: "timeOutButtonEnabled",
            over: "timeOutButtonOver",
            pressed: "timeOutButtonPressed"
        }
    },
    timeoutExit: {
        type: "button",
        landscape: {
            x: 570,
            y: 660,
            scale: 0.86
        },
        portrait: {
            x: 255,
            y: 775,
            scale: 0.9
        },
        style: {
            enabled: "errorButtonEnabled",
            over: "errorButtonOver",
            pressed: "errorButtonPressed"
        },
        textures: {
            enabled: "timeOutButtonEnabled",
            over: "timeOutButtonOver",
            pressed: "timeOutButtonPressed"
        }
    },
    timeoutContinue: {
        type: "button",
        landscape: {
            x: 870,
            y: 660,
            scale: 0.86
        },
        portrait: {
            x: 555,
            y: 775,
            scale: 0.9
        },
        style: {
            enabled: "errorButtonEnabled",
            over: "errorButtonOver",
            pressed: "errorButtonPressed"
        },
        textures: {
            enabled: "timeOutButtonEnabled",
            over: "timeOutButtonOver",
            pressed: "timeOutButtonPressed"
        }
    }
});
//# sourceMappingURL=layout.js.map