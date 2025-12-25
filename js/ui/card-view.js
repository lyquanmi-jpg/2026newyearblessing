// Card View Controller
class CardView {
  constructor() {
    this.element = document.getElementById('card-view');
    this.cardAvatar = document.getElementById('card-avatar');
    this.cardCharacterName = document.getElementById('card-character-name');
    this.cardEndingNote = document.getElementById('card-ending-note');
    this.collectCardBtn = document.getElementById('collect-card-btn');
    this.cardBackBtn = document.getElementById('card-back-btn');
    
    // 卡片收藏视图
    this.cardsCollection = document.getElementById('cards-collection');
    this.collectionBackBtn = document.getElementById('collection-back-btn');
    this.collectedCards = document.getElementById('collected-cards');
    
    this.currentCharacter = null;
    this.currentEndingNote = null;
    this.isCardCollected = false;
    
    this.bindEvents();
  }

  bindEvents() {
    // 收下卡片按钮
    this.collectCardBtn.addEventListener('click', () => {
      this.collectCard();
    });

    // 返回按钮
    this.cardBackBtn.addEventListener('click', () => {
      window.app.showHub();
    });

    // 收藏页面返回按钮
    this.collectionBackBtn.addEventListener('click', () => {
      window.app.showHub();
    });
  }

  // 显示卡片视图
  show(character, endingNote) {
    this.currentCharacter = character;
    this.currentEndingNote = endingNote;
    
    // 检查是否已经收集过这张卡片
    const cards = window.storageEngine.getCards();
    this.isCardCollected = cards.some(card => 
      card.characterId === character.id && card.endingNote === endingNote
    );
    
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示卡片视图
    this.element.classList.remove('hidden');
    
    // 渲染卡片
    this.renderCard();
  }

  // 渲染卡片
  renderCard() {
    // 设置卡片内容
    this.cardAvatar.src = this.currentCharacter.avatar;
    this.cardAvatar.alt = this.currentCharacter.name;
    this.cardCharacterName.textContent = this.currentCharacter.name;
    this.cardEndingNote.textContent = this.currentEndingNote;
    
    // 获取该角色的双选择陪伴方式
    const dualCompanionship = window.storageEngine.getDualCompanionship(this.currentCharacter.id);
    
    // 添加陪伴方式显示
    let companionshipHtml = '';
    if (dualCompanionship) {
      companionshipHtml = `
        <div class="companionship-info">
          <p>你当时选择了：①「${dualCompanionship.choice1}」</p>
          <p>你还留下一句：②「${dualCompanionship.choice2}」</p>
        </div>
      `;
    }
    
    // 更新卡片内容区域
    const cardContent = document.querySelector('.card-content');
    cardContent.innerHTML = `
      <p id="card-ending-note">${this.currentEndingNote}</p>
      ${companionshipHtml}
    `;
    
    // 更新按钮状态
    if (this.isCardCollected) {
      this.collectCardBtn.textContent = '已收藏';
      this.collectCardBtn.disabled = true;
      this.collectCardBtn.classList.add('secondary-btn');
      this.collectCardBtn.classList.remove('primary-btn');
    } else {
      this.collectCardBtn.textContent = '收下这张卡片';
      this.collectCardBtn.disabled = false;
      this.collectCardBtn.classList.add('primary-btn');
      this.collectCardBtn.classList.remove('secondary-btn');
    }
  }

  // 收集卡片
  collectCard() {
    if (this.isCardCollected) {
      return;
    }

    try {
      window.storageEngine.addCard(
        this.currentCharacter.id,
        this.currentCharacter.name,
        this.currentEndingNote
      );
      
      // 记录故事完成
      window.storageEngine.recordStoryCompletion(this.currentCharacter.id);
      
      this.isCardCollected = true;
      this.renderCard();
      
      // 显示收集成功提示
      this.showCollectionSuccess();
    } catch (error) {
      console.error('Failed to collect card:', error);
      alert('收集卡片失败，请重试');
    }
  }

  // 显示收集成功提示
  showCollectionSuccess() {
    // 创建临时提示元素
    const toast = document.createElement('div');
    toast.className = 'collection-toast';
    toast.textContent = '卡片已收藏！';
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-success);
      color: white;
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-medium);
      z-index: var(--z-modal);
      animation: fadeInOut 2s ease-in-out;
    `;
    
    // 添加动画样式
    if (!document.querySelector('#collection-toast-style')) {
      const style = document.createElement('style');
      style.id = 'collection-toast-style';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 2秒后移除提示
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2000);
  }

  // 显示卡片收藏页面
  showCollection() {
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示收藏视图
    this.cardsCollection.classList.remove('hidden');
    
    // 渲染收藏的卡片
    this.renderCollectedCards();
  }

  // 渲染收藏的卡片
  renderCollectedCards() {
    const cards = window.storageEngine.getCards();
    const characters = window.gameEngine.getCharacters();
    
    if (cards.length === 0) {
      this.collectedCards.innerHTML = `
        <div class="empty-collection">
          <p>还没有收集到任何卡片</p>
          <p>完成角色的故事来收集卡片吧！</p>
        </div>
      `;
      return;
    }
    
    this.collectedCards.innerHTML = cards.map(card => {
      const character = characters.find(c => c.id === card.characterId);
      const avatar = character ? character.avatar : 'assets/images/characters/default.jpg';
      
      return `
        <div class="collected-card">
          <img src="${avatar}" alt="${card.characterName}">
          <h4>${card.characterName}</h4>
          <p>${card.endingNote}</p>
        </div>
      `;
    }).join('');
  }

  // 隐藏卡片视图
  hide() {
    this.element.classList.add('hidden');
  }

  // 隐藏收藏视图
  hideCollection() {
    this.cardsCollection.classList.add('hidden');
  }
}

// 全局卡片视图实例
window.cardView = new CardView();