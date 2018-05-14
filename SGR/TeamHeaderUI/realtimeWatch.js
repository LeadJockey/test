import $ from 'jquery';

function RealTimeWatch(gameStartsAt, callback) {
  this.gameStartsAt = RealTimeWatch.parse(gameStartsAt).getTime();
  this.serverTime = RealTimeWatch.getClientTime();
  this.callback = callback;
  this.diff = this.toRemainingTimeArr();
  this.timer = -1;
}

// Static Methods
$.extend(RealTimeWatch, {
  getClientTime() {
    return RealTimeWatch.parse(window.ServerTime);
  },

  parse(yyyyMMddHHmmss) {
    const y = yyyyMMddHHmmss.slice(0, 4);
    const mIdx = Number(yyyyMMddHHmmss.slice(4, 6)) - 1;
    const d = yyyyMMddHHmmss.slice(6, 8);
    const h = yyyyMMddHHmmss.slice(8, 10);
    const m = yyyyMMddHHmmss.slice(10, 12);
    const s = yyyyMMddHHmmss.slice(12);
    return new Date(y, mIdx, d, h, m, s);
  },
  addZero(num) {
    return '' + (num < 10 ? '0' + num : num);
  },
  getYMDLongArray(ms) {
    const d = new Date(ms);
    return [d.getFullYear(), d.getMonth() + 1, d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()];
  },
  toYMDLongString(ms) {
    return RealTimeWatch.getYMDLongArray(ms).map(RealTimeWatch.addZero).join('');
  },
  toYMDShortString(ms) {
    return RealTimeWatch.getYMDLongArray(ms).slice(0, 3).map(RealTimeWatch.addZero).join('');
  }
});

RealTimeWatch.prototype = {
  updateServerTime() {
    this.serverTime.setSeconds(this.serverTime.getSeconds() + 1);
  },

  getDiff() {
    return this.gameStartsAt - this.serverTime.getTime();
  },

  toRemainingTimeArr() {
    const min = 1000 * 60 * 60;
    const sec = 1000 * 60;
    const diff = this.getDiff();

    const h = (diff % (min * 24)) / min;
    const m = (diff % min) / sec;
    const s = (diff % sec) / 1000;

    return [h, m, s].map(Math.floor);
  },

  stop() {
    clearInterval(this.timer);
    this.timer = -1;
  },

  start() {
    if (this.timer > -1) {
      return;
    }
    this.timer = setInterval(() => {
      this.onTick();
    }, 1000);
  },

  onTick() {
    this.updateServerTime();
    this.diff = this.toRemainingTimeArr();
    this.callback(this.diff);
  }
};

export default RealTimeWatch;