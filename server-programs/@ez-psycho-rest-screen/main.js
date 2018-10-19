import { w, i, Delay } from '~server';

class RestScreen {
  constructor(server) {
    this.server = server;
    this.logger = server.logger;

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

    this.endSender = new Delay(this.sendEnd.bind(this), '5s');
  }

  sendEnd() {
    this.server.broadcast('EN', 'TRG');
    this.server.broadcast('EN', 'RST');
    this.logger.log(i('Sending end signal to all RST and TRG client.'));
  }

  start() {
    this.endSender.kill();

    this.logger.log(i('All RST, TRG client will receive start signal.'));
    this.server.broadcast('ST', 'TRG');
    this.server.broadcast('ST', 'RST');

    this.endSender.run();
  }

  stop() {
    this.endSender.kill();
    this.server.broadcast('EN', 'TRG');
    this.server.broadcast('EN', 'RST');
    this.logger.log(w('Will force stop the RST and TRG.'));
  }
}

export default RestScreen;
