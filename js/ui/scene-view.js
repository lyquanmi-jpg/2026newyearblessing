// Scene View Controller
class SceneView {
  constructor() {
    this.element = document.getElementById('scene-view');
    this.backBtn = document.getElementById('back-to-hub');
    this.characterAvatar = document.getElementById('character-avatar');
    this.characterName = document.getElementById('character-name');
    this.sceneText = document.getElementById('scene-text');
    this.sceneChoices = document.getElementById('scene-choices');
    
    this.currentCharacter = null;
    this.currentEvent = null;
    
    this.bindEvents();
  }

  bindEvents() {
    // 返回Hub按钮
    this.backBtn.addEventListener('click', () => {
      window.app.showHub();
    });
  }

  // 显示场景视图
  show(character, event) {
    this.currentCharacter = character;
    this.currentEvent = event;
    
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示场景视图
    this.element.classList.remove('hidden');
    
    // 渲染场景内容
    this.renderScene();
  }

  // 渲染场景
  renderScene() {
    // 设置角色信息
    this.characterAvatar.src = this.currentCharacter.avatar;
    this.characterAvatar.alt = this.currentCharacter.name;
    this.characterName.textContent = this.currentCharacter.name;
    
    // 设置场景文本（应用响应式记忆）
    const enhancedText = this.applyResponsiveMemory(this.currentEvent.text);
    this.sceneText.textContent = enhancedText;
    
    // 渲染选择
    this.renderChoices();
  }

  // 应用响应式记忆
  applyResponsiveMemory(originalText) {
    const eventId = this.currentEvent.id;
    const characterId = this.currentCharacter.id;
    
    // 只在 scene_004 或 scene_006 应用响应式记忆
    if (!eventId.includes('_scene_004') && !eventId.includes('_scene_006')) {
      return originalText;
    }
    
    // 获取该角色的双选择记录
    const dualCompanionship = window.storageEngine.getDualCompanionship(characterId);
    if (!dualCompanionship) {
      return originalText;
    }
    
    // 根据角色和选择添加响应式记忆
    const memoryResponse = this.getMemoryResponse(characterId, eventId, dualCompanionship);
    
    if (memoryResponse) {
      return originalText + ' ' + memoryResponse;
    }
    
    return originalText;
  }

  // 获取记忆响应
  getMemoryResponse(characterId, eventId, dualCompanionship) {
    const responses = this.getCharacterResponses(characterId);
    if (!responses) return null;
    
    const sceneResponses = eventId.includes('_scene_004') ? responses.scene_004 : responses.scene_006;
    if (!sceneResponses) return null;
    
    // 分析第一个选择的类型
    const choice1 = dualCompanionship.choice1.toLowerCase();
    
    let responseType = 'quiet'; // 默认
    
    // 判断选择类型
    if (choice1.includes('主动') || choice1.includes('帮') || choice1.includes('接过') || choice1.includes('拿')) {
      responseType = 'active';
    } else if (choice1.includes('陪') || choice1.includes('聊') || choice1.includes('坐') || choice1.includes('安静')) {
      responseType = 'quiet';
    } else if (choice1.includes('提醒') || choice1.includes('悄悄') || choice1.includes('轻轻')) {
      responseType = 'respectful';
    }
    
    return sceneResponses[responseType] || null;
  }

