import { i } from '~server';

class VividVideoPlayer {
  constructor(server) {
    this.server = server;
    this.logger = server.logger;
    this.fns = [
      {
        name: 'Start',
        fn: this.start.bind(this)
      },
      {
        name: 'Pause video',
        fn: this.pause.bind(this)
      }
    ];

    this.server.registerDebugCommand(['PS']);
  }

  start() {
    this.server.broadcast('ST', 'TRG');
    this.server.broadcast('ST', 'VP');

    this.logger.log(i('All VP, TRG client will receive start signal.'));
  }

  pause() {
    this.server.broadcast('PS', 'TRG');
    this.server.broadcast('PS', 'VP');

    this.logger.log(i('All VP, TRG client will receive pause signal.'));
  }
}

export default VividVideoPlayer; 
