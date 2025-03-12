define({
  /* 
   * Game configuration options
   * Anything defined here could be overwritten either based on the channel in
   * assetPacks/CHANNEL/layout/gameConfig.js or at an operator level by gameConfig.json in i18n
   */
  //System
  mockData: false,
  debug: false,
  transition_delayFrames: 10,
  transition_spamDelay: 0.6,
  pollInterval: 0.2,
  pollTimeout: 7,
  mouseOverTime: 0.3,
  mouseOverScale: 1.2,
  fastFadeButtons: true,
  consoleEnabledDuringPlay: true,


  //game flow
  secondsDelayB4ResultScreen: 1,
  compulsionDelayInSeconds: 0.1,
  showHowToPlayOnLoad: true,
  bypassPlayAgain: true,
  ticketCostMeterVisibleWhilePlaying: true,
  animateWildSymbol: false,
  animateLogo: false,
  showLargeResultPlaque: false,
  showNonWinResultPlaque: true,

  //auto play
  toggleAutoPlay: false,
  autoPlayBoxSymbolInterval: 1.6,
  autoPlayTime: 3,
  autoPlayGameInterval: 1,
  autoRevealPrizeBoxes: true,
  autoRevealEnabled: false,

  //Prize/Multiplier Box
  prizeBoxRevealTime: 1,
  prizeBoxResetTime: 1,
  prizeBoxAutoRevealDelay: 3,

  //Symbols
  symbolValuePulseTime: 0.25,
  symbolValuePulseScale: 1.1,
  symbolResetTime: 0.5,

  //wild 8
  sunburstFadeInTime: 0.5,
  sunburstRotateTime: 2.2,
  sunburstFadeOutTime: 0.1,
  wild8sAnimFadeInTime: 0.5,
  wild8ValueFadeOutTime: 0.1,

  //normal 8
  winHighlightFadeInTime: 0.5,
  winFlareDuration: 2,
  winFlareFadeOutTime: 0.1,
  winFlareFadeInTime: 0.5,
  winParticlesDelay: 1,

  //Bonus transition
  transitionParticles: 100,
  transitionInterval: 0.1,
  baseGameFadeInTime: 1,
  baseGameFadeInDelay: 1,
  baseGameFadeOutTime: 1,
  bonusGameFadeInTime: 1,
  bonusGameFadeInDelay: 1,
  bonusGameFadeOutTime: 1,
  bonusGameLastPulseTime: 0.5,

  //Result
  resultPlaqueDelay: 0.1,
  resultPlaqueFadeInTime: 0.5,
  resultPlaqueDuration: 4,
  resultPlaqueFadeOutTime: 0.5,
  resultMusicFadeOutDuration: 0.5,
  resultTerminatorFadeInDelay: 0,
  resultTerminatorFadeInDuration: 0.5,

  //Large Result/Congratulations
  largeResultPlaqueDelay: 0,
  largeResultPlaqueFadeInTime: 0.5,
  largeResultPlaqueDuration: 4,
  largeResultPlaqueFadeOutTime: 0.5,

  //idle
  idleInterval: 0,
  idleIntervalVariation: 0,

  //attract
  attractInterval: 4
});
