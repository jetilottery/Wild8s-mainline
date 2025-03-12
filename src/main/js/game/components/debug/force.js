define((require) => {

    /*
        config path may need to be changed dependent on the games framework.
     */

    const config = require("skbJet/componentManchester/standardIW/gameConfig");
    const mechanics = require("game/components/debug/mechanics");
    const mockPrizeTable = require("game/components/debug/mockPrizeTable");
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");

    let div = undefined;
    let mechanic = Object.values(mechanics)[0];
    let configButton;
    let exportButton;
    let dataButton;
    let mechanicList;
    let gameData;

    let configDiv;
    let gameDataDiv;
    let configObjects = [];
    let dataObjects = [];

    let gameID = " ";

    function show() {
        if(!config.debug) {
            return;
        }
        div = document.createElement("div");
        div.setAttribute("id", "forceDebugger");

        let label = document.createElement("h3");
        label.textContent = "Mechanic: ";
        label.style.color = "white";
        label.style.display = "contents";

        mechanicList = document.createElement("select");

        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.height = "20px";
        div.style.width = window.innerWidth + "px";
        div.style.backgroundColor = "red";

        configButton = document.createElement("button");
        configButton.innerText = "Config";

        configButton = document.createElement("button");
        configButton.innerText = "Config";

        dataButton = document.createElement("button");
        dataButton.innerText = "Game Data";

        exportButton = document.createElement("button");
        exportButton.innerText = "Export Config";

        let gameIDValue = document.createElement("h3");
        gameIDValue.textContent = gameID;
        gameIDValue.style.color = "white";
        gameIDValue.style.display = "contents";

        Object.keys(mechanics).forEach(e => {
            mechanicList.appendChild(new Option(e, mechanics[e]));
        });

        document.body.appendChild(div);
        div.appendChild(label);
        div.appendChild(mechanicList);
        div.appendChild(configButton);
        div.appendChild(exportButton);
        div.appendChild(dataButton);
        div.appendChild(gameIDValue);

        dataButton.disabled = gameData !== undefined ? false : true;

        mechanicList.addEventListener("change", e => {
            mechanic = e.currentTarget.value;
            config.mockData = mechanic != "";
        });

        configButton.addEventListener("click", () => {
            showconfig();
        });

        exportButton.addEventListener("click",() => {
            exportConfig();
        });

        dataButton.addEventListener("click",()=>{
            showGameData();
        });
    }

    function exportConfig() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function showconfig() {
        if (configDiv === undefined) {
            configDiv = document.createElement("div");
            configDiv.style.backgroundColor = "red";
            div.appendChild(configDiv);

            Object.keys(config).forEach(e => {
                let configObject;
                let label = document.createElement("h5");
                label.style.color = "white";
                label.style.display = "contents";

                label.textContent = " :" + e;

                let table = document.createElement("table");
                table.style.float = "left";
                table.style.width = String(window.innerWidth / 3) + "px";
                table.style.margin = "0px";
                table.style.backgroundColor = "red";
    
                let row = document.createElement("tr");
                let labelCol = document.createElement("td");
                labelCol.style.textAlign = "left";
                let valueCol = document.createElement("td");
                valueCol.style.textAlign = "right";

                if (typeof config[e] === "number") {

                    configObject = document.createElement("input");
                    configObject.style.fontSize = "10px";
                    configObject.style.width = "100px";
                    configObject.setAttribute("type", "number");
                    configObject.value = Number(config[e]);

                }
                if (typeof config[e] === "boolean") {
                    configObject = document.createElement("select");
                    configObject.style.fontSize = "10px";
                    configObject.appendChild(new Option("true", true));
                    configObject.appendChild(new Option("false", false));
                    configObject.value = config[e];
                }
                labelCol.appendChild(label);
                valueCol.appendChild(configObject);

                configObject.addEventListener("change", t => {
                    config[e] = t.currentTarget.value;
                    if (!isNaN(parseFloat(t.currentTarget.value))) {
                        config[e] = parseFloat(t.currentTarget.value);
                    } else if (
                        JSON.parse(t.currentTarget.value) === true ||
                        JSON.parse(t.currentTarget.value) === false
                    ) {
                        config[e] = JSON.parse(t.currentTarget.value);
                    }
                });


                row.appendChild(labelCol);
                row.appendChild(valueCol);

                table.appendChild(row);
                configObjects.push(configObject);

                configDiv.appendChild(table);
            });
        } else {
            configObjects.forEach(e => {
                e.removeEventListener("change", () => {
                });
            });
            configObjects = [];
            div.removeChild(configDiv);
            configDiv = undefined;
        }
    }

    function showGameData() {
        if (gameDataDiv === undefined) {
            gameDataDiv = document.createElement("div");
            let gameDataTable = document.createElement("table");
            gameDataDiv.style.backgroundColor = "red";

            div.appendChild(gameDataDiv);

            if(gameData !== undefined) {
                Object.keys(gameData).forEach(e => {
                    let label = document.createElement("h3");
                    label.style.color = "white";
                    label.style.display = "contents";

                    label.textContent = e + ": ";

                    let row = document.createElement("tr");
                    let labelCol = document.createElement("td");
                    let valueCol = document.createElement("td");

                    if (typeof gameData[e] === "number") {
                        valueCol.innerText = Number(gameData[e]);
                    }

                    if (typeof gameData[e] === "string") {
                        valueCol.innerText = String(gameData[e]);

                    }

                    valueCol.style.color = "white";
                    valueCol.style.display = "contents";


                    if(gameData[e] !== undefined){
                        labelCol.appendChild(label);

                        row.appendChild(labelCol);
                        row.appendChild(valueCol);
                    }

                    gameDataTable.appendChild(row);
                });
                gameDataDiv.appendChild(gameDataTable);
            }
        } else {
            if(dataObjects !== undefined) {
                dataObjects = [];
            }
            div.removeChild(gameDataDiv);
            gameDataDiv = undefined;
        }
    }

    function hide() {
        if (div !== undefined) {
            if (configDiv !== undefined) {
                showconfig();
            }
            document.body.removeChild(div);
            configButton.removeEventListener("click", () => {
            });
            mechanicList.removeEventListener("change", () => {
            });
            div = undefined;
        }
    }

    function getTicketData(data){
        gameData = data;
        gameID = "";// LAST TICKET ID: " + window.gtk.jLottery.currentWager.externalTransactionId.split("-")[4]; //this only works on jlottery
        hide();
    }

    msgBus.subscribe("jLottery.startUserInteraction",getTicketData);
    msgBus.subscribe("jLottery.reStartUserInteraction",getTicketData);

    msgBus.subscribe("jLotteryGame.assetsLoadedAndGameReady",show);
    msgBus.subscribe("jLotteryGame.ticketResultHasBeenSeen",show);

    return {
        get mechanic() {
            return mechanic;
        },
        get mockPrizeTable() {
            return mockPrizeTable;
        }
    };

});