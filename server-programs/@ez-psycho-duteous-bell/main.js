import { w, i, Delay, Repeat } from '~server';
import Player from 'play-sound';
import path from 'path';

const player = Player({ player: "cmdmp3" });

class RestScreen {
  constructor(server, manifest) {
    this.server = server;
    this.logger = server.logger;

    this.fns = [
      {
        name: `Send ST`,
        fn: (() => {
          this.server.broadcast('LK', ['TRG']);
          this.server.broadcast('ST', ['TRG']);
        }).bind(this)
      },
      {
        name: `Send EN`,
        fn: (() => {
          this.server.broadcast('EN', ['TRG']);
          this.server.broadcast('UL', ['TRG']);
        }).bind(this)
      }
    ];
    this.timer = null;

    if (manifest.times && manifest.times.forEach) {
      manifest.times.forEach((time) => {
        this.fns.push({
          name: `Start ${time}`,
          fn: this.StartTimer(time).bind(this)
        });
      });

      this.fns.push({
        name: `Kill Timer`,
        fn: this.killTimer.bind(this)
      });
    } else {
      this.fns.push({
        name: 'No time config',
        fn: this.warning.bind(this)
      })
    }
  }

  playSound() {
    player.play(path.join(__dirname, 'bell.mp3'));
  }

  warning() {
    this.logger.log(w('Add some time in the package.json to make this program works.'));
  }

  StartTimer(time) {
    return () => this.startTimer(time);
  }

  async startTimer(time) {
    this.killTimer(time);

    this.timer = new Repeat((_, count) => {
      if (this.count !== 3) {
        this.logger.log(i(`...${3 - count + 1}`, '1s', 3));
      } else {
        this.logger.log(i(`Ding~`, '1s', 3));
      }
    }, '1s', 4);

    await this.timer.run();

    this.server.broadcast(`MK ST ${time}`, ['TRG']);
    this.playSound();
    this.logger.log(i('Sending start signal to all TRG client.'));

    this.timer = new Delay((
      () => {
        this.server.broadcast(`MK EN ${time}`, ['TRG']);
        this.playSound();
        this.logger.log(i('Sending end signal to all TRG client.'));
        this.timer = null;
      }
    ).bind(this), time);

    await this.timer.run();
  }

  killTimer() {
    if (this.timer && this.timer.kill) {
      this.server.broadcast(`MK KILL`, ['TRG']);
      this.timer.kill();
      this.timer = null;
      this.logger.log(i(`Killed previous timer.`));
    }
  }
}

export default RestScreen;
