import { w, i, Repeat } from '~server';

class DynamicEvaluation {
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

    this.dingSender = new Repeat(this.ding.bind(this), '2s', 6);

    this.server.registerDebugCommand(['DING']);
  }

  ding() {
    this.server.broadcast('DING', ['TRG', 'DYE']);

    this.logger.log(i(`Ding ${this.dingSender.count}.`));
  }

  async start() {
    this.server.broadcast('ST', ['TRG', 'DYE']);
    this.logger.log(i('All DYE, TRG client will receive start signal.'));

    await this.dingSender.run();

    this.server.broadcast('EN', ['TRG', 'DYE']);
    this.logger.log(i(`Finished the dynamic scroll experiment, will send EN to all DYE and TRG client.`)); // prettier-ignore
  }

  stop() {
    this.dingSender.kill();
    this.server.broadcast('EN', ['TRG', 'DYE']);
    this.logger.log(w('Sending end signal to all DYE and TRG client.'));
  }
}

export default DynamicEvaluation;