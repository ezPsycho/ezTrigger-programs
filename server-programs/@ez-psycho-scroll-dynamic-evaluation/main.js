import { isNull } from 'util';

import nanoTimer from 'nanotimer';

import { w, i } from '@ez-trigger/server';

class DynamicEvaluation {
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

    this.server.registerDebugCommand(['DING']);
  }

  start() {
    let dingCount;
    
    this.killTimer();
    this.timer = new nanoTimer();

    dingCount = 0;

    this.server.broadcast('ST', 'TRG');
    this.server.broadcast('ST', 'DYE');

    this.logger.log(i('All DYE, TRG client will receive start signal.'));

    this.timer.setInterval(
      () => {
        dingCount++;

        if (dingCount < 6) {
          this.server.broadcast('DING', 'TRG');
          this.server.broadcast('DING', 'DYE');
          this.logger.log(i(`Ding ${dingCount}.`));
        } else {
          this.timer.clearInterval();
          this.server.broadcast('EN', 'TRG');
          this.server.broadcast('EN', 'DYE');
          this.logger.log(i(`Finished the dynamic scroll experiment, will send EN to all DYE and TRG client.`)); // prettier-ignore
        }
      },
      '',
      '2s'
    );
  }

  stop() {
    this.killTimer();
    this.server.broadcast('EN', 'TRG');
    this.server.broadcast('EN', 'DYE');
    this.logger.log(w('Sending end signal to all DYE and TRG client.'));
  }

  killTimer() {
    if (!isNull(this.timer)) {
      this.timer.clearTimeout();
    }
  }
}

export default DynamicEvaluation;