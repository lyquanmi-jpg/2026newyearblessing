// Content Validator
class ContentValidator {
  constructor() {
    this.errors = [];
  }

  // 验证所有内容
  async validate(characters, storiesData) {
    this.errors = [];
    
    try {
      // 验证角色数据
      this.validateCharacters(characters);
      
      // 验证故事数据
      this.validateStories(characters, storiesData);
      
      return {
        isValid: this.errors.length === 0,
        errors: this.errors
      };
    } catch (error) {
      this.errors.push(`Validation failed: ${error.message}`);
      return {
        isValid: false,
        errors: this.errors
      };
    }
  }

  // 验证角色数据
  validateCharacters(characters) {
    if (!Array.isArray(characters)) {
      this.errors.push('Characters data must be an array');
      return;
    }

    const characterIds = new Set();
    
    characters.forEach((character, index) => {
      const prefix = `Character ${index + 1}`;
      
      // 检查必需字段
      if (!character.id) {
        this.errors.push(`${prefix}: Missing required field 'id'`);
      } else {
        // 检查ID唯一性
        if (characterIds.has(character.id)) {
          this.errors.push(`${prefix}: Duplicate character ID '${character.id}'`);
        }
        characterIds.add(character.id);
      }
      
      if (!character.name) {
        this.errors.push(`${prefix}: Missing required field 'name'`);
      }
      
      if (!character.description) {
        this.errors.push(`${prefix}: Missing required field 'description'`);
      }
      
      if (!character.avatar) {
        this.errors.push(`${prefix}: Missing required field 'avatar'`);
      }
    });
  }

  // 验证故事数据
  validateStories(characters, storiesData) {
    const characterIds = new Set(characters.map(c => c.id));
    
    Object.entries(storiesData).forEach(([characterId, events]) => {
      const prefix = `Story for character '${characterId}'`;
      
      // 检查角色ID是否存在
      if (!characterIds.has(characterId)) {
        this.errors.push(`${prefix}: Character ID '${characterId}' not found in characters.json`);
        return;
      }
      
      // 验证事件数据
      this.validateEvents(characterId, events);
    });
  }

  // 验证事件数据
  validateEvents(characterId, events) {
    if (!Array.isArray(events)) {
      this.errors.push(`Story for character '${characterId}': Events must be an array`);
      return;
    }

    const eventIds = new Set();
    const prefix = `Story for character '${characterId}'`;
    
    events.forEach((event, index) => {
      const eventPrefix = `${prefix}, Event ${index + 1}`;
      
      // 检查必需字段
      if (!event.id) {
        this.errors.push(`${eventPrefix}: Missing required field 'id'`);
      } else {
        // 检查事件ID唯一性
        if (eventIds.has(event.id)) {
          this.errors.push(`${eventPrefix}: Duplicate event ID '${event.id}'`);
        }
        eventIds.add(event.id);
      }
      
      if (!event.type) {
        this.errors.push(`${eventPrefix}: Missing required field 'type'`);
      }
      
      if (!event.text) {
        this.errors.push(`${eventPrefix}: Missing required field 'text'`);
      }
      
      // 根据事件类型验证特定字段
      if (event.type === 'scene') {
        if (!event.choices || !Array.isArray(event.choices)) {
          this.errors.push(`${eventPrefix}: Scene events must have 'choices' array`);
        } else {
          event.choices.forEach((choice, choiceIndex) => {
            const choicePrefix = `${eventPrefix}, Choice ${choiceIndex + 1}`;
            
            if (!choice.text) {
              this.errors.push(`${choicePrefix}: Missing required field 'text'`);
            }
            
            if (!choice.next) {
              this.errors.push(`${choicePrefix}: Missing required field 'next'`);
            }
          });
        }
      } else if (event.type === 'ending') {
        if (!event.ending_note) {
          this.errors.push(`${eventPrefix}: Ending events must have 'ending_note' field`);
        }
      }
    });
    
    // 验证next引用的有效性
    events.forEach((event, index) => {
      const eventPrefix = `${prefix}, Event ${index + 1}`;
      
      if (event.choices) {
        event.choices.forEach((choice, choiceIndex) => {
          const choicePrefix = `${eventPrefix}, Choice ${choiceIndex + 1}`;
          
          if (choice.next && !eventIds.has(choice.next)) {
            this.errors.push(`${choicePrefix}: Referenced event ID '${choice.next}' not found`);
          }
        });
      }
    });
  }

  // 获取错误信息的HTML格式
  getErrorsHTML() {
    if (this.errors.length === 0) {
      return '<p>No errors found.</p>';
    }
    
    return `
      <div class="validation-errors">
        <h3>发现以下错误：</h3>
        <ul>
          ${this.errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
        <p><strong>请修复这些错误后重新加载游戏。</strong></p>
      </div>
    `;
  }
}

// 全局验证器实例
window.contentValidator = new ContentValidator();