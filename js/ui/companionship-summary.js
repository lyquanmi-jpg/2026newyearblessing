// Companionship Summary View Controller
class CompanionshipSummaryView {
  constructor() {
    this.element = document.getElementById('companionship-summary');
    this.backBtn = document.getElementById('summary-back-btn');
    this.summaryContent = document.getElementById('summary-content');
    
    this.bindEvents();
  }

  bindEvents() {
    // 返回按钮
    this.backBtn.addEventListener('click', () => {
      window.app.showHub();
    });
  }

  // 显示陪伴总结视图
  show() {
    // 隐藏其他视图
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('hidden');
    });
    
    // 显示总结视图
    this.element.classList.remove('hidden');
    
    // 渲染总结内容
    this.renderSummary();
  }

  // 渲染总结内容
  renderSummary() {
    const companionedCount = window.storageEngine.getCompanionedCharacterCount();
    const topCompanionshipTypes = window.storageEngine.getTopCompanionshipTypes(3);
    
    // 陪伴方式描述映射
    const companionshipDescriptions = {
      '静静陪伴': '你选择了静静陪伴，用无声的理解给予支持',
      '轻声安慰': '你选择了轻声安慰，用温柔的话语传递关怀',
      '默默守护': '你选择了默默守护，用坚定的存在提供安全感',
      '耐心倾听': '你选择了耐心倾听，用专注的聆听给予回应',
      '温暖拥抱': '你选择了温暖拥抱，用身体的接触传递温度',
      '陪伴左右': '你选择了陪伴左右，用同行的方式分担重量'
    };

    let companionshipText = '';
    if (topCompanionshipTypes.length > 0) {
      const descriptions = topCompanionshipTypes
        .map(type => companionshipDescriptions[type] || `你选择了${type}`)
        .slice(0, 2);
      
      companionshipText = descriptions.join('；');
    }

    this.summaryContent.innerHTML = `
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-number">${companionedCount}</div>
          <div class="stat-label">陪伴过的人</div>
        </div>
      </div>
      
      <div class="summary-text">
        <p class="companionship-ways">${companionshipText}</p>
        <p class="summary-ending">这些时光里，你用自己的方式参与了别人的故事。</p>
      </div>
    `;
  }

  // 隐藏总结视图
  hide() {
    this.element.classList.add('hidden');
  }
}

// 全局陪伴总结视图实例
window.companionshipSummaryView = new CompanionshipSummaryView();