// Main Application Controller
class App {
  constructor() {
    this.isInitialized = false;
    this.isReady = false;
    this.currentView = null;
    
    // DOM元素
    this.loadingElement = document.getElementById('loading');
    this.errorElement = document.getElementById('error');
    this.errorMessage = document.getElementById('error-message');
  }

  // 初始化应用
  async initialize() {
    try {
      this.showLoading();
      
      // 清理视图状态，但不立即显示Hub
      window.storageEngine.clearViewState();
      
      // 初始化游戏引擎
      await window.gameEngine.initialize();
      
      // 预加载图片资源
      const characters = window.gameEngine.getCharacters();
      await window.contentLoader.preloadImages(characters);
      
      this.isInitialized = true;
      this.hideLoading();
      
      // 初始化完成后强制进入Hub（只执行一次）
      this.showHub();
      this.isReady = true;
      
      console.log('App initialization completed - ready for user interaction');
      
    } catch (error) {
      console.error('App initialization failed:', error);
      this.showError(error.message);
    }
  }

  // 显示加载界面
  showLoading() {
    this.hideAllViews();
    this.loadingElement.classList.remove('hidden');
  }

  // 隐藏加载界面
  hideLoading() {
    this.loadingElement.classList.add('hidden');
  }

  // 显示错误界面
  showError(message) {
    this.hideAllViews();
    this.errorMessage.innerHTML = window.contentValidator.getErrorsHTML() || `<p>${message}</p>`;
    this.errorElement.classList.remove('hidden');
  }

  // 隐藏所有视图
  hideAllViews() {
    document.querySelectorAll('.view, .loading, .error').forEach(element => {
      element.classList.add('hidden');
    });
  }

  // 显示Hub视图
  showHub() {
    if (!this.isInitialized) {
      console.log('App not ready - Hub display deferred');
      return;
    }
    
    this.currentView = 'hub';
    window.gameEngine.reset();
    
    // 检查是否应该触发领悟时刻
    RealizationMoment.checkAndTrigger().then(() => {
      window.hubView.show();
    });
  }

  // 显示场景视图
  showScene(character, event) {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return;
    }
    
    this.currentView = 'scene';
    window.sceneView.show(character, event);
  }

  // 显示卡片视图
  showCard(character, endingNote) {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return;
    }
    
    this.currentView = 'card';
    window.cardView.show(character, endingNote);
  }

  // 显示卡片收藏
  showCardsCollection() {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return;
    }
    
    this.currentView = 'collection';
    window.cardView.showCollection();
  }

  // 显示陪伴总结
  showCompanionshipSummary() {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return;
    }
    
    this.currentView = 'companionship-summary';
    window.companionshipSummaryView.show();
  }

  // 显示领悟时刻（内部方法，不直接调用）
  showRealizationMoment() {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return Promise.resolve();
    }
    
    this.currentView = 'realization-moment';
    return window.realizationMoment.show();
  }

  // 显示新年祝福页面
  showNewYearBlessing() {
    if (!this.isInitialized) {
      console.error('App not initialized');
      return;
    }
    
    this.currentView = 'new-year-blessing';
    window.newYearBlessingView.show();
  }

  // 处理浏览器后退按钮
  handleBackButton() {
    switch (this.currentView) {
      case 'scene':
      case 'card':
      case 'collection':
      case 'companionship-summary':
      case 'new-year-blessing':
        this.showHub();
        break;
      default:
        // 在Hub视图时，不做任何操作
        break;
    }
  }
}

// 全局应用实例
window.app = new App();

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.app.initialize();
});

// 处理浏览器后退按钮
window.addEventListener('popstate', () => {
  window.app.handleBackButton();
});

// 处理页面可见性变化（仅保存数据，不做UI跳转）
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时仅保存数据
    console.log('Page hidden, preserving data...');
  } else {
    // 页面显示时仅记录，不做UI操作
    console.log('Page visible, data preserved...');
    if (window.app && window.app.isReady) {
      // 仅清理视图状态，不强制跳转
      if (window.storageEngine) {
        window.storageEngine.clearViewState();
      }
    }
  }
});

// 处理页面显示事件（仅在必要时清理状态）
window.addEventListener('pageshow', (event) => {
  if (window.app && window.app.isReady) {
    console.log('Page show - app ready, clearing view state only');
    // 仅清理视图状态，不强制UI跳转
    if (window.storageEngine) {
      window.storageEngine.clearViewState();
    }
  } else {
    console.log('Page show - app not ready, no action taken');
  }
});

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (window.app && !window.app.isInitialized) {
    window.app.showError(`应用程序错误：${event.error.message}`);
  }
});

// 处理未捕获的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (window.app && !window.app.isInitialized) {
    window.app.showError(`加载错误：${event.reason.message || event.reason}`);
  }
  
  // 防止默认的控制台错误输出
  event.preventDefault();
});