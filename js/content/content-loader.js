// Content Loader
class ContentLoader {
  constructor() {
    this.baseUrl = '';
  }

  // 加载JSON文件
  async loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to load ${url}: ${error.message}`);
    }
  }

  // 加载角色数据
  async loadCharacters() {
    try {
      const characters = await this.loadJSON('content/characters.json');
      
      if (!Array.isArray(characters)) {
        throw new Error('Characters data must be an array');
      }
      
      return characters;
    } catch (error) {
      throw new Error(`Failed to load characters: ${error.message}`);
    }
  }

  // 加载单个角色的故事
  async loadCharacterStory(characterId) {
    try {
      const events = await this.loadJSON(`content/stories/${characterId}/events.json`);
      
      if (!Array.isArray(events)) {
        throw new Error(`Events data for character ${characterId} must be an array`);
      }
      
      return events;
    } catch (error) {
      throw new Error(`Failed to load story for character ${characterId}: ${error.message}`);
    }
  }

  // 加载所有角色的故事
  async loadAllStories(characters) {
    const stories = {};
    const loadPromises = [];
    
    for (const character of characters) {
      const promise = this.loadCharacterStory(character.id)
        .then(events => {
          stories[character.id] = events;
        })
        .catch(error => {
          console.error(`Failed to load story for ${character.id}:`, error);
          // 为失败的角色创建空的事件数组
          stories[character.id] = [];
        });
      
      loadPromises.push(promise);
    }
    
    // 等待所有故事加载完成
    await Promise.all(loadPromises);
    
    return stories;
  }

  // 检查资源是否存在
  async checkResource(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // 预加载图片资源
  async preloadImages(characters) {
    const imagePromises = characters.map(character => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
          console.warn(`Failed to load image: ${character.avatar}`);
          resolve(false);
        };
        img.src = character.avatar;
      });
    });
    
    await Promise.all(imagePromises);
  }

  // 获取故事元数据（如果存在）
  async loadStoryMeta(characterId) {
    try {
      const meta = await this.loadJSON(`content/stories/${characterId}/meta.json`);
      return meta;
    } catch (error) {
      // 元数据是可选的，失败时返回默认值
      return {
        title: '',
        description: '',
        tags: [],
        difficulty: 'normal',
        estimatedTime: '10-15分钟'
      };
    }
  }
}

// 全局内容加载器实例
window.contentLoader = new ContentLoader();