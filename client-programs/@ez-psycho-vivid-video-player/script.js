(async () => {
  const videoElement = document.querySelector('.main_video_player');
  const sourceElement = document.createElement('source');

  const argv = await ezTrigger.argv;
  const file = argv[0];

  const configRequest = await fetch('prog://config.json');
  const config = await configRequest.json();

  if (config.control) {
    videoElement.setAttribute('controls', 'controls');
  }

  ezNirsTrigger.mk(`VPINIT ${file}`);
  ezNirsTrigger.mk(`PLAYING ${file}`);

  ezNirsTrigger.start();

  sourceElement.setAttribute('src', `prog://videos/${file}`);
  videoElement.appendChild(sourceElement);

  videoElement.load();

  ezTrigger.registerCommand('ST', () => {
    videoElement.play();
  });

  ezTrigger.registerCommand('PS', () => {
    videoElement.pause();
  });

  videoElement.addEventListener('timeupdate', () => {
    ezNirsTrigger.mk(videoElement.currentTime);
  });

  videoElement.addEventListener('play', () => {
    ezNirsTrigger.mk(`VPST`);
  });

  videoElement.addEventListener('ended', () => {
    ezNirsTrigger.mk(`VPEN`);
    ezNirsTrigger.stop();
    ezNirsTrigger.export(`${file}-${ezTrigger.getDateTime()}`);
  });

  videoElement.addEventListener('pause', () => {
    ezNirsTrigger.mk(`PAUSE`);
  });

  videoElement.addEventListener('seeked', () => {
    ezNirsTrigger.mk(`SEEKED`);
  });
})();
