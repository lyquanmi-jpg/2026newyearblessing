// New Year Blessing View Controller
class NewYearBlessingView {
  constructor() {
    this.element = document.getElementById('new-year-blessing');
    this.backBtn = document.getElementById('blessing-back-btn');
    this.backToStoriesBtn = document.getElementById('back-to-stories-btn');
    
    this.bindEvents();
  }

  bindEvents() {
    // 返回按钮
    this.backBtn.addEventListener('click', () => {
      window.app.showHub();
    });

    // 回到故事里按钮
    this.backToStoriesBtn.addEventListener('click', () => {
      window.app.showHub();
    });
  }

  // 显示新年祝福页面
  show() {
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示新年祝福页面
    this.element.classList.remove('hidden');
  }

  // 隐藏新年祝福页面
  hide() {
    this.element.classList.add('hidden');
  }
}

// 全局新年祝福视图实例
window.newYearBlessingView = new NewYearBlessingView();