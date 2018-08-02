(async () => {
  const argv = await ezTrigger.argv;
  const audioElement = document.querySelector('.audio_player');

  const waitScreen = document.querySelector('.waiting');
  const scaleScreen = document.querySelector('.scale');
  const endScreen = document.querySelector('.end');

  const negativeText = document.querySelector('.negative_text');
  const positiveText = document.querySelector('.positive_text');
  const negativeRuler = document.querySelector('.negative_side');
  const positiveRuler = document.querySelector('.positive_side');

  const configRequest = await fetch('prog://config.json');
  const config = await configRequest.json();

  let allowScroll;
  allowScroll = false;

  document.body.classList.add(config.direction === 'horizontal' ? 'h' : 'v');

  const cellTemplate = i => `
  <div class="ruler_cell">
    <img src="prog://pointer.svg" class="pointer" data-scale="${i}"/>
  </div>
  `;

  document.body.style.setProperty('--ruler-border', `${config.rulerBorder}px`);

  negativeText.textContent = config.negativeText;
  positiveText.textContent = config.positiveText;

  const positiveRulerScaleHTML = [];
  const negativeRulerScaleHTML = [];

  for (i = 1; i <= config.scales; i++) {
    positiveRulerScaleHTML.push(cellTemplate(i));
    negativeRulerScaleHTML.push(cellTemplate(i - config.scales - 1));
  }

  negativeRuler.innerHTML = negativeRulerScaleHTML.join('');
  positiveRuler.innerHTML = positiveRulerScaleHTML.join('');

  const pointers = document.querySelectorAll('.pointer');
  const pointerIndex = {};
  
  pointers.forEach(pointer => {
    pointerIndex[pointer.attributes['data-scale'].value] = pointer;
  });

  const refreshCursor = direction => {
    const cursorMoveStep = direction > 0 ? -1 : 1;

    if(cursorMoveStep === -1 & currentCursor <= -config.scales) return false;
    if(cursorMoveStep === 1 & currentCursor >= config.scales) return false;

    pointerIndex[currentCursor.toString()].classList.remove('current');
    currentCursor += cursorMoveStep;
    pointerIndex[currentCursor.toString()].classList.add('current');
    ezTrigger.addRecord({position: currentCursor});
  }

  const playSound = () => {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play();
  };

  ezTrigger.registerCommand('ST', () => {
    allowScroll = true;
    waitScreen.classList.add('hide');
    scaleScreen.classList.remove('hide');
    playSound();
  });

  ezTrigger.registerCommand('EN', () => {
    playSound();
    allowScroll = false;
    scaleScreen.classList.add('hide');
    endScreen.classList.remove('hide');
    ezTrigger.exportRecord(ezTrigger.getDateTime());
  });

  ezTrigger.registerCommand('DING', () => {
    playSound();
  });

  document.addEventListener('wheel', event => {
    if (!allowScroll) return false;
    refreshCursor(event.deltaY);
  });

  ezNirsTrigger.mk(`DYEINIT`);

  let currentCursor = 0;
})();
