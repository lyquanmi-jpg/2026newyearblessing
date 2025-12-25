// Hub View Controller
class HubView {
  constructor() {
    this.element = document.getElementById('hub-view');
    this.characterList = document.getElementById('character-list');
    this.recentSection = document.getElementById('recent-companions');
    this.recentList = document.getElementById('recent-list');
    this.newYearMenu = document.getElementById('new-year-menu');
    this.newYearBtn = document.getElementById('new-year-btn');
    this.newYearDot = document.getElementById('new-year-dot');
    this.newYearHint = document.getElementById('new-year-hint');
    
    this.bindEvents();
  }

  bindEvents() {
    // 初始绑定footer事件
    this.bindFooterEvents();
    
    // 新年菜单点击事件
    this.newYearBtn.addEventListener('click', () => {
      // 隐藏红点（如果显示的话）
      if (!window.storageEngine.hasShownNewYearDot()) {
        window.storageEngine.markNewYearDotShown();
        this.newYearDot.classList.add('hidden');
      }
      
      // 隐藏提示文字（如果显示的话）
      if (!window.storageEngine.hasShownNewYearHint()) {
        window.storageEngine.markNewYearHintShown();
        this.newYearHint.classList.add('hidden');
      }
      
      window.app.showNewYearBlessing();
    });
  }

  // 显示Hub视图
  show() {
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示Hub视图
    this.element.classList.remove('hidden');
    
    // 渲染角色列表
    this.renderCharacters();
  }

  // 渲染角色列表
  renderCharacters() {
    const characters = window.gameEngine.getCharacters();
    
    // 渲染最近陪伴
    this.renderRecentCompanions(characters);
    
    // 渲染全部朋友
    this.characterList.innerHTML = characters.map(character => `
      <div class="character-card" data-character-id="${character.id}">
        <img src="${character.avatar}" alt="${character.name}" class="character-avatar">
        <h3>${character.name}</h3>
        <p class="character-description">${character.description}</p>
      </div>
    `).join('');

    // 绑定角色卡片点击事件
    this.bindCharacterEvents();

    // 更新footer按钮
    this.updateFooterButtons();
    
    // 更新新年菜单显示状态
    this.updateNewYearMenu();
  }

  // 渲染最近陪伴
  renderRecentCompanions(allCharacters) {
    const recentVisits = window.storageEngine.getRecentVisits();
    
    if (recentVisits.length === 0) {
      this.recentSection.classList.add('hidden');
      return;
    }
    
    this.recentSection.classList.remove('hidden');
    
    // 获取最近访问的角色信息
    const recentCharacters = recentVisits
      .map(visit => allCharacters.find(char => char.id === visit.characterId))
      .filter(char => char); // 过滤掉找不到的角色
    
    this.recentList.innerHTML = recentCharacters.map(character => `
      <div class="recent-item" data-character-id="${character.id}">
        <img src="${character.avatar}" alt="${character.name}" class="recent-avatar">
        <span class="recent-name">${character.name}</span>
      </div>
    `).join('');
  }

  // 绑定角色事件
  bindCharacterEvents() {
    // 全部朋友列表点击事件
    this.characterList.addEventListener('click', (e) => {
      const card = e.target.closest('.character-card');
      if (card) {
        const characterId = card.dataset.characterId;
        this.selectCharacter(characterId);
      }
    });

    // 最近陪伴列表点击事件
    this.recentList.addEventListener('click', (e) => {
      const item = e.target.closest('.recent-item');
      if (item) {
        const characterId = item.dataset.characterId;
        this.selectCharacter(characterId);
      }
    });
  }

  // 更新footer按钮
  updateFooterButtons() {
    const companionedCount = window.storageEngine.getCompanionedCharacterCount();
    const showSummaryBtn = companionedCount >= 3;

    let footerHtml = `
      <button id="cards-btn" class="secondary-btn">查看收集的卡片</button>
      <button id="clear-save-btn" class="danger-btn">清除存档</button>
    `;

    if (showSummaryBtn) {
      footerHtml = `
        <button id="cards-btn" class="secondary-btn">查看收集的卡片</button>
        <button id="summary-btn" class="secondary-btn">陪伴的时光</button>
        <button id="clear-save-btn" class="danger-btn">清除存档</button>
      `;
    }

    document.querySelector('.footer').innerHTML = footerHtml;
    this.bindFooterEvents();
  }

  // 更新新年菜单显示状态
  updateNewYearMenu() {
    const hasCompletedAll = window.storageEngine.hasCompletedAllStories();
    
    if (hasCompletedAll) {
      this.newYearMenu.classList.remove('hidden');
      
      // 检查是否需要显示红点（第一次显示时）
      if (!window.storageEngine.hasShownNewYearDot()) {
        this.newYearDot.classList.remove('hidden');
      } else {
        this.newYearDot.classList.add('hidden');
      }
      
      // 检查是否需要显示提示文字（第一次显示时）
      if (!window.storageEngine.hasShownNewYearHint()) {
        this.newYearHint.classList.remove('hidden');
      } else {
        this.newYearHint.classList.add('hidden');
      }
    } else {
      this.newYearMenu.classList.add('hidden');
    }
  }

  bindFooterEvents() {
    // 查看卡片按钮
    const cardsBtn = document.getElementById('cards-btn');
    if (cardsBtn) {
      cardsBtn.addEventListener('click', () => {
        window.app.showCardsCollection();
      });
    }

    // 陪伴总结按钮
    const summaryBtn = document.getElementById('summary-btn');
    if (summaryBtn) {
      summaryBtn.addEventListener('click', () => {
        window.app.showCompanionshipSummary();
      });
    }

    // 清除存档按钮
    const clearBtn = document.getElementById('clear-save-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有存档数据吗？此操作不可恢复。')) {
          window.storageEngine.clear();
          alert('存档已清除');
          location.reload();
        }
      });
    }
  }

  // 选择角色
  selectCharacter(characterId) {
    try {
      const result = window.gameEngine.startStory(characterId);
      window.app.showScene(result.character, result.event);
    } catch (error) {
      console.error('Failed to start story:', error);
      alert(`无法开始故事：${error.message}`);
    }
  }

  // 隐藏Hub视图
  hide() {
    this.element.classList.add('hidden');
  }
}

// 全局Hub视图实例
window.hubView = new HubView();