import { isNull } from 'util';

import nanoTimer from 'nanotimer';

import { w, i } from '@ez-trigger/server';

class RestScreen {
  constructor(server) {
    this.server = server;
    this.logger = server.logger;
    this.timer = null;
    this.fns = [
      {
        name: 'Start',
        fn: this.start.bind(this)
      },
      {
        name: 'Force stop',
        fn: this.stop.bind(this)
      }
    ];
  }

  start() {
    this.killTimer();

    this.timer = new nanoTimer();

    this.logger.log(i('All RST, TRG client will receive start signal.'));
    this.server.broadcast('ST', 'TRG');
    this.server.broadcast('ST', 'RST');

    this.timer.setTimeout(
      () => {
        this.server.broadcast('EN', 'TRG');
        this.server.broadcast('EN', 'RST');
        this.logger.log(i('Sending end signal to all RST and TRG client.'));
      },
      '',
      '5s'
    );
  }

  stop() {
    this.killTimer();
    this.server.broadcast('EN', 'TRG');
    this.server.broadcast('EN', 'RST');
    this.logger.log(w('Will force stop the RST and TRG.'));
  }

  killTimer() {
    if (!isNull(this.timer)) {
      this.timer.clearTimeout();
    }
  }
}

export default RestScreen;
