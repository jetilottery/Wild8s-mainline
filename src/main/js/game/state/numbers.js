define(require => {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

  const _state = {
    winning: [],
    player: [],
    state: "PURCHASE",
    nextState: undefined,
    bonusGamesLeft: 0
  };

  function reset() {
    _state.winning = [];
    _state.player = [];
    _state.state = "PURCHASE";
    _state.nextState = "BASEGAME";
    _state.bonusGamesLeft = 0;
    _state.logoAnimPlaying = false;
  }

  msgBus.subscribe("animation.play", data => {
    if(data.index === "animLogo") {
      _state.logoAnimPlaying = true;
    }
  });
  msgBus.subscribe("animation.end", data => {
    if(data.index === "animLogo") {
      _state.logoAnimPlaying = false;
    }
  });
  
  msgBus.subscribe('Game.WinningNumber', number => _state.winning.push(number));
  msgBus.subscribe('Game.PlayerNumber', number => _state.player.push(number));

  return {
    get winning() {
      return _state.winning;
    },
    get player() {
      return _state.player;
    },
    get state() {
      return _state.state;
    },
    set state(s) {
      _state.state = s;
    },
    get nextState() {
      return _state.nextState;
    },
    set nextState(s) {
      _state.nextState = s;
    },
    get logoAnimPlaying() {
      return _state.logoAnimPlaying;
    },
    reset,
  };
});
