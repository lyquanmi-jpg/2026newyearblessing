// Storage Engine
class StorageEngine {
  constructor() {
    this.STORAGE_KEY = 'interactive_story_game';
    this.CURRENT_VERSION = '1.0.0';
    this.defaultData = {
      version: this.CURRENT_VERSION,
      currentEvent: null,
      characterId: null,
      eventLog: [],
      receivedCards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // 获取存档数据
  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return this.defaultData;
      }

      const parsed = JSON.parse(data);
      
      // 版本迁移
      if (parsed.version !== this.CURRENT_VERSION) {
        return this.migrate(parsed);
      }

      return { ...this.defaultData, ...parsed };
    } catch (error) {
      console.error('Failed to load save data:', error);
      return this.defaultData;
    }
  }

  // 保存数据
  save(data) {
    try {
      const saveData = {
        ...data,
        version: this.CURRENT_VERSION,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  }

  // 清除存档
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear save data:', error);
      return false;
    }
  }

  // 版本迁移
  migrate(oldData) {
    console.log(`Migrating save data from ${oldData.version} to ${this.CURRENT_VERSION}`);
    
    // 这里可以添加版本迁移逻辑
    const migratedData = { ...this.defaultData, ...oldData };
    migratedData.version = this.CURRENT_VERSION;
    
    // 保存迁移后的数据
    this.save(migratedData);
    
    return migratedData;
  }

  // 添加卡片到收藏
  addCard(characterId, characterName, endingNote) {
    const saveData = this.load();
    
    // 检查是否已经收集过这张卡片
    const existingCard = saveData.receivedCards.find(card => 
      card.characterId === characterId && card.endingNote === endingNote
    );
    
    if (!existingCard) {
      saveData.receivedCards.push({
        characterId,
        characterName,
        endingNote,
        collectedAt: new Date().toISOString()
      });
      
      this.save(saveData);
    }
    
    return saveData.receivedCards;
  }

  // 记录陪伴方式
  recordCompanionship(characterId, companionshipType) {
    const saveData = this.load();
    
    if (!saveData.companionships) {
      saveData.companionships = [];
    }
    
    saveData.companionships.push({
      characterId,
      companionshipType,
      timestamp: new Date().toISOString()
    });
    
    this.save(saveData);
  }

  // 记录双选择陪伴方式
  recordDualCompanionship(characterId, choice1, choice2) {
    const saveData = this.load();
    
    if (!saveData.dualCompanionships) {
      saveData.dualCompanionships = [];
    }
    
    saveData.dualCompanionships.push({
      characterId,
      choice1,
      choice2,
      timestamp: new Date().toISOString()
    });
    
    this.save(saveData);
  }

  // 获取双选择陪伴记录
  getDualCompanionship(characterId) {
    const saveData = this.load();
    const dualCompanionships = saveData.dualCompanionships || [];
    return dualCompanionships.find(comp => comp.characterId === characterId);
  }

  // 记录最近访问的角色
  recordRecentVisit(characterId) {
    const saveData = this.load();
    
    if (!saveData.recentVisits) {
      saveData.recentVisits = [];
    }
    
    // 移除已存在的记录（避免重复）
    saveData.recentVisits = saveData.recentVisits.filter(visit => visit.characterId !== characterId);
    
    // 添加新记录到开头
    saveData.recentVisits.unshift({
      characterId,
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近5个
    saveData.recentVisits = saveData.recentVisits.slice(0, 5);
    
    this.save(saveData);
  }

  // 获取最近访问的角色
  getRecentVisits() {
    const saveData = this.load();
    return saveData.recentVisits || [];
  }

  // 获取陪伴记录
  getCompanionships() {
    const saveData = this.load();
    return saveData.companionships || [];
  }

  // 获取陪伴统计
  getCompanionshipStats() {
    const companionships = this.getCompanionships();
    const stats = {};
    
    companionships.forEach(comp => {
      stats[comp.companionshipType] = (stats[comp.companionshipType] || 0) + 1;
    });
    
    return stats;
  }

  // 获取陪伴过的角色数量
  getCompanionedCharacterCount() {
    const companionships = this.getCompanionships();
    const uniqueCharacters = new Set(companionships.map(comp => comp.characterId));
    return uniqueCharacters.size;
  }

  // 获取最常选择的陪伴方式
  getTopCompanionshipTypes(limit = 3) {
    const stats = this.getCompanionshipStats();
    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([type]) => type);
  }

  // 获取收集的卡片（兼容旧版本）
  getCards() {
    const saveData = this.load();
    return saveData.receivedCards || [];
  }

  // 清理视图状态（强制回到Hub）
  clearViewState() {
    const saveData = this.load();
    
    // 删除所有可能导致视图恢复的字段
    delete saveData.lastView;
    delete saveData.currentView;
    delete saveData.view;
    delete saveData.currentScene;
    delete saveData.currentCharacter;
    delete saveData.activeStory;
    delete saveData.sceneId;
    delete saveData.endingId;
    delete saveData.currentEvent;
    delete saveData.characterId;
    
    this.save(saveData);
    console.log('View state cleared - forced to Hub');
  }

  // 记录事件日志
  logEvent(eventId, choiceId = null) {
    const saveData = this.load();
    
    saveData.eventLog.push({
      eventId,
      choiceId,
      timestamp: new Date().toISOString()
    });
    
    this.save(saveData);
  }

  // 设置当前状态
  setCurrentState(characterId, eventId) {
    const saveData = this.load();
    saveData.characterId = characterId;
    saveData.currentEvent = eventId;
    this.save(saveData);
  }

  // 获取当前状态
  getCurrentState() {
    const saveData = this.load();
    return {
      characterId: saveData.characterId,
      currentEvent: saveData.currentEvent
    };
  }

  // 记录故事完成
  recordStoryCompletion(characterId) {
    const saveData = this.load();
    
    if (!saveData.completedStories) {
      saveData.completedStories = [];
    }
    
    // 避免重复记录
    if (!saveData.completedStories.includes(characterId)) {
      saveData.completedStories.push(characterId);
      this.save(saveData);
    }
    
    return saveData.completedStories.length;
  }

  // 获取完成的故事数量
  getCompletedStoriesCount() {
    const saveData = this.load();
    return (saveData.completedStories || []).length;
  }

  // 检查是否已显示过领悟时刻
  hasShownRealizationMoment() {
    const saveData = this.load();
    return saveData.realizationMomentShown === true;
  }

  // 标记领悟时刻已显示
  markRealizationMomentShown() {
    const saveData = this.load();
    saveData.realizationMomentShown = true;
    this.save(saveData);
  }

  // 检查是否应该触发领悟时刻
  shouldTriggerRealizationMoment() {
    return this.getCompletedStoriesCount() >= 5 && !this.hasShownRealizationMoment();
  }
}

// 全局存储实例
window.storageEngine = new StorageEngine();