  // 获取角色的响应配置
  getCharacterResponses(characterId) {
    const responses = {
      honghong: {
        scene_004: {
          active: '她感受到了那份主动的关心，心里暖暖的。',
          quiet: '有人安静地陪在身边，让她觉得很安心。',
          respectful: '那种不打扰却在意的温柔，她都记在心里。'
        }
      },
      xiaomeng: {
        scene_004: {
          active: '有人愿意分担，让她觉得不那么孤单。',
          quiet: '厨房里有人陪伴的感觉，比一个人忙碌要温暖很多。',
          respectful: '那种体贴的距离感，让她觉得很舒服。'
        }
      },
      ache: {
        scene_004: {
          active: '有人一起分担，让他觉得这种默契很珍贵。',
          quiet: '那种不需要多说什么的陪伴，他很喜欢。',
          respectful: '被理解的感觉，让他更愿意敞开心扉。'
        }
      },
      binbin: {
        scene_006: {
          active: '有人主动分担，让他觉得自己的努力被看见了。',
          quiet: '那种默默的支持，给了他继续前行的力量。',
          respectful: '被尊重的感觉，让他更有信心面对未来。'
        }
      },
      niaoge: {
        scene_004: {
          active: '有人愿意一起参与，让他觉得分享变得更有意义。',
          quiet: '那种安静的陪伴，让他感受到了真正的理解。',
          respectful: '被信任的感觉，让他更愿意敞开心扉。'
        }
      },
      taozhi: {
        scene_006: {
          active: '有人主动靠近，让她觉得自己值得被关心。',
          quiet: '那种不带压力的陪伴，让她觉得很放松。',
          respectful: '被温柔对待的感觉，让她更愿意相信美好。'
        }
      },
      chunxia: {
        scene_004: {
          active: '有人跟上她的节奏，让她觉得很开心。',
          quiet: '那种稳定的陪伴，给了她更多的安全感。',
          respectful: '被理解的感觉，让她更愿意展现真实的自己。'
        }
      },
      djie: {
        scene_006: {
          active: '有人主动关心，让她觉得自己也值得被照顾。',
          quiet: '那种轻声细语的陪伴，让她感到很安心。',
          respectful: '被温柔对待的感觉，让她更愿意相信善意。'
        }
      },
      jojo: {
        scene_004: {
          active: '有人愿意分担，让她觉得不用总是一个人扛着。',
          quiet: '那种默默的支持，让她感受到了真正的关怀。',
          respectful: '被理解的感觉，让她更愿意敞开心扉。'
        }
      },
      feifei: {
        scene_006: {
          active: '有人主动关心，让她觉得自己依然值得被爱。',
          quiet: '那种不带评判的陪伴，给了她继续前行的勇气。',
          respectful: '被尊重的感觉，让她更有信心面对挑战。'
        }
      },
      lanmao: {
        scene_004: {
          active: '有人愿意参与她的节奏，让她觉得不那么孤单。',
          quiet: '那种安静的理解，让她感受到了真正的支持。',
          respectful: '被尊重选择的感觉，让她更有勇气做自己。'
        }
      },
      wenting: {
        scene_006: {
          active: '有人主动关心，让她觉得这份温柔很珍贵。',
          quiet: '那种从容的陪伴，让她感受到了真正的理解。',
          respectful: '被温柔对待的感觉，让她更愿意相信美好。'
        }
      },
      baimao: {
        scene_004: {
          active: '有人愿意一起参与，让他觉得分享变得更有意义。',
          quiet: '那种安静的支持，让他感受到了真正的认可。',
          respectful: '被理解的感觉，让他更愿意展现真实的自己。'
        }
      }
    };
    
    return responses[characterId] || null;
  }

  // 渲染选择
  renderChoices() {
    if (this.currentEvent.type === 'ending') {
      // 结局事件，显示结束按钮
      this.sceneChoices.innerHTML = `
        <button class="choice-btn primary-btn" onclick="window.sceneView.showEnding()">
          查看结局
        </button>
      `;
    } else if (this.currentEvent.choices && this.currentEvent.choices.length > 0) {
      // 普通场景，显示选择
      this.sceneChoices.innerHTML = this.currentEvent.choices.map((choice, index) => `
        <button class="choice-btn" onclick="window.sceneView.makeChoice(${index})">
          ${choice.text}
        </button>
      `).join('');
    } else {
      // 没有选择的场景，检查是否需要延迟
      const isScene002 = this.currentEvent.id.includes('_scene_002');
      if (isScene002) {
        this.renderDelayedButton();
      } else {
        // 获取情感化按钮文本
        const buttonText = this.getEmotionalButtonText();
        
        this.sceneChoices.innerHTML = `
          <button class="choice-btn primary-btn continue-btn enhanced-continue" onclick="window.sceneView.continueStory()">
            ${buttonText}
          </button>
        `;
        
        // 强制确保按钮有正确的 class
        const btn = this.sceneChoices.querySelector('button');
        if (btn) {
          btn.classList.add('continue-btn');
          btn.classList.add('enhanced-continue');
        }
      }
    }
  }

  // 获取情感化按钮文本
  getEmotionalButtonText() {
    const eventId = this.currentEvent.id;
    const characterId = this.currentCharacter.id;
    
    // 早期场景保持"继续"
    if (eventId.includes('_scene_001') || eventId.includes('_scene_002')) {
      return '继续';
    }
    
    // 获取场景特定的情感化文本
    const emotionalText = this.getSceneEmotionalText(characterId, eventId);
    return emotionalText || '继续';
  }

