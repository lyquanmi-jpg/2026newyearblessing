// Realization Moment Controller - One-time emotional pause
class RealizationMoment {
  constructor() {
    this.element = document.getElementById('realization-moment');
    this.isShowing = false;
  }

  // 显示领悟时刻
  show() {
    if (this.isShowing) {
      return Promise.resolve();
    }

    this.isShowing = true;

    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });

    // 显示领悟时刻
    this.element.classList.remove('hidden');
    this.element.classList.add('realization-fade-in');

    // 标记已显示
    window.storageEngine.markRealizationMomentShown();

    // 2秒后自动淡出并进入Hub
    return new Promise((resolve) => {
      setTimeout(() => {
        this.hide().then(resolve);
      }, 2000);
    });
  }

  // 隐藏领悟时刻
  hide() {
    if (!this.isShowing) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.element.classList.remove('realization-fade-in');
      this.element.classList.add('realization-fade-out');

      setTimeout(() => {
        this.element.classList.add('hidden');
        this.element.classList.remove('realization-fade-out');
        this.isShowing = false;
        resolve();
      }, 600); // 匹配CSS动画时长
    });
  }

  // 检查并可能触发领悟时刻
  static checkAndTrigger() {
    if (window.storageEngine.shouldTriggerRealizationMoment()) {
      return window.realizationMoment.show();
    }
    return Promise.resolve();
  }
}

// 全局领悟时刻实例
window.realizationMoment = new RealizationMoment();