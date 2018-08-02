(async () => {
  const argv = await ezTrigger.argv;
  const audioElement = document.querySelector('.audio_player');

  const waitScreen = document.querySelector('.waiting');
  const restScreen = document.querySelector('.resting');
  const endScreen = document.querySelector('.end');

  const playSound = () => {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play();
  };

  ezNirsTrigger.mk(`RSTINIT`);

  ezTrigger.registerCommand('ST', () => {
    waitScreen.classList.add('hide');
    restScreen.classList.remove('hide');
    playSound();
  });

  ezTrigger.registerCommand('EN', () => {
    restScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    playSound();
  });
})();
