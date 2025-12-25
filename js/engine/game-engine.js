// Game Engine
class GameEngine {
  constructor() {
    this.characters = [];
    this.stories = {};
    this.currentCharacter = null;
    this.currentEvent = null;
    this.isInitialized = false;
  }

  // 初始化游戏
  async initialize() {
    try {
      // 加载内容
      await this.loadContent();
      
      // 验证内容
      const validation = await window.contentValidator.validate(this.characters, this.stories);
      
      if (!validation.isValid) {
        throw new Error(`Content validation failed:\n${validation.errors.join('\n')}`);
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Game initialization failed:', error);
      throw error;
    }
  }

  // 加载内容
  async loadContent() {
    try {
      // 加载角色数据
      this.characters = await window.contentLoader.loadCharacters();
      
      // 加载所有故事数据
      this.stories = await window.contentLoader.loadAllStories(this.characters);
      
    } catch (error) {
      throw new Error(`Failed to load content: ${error.message}`);
    }
  }

  // 开始故事
  startStory(characterId) {
    if (!this.isInitialized) {
      throw new Error('Game not initialized');
    }

    const character = this.characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error(`Character not found: ${characterId}`);
    }

    const events = this.stories[characterId];
    if (!events || events.length === 0) {
      throw new Error(`No events found for character: ${characterId}`);
    }

    // 找到起始事件（第一个事件）
    const startEvent = events[0];
    
    this.currentCharacter = character;
    this.currentEvent = startEvent;
    
    // 记录最近访问
    window.storageEngine.recordRecentVisit(characterId);
    
    // 保存当前状态
    window.storageEngine.setCurrentState(characterId, startEvent.id);
    window.storageEngine.logEvent(startEvent.id);
    
    return {
      character: this.currentCharacter,
      event: this.currentEvent
    };
  }

  // 继续故事
  continueStory(characterId, eventId) {
    if (!this.isInitialized) {
      throw new Error('Game not initialized');
    }

    const character = this.characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error(`Character not found: ${characterId}`);
    }

    const events = this.stories[characterId];
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    this.currentCharacter = character;
    this.currentEvent = event;
    
    return {
      character: this.currentCharacter,
      event: this.currentEvent
    };
  }

  // 做出选择
  makeChoice(choiceIndex) {
    if (!this.currentEvent || !this.currentEvent.choices) {
      throw new Error('No choices available');
    }

    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) {
      throw new Error(`Invalid choice index: ${choiceIndex}`);
    }

    // 记录选择
    window.storageEngine.logEvent(this.currentEvent.id, choice.text);

    // 如果有下一个事件
    if (choice.next) {
      const events = this.stories[this.currentCharacter.id];
      const nextEvent = events.find(e => e.id === choice.next);
      
      if (!nextEvent) {
        throw new Error(`Next event not found: ${choice.next}`);
      }

      this.currentEvent = nextEvent;
      
      // 保存当前状态
      window.storageEngine.setCurrentState(this.currentCharacter.id, nextEvent.id);
      window.storageEngine.logEvent(nextEvent.id);
      
      return {
        character: this.currentCharacter,
        event: this.currentEvent
      };
    }

    // 如果没有下一个事件，说明故事结束
    return null;
  }

  // 获取当前状态
  getCurrentState() {
    return {
      character: this.currentCharacter,
      event: this.currentEvent,
      isInitialized: this.isInitialized
    };
  }

  // 获取角色列表
  getCharacters() {
    return this.characters;
  }

  // 获取角色的故事事件
  getCharacterEvents(characterId) {
    return this.stories[characterId] || [];
  }

  // 继续到下一个事件（单线剧情）
  continueToNextEvent() {
    if (!this.currentEvent) {
      throw new Error('No current event');
    }

    const events = this.stories[this.currentCharacter.id];
    const currentIndex = events.findIndex(e => e.id === this.currentEvent.id);
    
    if (currentIndex === -1) {
      throw new Error('Current event not found');
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= events.length) {
      // 没有更多事件
      return null;
    }

    const nextEvent = events[nextIndex];
    this.currentEvent = nextEvent;
    
    // 保存当前状态
    window.storageEngine.setCurrentState(this.currentCharacter.id, nextEvent.id);
    window.storageEngine.logEvent(nextEvent.id);
    
    return {
      character: this.currentCharacter,
      event: this.currentEvent
    };
  }

  // 重置游戏状态
  reset() {
    this.currentCharacter = null;
    this.currentEvent = null;
    // 清理存储中的视图状态
    window.storageEngine.clearViewState();
  }

  // 从存档恢复状态（已禁用，强制返回null）
  restoreFromSave() {
    // 强制禁用状态恢复，始终返回null
    console.log('State restoration disabled - forcing Hub');
    window.storageEngine.clearViewState();
    return null;
  }
}

// 全局游戏引擎实例
window.gameEngine = new GameEngine();