  // 获取场景情感化文本
  getSceneEmotionalText(characterId, eventId) {
    const emotionalTexts = {
      // 红红 - 温暖组织者
      honghong: {
        'honghong_scene_004': '再陪她一会',
        'honghong_scene_006': '把这段时间留下'
      },
      
      // 小梦 - 厨房温暖
      xiaomeng: {
        'xiaomeng_scene_004': '走近一点',
        'xiaomeng_scene_006': '收好这段陪伴'
      },
      
      // 阿澈 - 沉静陪伴
      ache: {
        'ache_scene_004': '听他说完',
        'ache_scene_006': '把这段时间留下'
      },
      
      // 彬彬 - 细心筹备
      binbin: {
        'binbin_scene_004': '再陪他一会',
        'binbin_scene_006': '收好这段陪伴'
      },
      
      // 鸟哥 - 旅行分享
      niaoge: {
        'niaoge_scene_004': '听他说完',
        'niaoge_scene_006': '把这段时间留下'
      },
      
      // 桃汁 - 精致成长
      taozhi: {
        'taozhi_scene_004': '走近一点',
        'taozhi_scene_006': '收好这段陪伴'
      },
      
      // 春夏 - 热烈活力
      chunxia: {
        'chunxia_scene_004': '再陪她一会',
        'chunxia_scene_006': '把这段时间留下'
      },
      
      // D姐 - 温柔细语
      djie: {
        'djie_scene_004': '听她说完',
        'djie_scene_006': '收好这段陪伴'
      },
      
      // JoJo - 关怀陪伴
      jojo: {
        'jojo_scene_004': '再陪她一会',
        'jojo_scene_006': '把这段时间留下'
      },
      
      // 肥肥 - 坚持光彩
      feifei: {
        'feifei_scene_004': '走近一点',
        'feifei_scene_006': '收好这段陪伴'
      },
      
      // 懒猫 - 暂停重整
      lanmao: {
        'lanmao_scene_004': '听她说完',
        'lanmao_scene_006': '把这段时间留下'
      },
      
      // 文婷 - 从容质感
      wenting: {
        'wenting_scene_004': '再陪她一会',
        'wenting_scene_006': '收好这段陪伴'
      },
      
      // 白猫 - 纯真分享
      baimao: {
        'baimao_scene_004': '听他说完',
        'baimao_scene_006': '把这段时间留下'
      }
    };
    
    return emotionalTexts[characterId] && emotionalTexts[characterId][eventId];
  }

  // 渲染延迟按钮
  renderDelayedButton() {
    this.sceneChoices.innerHTML = `
      <div class="delayed-button-container continue-wrap">
        <div class="continue-dot"></div>
        <button class="choice-btn primary-btn delayed-btn continue-btn" disabled>
          <span class="btn-text">继续</span>
          <div class="btn-underline"></div>
        </button>
      </div>
    `;

    // 强制确保按钮有正确的 class
    const btn = this.sceneChoices.querySelector('button');
    const dot = this.sceneChoices.querySelector('.continue-dot');
    if (btn) {
      btn.classList.add('continue-btn');
      btn.classList.add('enhanced-continue');
    }
    if (dot) {
      dot.classList.add('continue-dot');
    }

    // 随机延迟 0.8-1.2 秒
    const delay = 800 + Math.random() * 400;
    
    setTimeout(() => {
      const delayedBtn = this.sceneChoices.querySelector('.delayed-btn');
      if (delayedBtn) {
        delayedBtn.disabled = false;
        delayedBtn.classList.add('ready');
        delayedBtn.onclick = () => window.sceneView.continueStory();
      }
    }, delay);
  }

  // 继续故事
  continueStory() {
    try {
      const result = window.gameEngine.continueToNextEvent();
      
      if (result) {
        this.currentCharacter = result.character;
        this.currentEvent = result.event;
        this.renderScene();
      } else {
        window.app.showHub();
      }
    } catch (error) {
      console.error('Failed to continue story:', error);
      alert(`继续失败：${error.message}`);
    }
  }

  // 做出选择
  makeChoice(choiceIndex) {
    try {
      const choice = this.currentEvent.choices[choiceIndex];
      
      // 记录选择
      if (this.currentEvent.id.includes('_scene_003')) {
        // 第一次选择，临时存储
        this.tempChoice1 = choice.text;
      } else if (this.currentEvent.id.includes('_scene_005')) {
        // 第二次选择，记录双选择
        const choice1 = this.tempChoice1 || choice.text;
        const choice2 = choice.text;
        window.storageEngine.recordDualCompanionship(
          this.currentCharacter.id, 
          choice1,
          choice2
        );
        this.tempChoice1 = null; // 清理临时存储
      }
      
      const result = window.gameEngine.makeChoice(choiceIndex);
      
      if (result) {
        // 继续故事
        this.currentCharacter = result.character;
        this.currentEvent = result.event;
        this.renderScene();
      } else {
        // 故事结束，返回Hub
        window.app.showHub();
      }
    } catch (error) {
      console.error('Failed to make choice:', error);
      alert(`选择失败：${error.message}`);
    }
  }

  // 显示结局
  showEnding() {
    if (this.currentEvent.type === 'ending') {
      window.app.showCard(
        this.currentCharacter,
        this.currentEvent.ending_note
      );
    }
  }

  // 隐藏场景视图
  hide() {
    this.element.classList.add('hidden');
  }

  // 更新场景（用于从其他视图返回时）
  update(character, event) {
    this.currentCharacter = character;
    this.currentEvent = event;
    this.renderScene();
  }
}

// 全局场景视图实例
window.sceneView = new SceneView();