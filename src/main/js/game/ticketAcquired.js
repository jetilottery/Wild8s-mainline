define((require) => {
  const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
  const audio = require("skbJet/componentManchester/standardIW/audio");
  const audioPlayer = require("skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer");

  async function ticketAcquired() {    

    if(!audio.isPlaying("music")) {
      audio.play("music", true, 1.0);
      // This seems to fix the audio stopping at end of first loop
      audioPlayer.pauseChannel(0);
      audioPlayer.resumeChannel(0);
      ///
    }

    gameFlow.next("START_TURN");
  }

  gameFlow.handle(ticketAcquired, "TICKET_ACQUIRED");
});
