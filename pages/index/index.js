const app = getApp();

Page({
  data: {
    // Layout measurements
    statusBarHeight: 20,
    navBarHeight: 44,
    customHeaderHeight: 64,
    safeAreaBottom: 0,
    
    // Switch states
    activeTab: 'home', // 'home' | 'gallery' | 'inspiration' | 'profile'
    inspirationPoints: 80,
    currentMode: 'basic', // 'basic' | 'advanced' | 'flagship'
    currentModeLabel: '普通模式',
    
    isEnhancing: false,
    isGenerating: false,
    promptText: '',
    charCount: 0,
    
    styleModalVisible: false,
    modeDropdownVisible: false,

    // ==========================================
    // PORTED PAGE 2: 画廊 (History Gallery) DATA
    // ==========================================
    galleryItems: [
      {
        id: 1,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ',
        desc: 'A mesmerizing digital art piece featuring a swirling vortex of deep purple and coral orange nebulas. The composition is dynamic and ethereal...',
        isFading: false
      },
      {
        id: 2,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDij8yhbdfhbcNGS7YOsg_WnuDKTVdi-vkElenY-JkiEcCxhL0RB9Ltws9uXGr8jya-rKoAWhS75YTKVr1TPLrOUnsxjPeM1VZArEaBGGqVL7hcGZChdMRG2j6EFt5XiZn16JR_Ep8wgtEk5QN1pnfRHtZ1kU-YKHfQEH_kxXGqqjN6_O0rY4_ujyCjZO1Cnn2uwuIy10qVbkwUKxYeghx6LI7-_EJxDlJ8lDVqgXeE4wDW55qdemKsqVJDdy-1xHbWhkNR01t33Q',
        desc: 'Minimalist abstract landscape, soft lighting, 3d render...',
        isFading: false
      },
      {
        id: 3,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC00AzKqkkAaooXRMLukNg4Tj1Y1m0ex_qVkb_IWLJfuvTh2K05_4AnbVBoaDtnzpJiCY_v8gmzaaXgNsJnEW8ieM9pOJLQOOa40BR2XhQB43G6Gumkddb7jpskhmO3D8YUQFuhLNhipsv5wvvi9KyVpWlPhW3D5gVVzBYthhVUKZKiXwg6EpmtlpcoVBmabgOevNn0x9UFajZlVsi5oRLliouSLq0bEsD9gHOYDG8TsIAdGFofsq2fMGEZJfVkLdUBvFXTwNcUMg',
        desc: 'Futuristic robot portrait, translucent glass shell...',
        isFading: false
      },
      {
        id: 4,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBibAs4z5RCcHBDfjB2kff7EchEpvU2g5uxB1xI9KNbzkwiKod09pTa3ljTOljft5hp_NNd1dyNFLrCzmiRQv3HTd13ygcClJ2kKTeLh39vBxzA3xwg3Ux25e6wair4bUUZMJ90aI9XBR0hpHKcnlf7HWviUYwuK5DA3ZPuBvnIo31f8aZBhvrw3XJ-pT6MX0jq-cnpu4nf_YfzSOjeiyn2iZ-znuMdazStkBgUEBsg7W0YXqB_CNU14tcgMqokWIeK7AmYVW87Yw',
        desc: 'Neural network visualization, soft light...',
        isFading: false
      }
    ],

    // ==========================================
    // PORTED PAGE 3: 充值中心 (Recharge) DATA
    // ==========================================
    rechargeSubTab: 'web', // 'ios' | 'web'
    selectedTierIndex: 1, // Default 50点 tier
    customRechargeVal: '',
    rechargeTiers: [
      { points: 10, price: '9.9' },
      { points: 50, price: '39.9', originalPrice: '49.5', isPopular: true },
      { points: 100, price: '69.9' }
    ]
  },

  // Page local constants
  canvasWidth: 375,
  canvasHeight: 667,
  bgParticles: [],
  fxParticles: [],
  bgCanvasNode: null,
  bgCtx: null,
  fxCanvasNode: null,
  fxCtx: null,
  bgAnimId: null,
  fxAnimId: null,
  
  // Touch avoidance physics states
  touchX: 0,
  touchY: 0,
  touchActive: false,
  avoidRadius: 0, 

  onLoad() {
    const globalData = app.globalData || {};
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 20,
      navBarHeight: globalData.navBarHeight || 44,
      customHeaderHeight: globalData.customHeaderHeight || 64,
      safeAreaBottom: globalData.safeAreaBottom || 0
    });

    this.canvasWidth = globalData.screenWidth || 375;
    this.canvasHeight = globalData.screenHeight || 667;
  },

  onReady() {
    this.initBgParticleCanvas();
    this.initFxExplosionCanvas();
  },

  onUnload() {
    if (this.bgCanvasNode && this.bgAnimId) {
      this.bgCanvasNode.cancelAnimationFrame(this.bgAnimId);
    }
    if (this.fxCanvasNode && this.fxAnimId) {
      this.fxCanvasNode.cancelAnimationFrame(this.fxAnimId);
    }
  },

  // ========================================================
  // CORE VIEWS SWITCH LOGIC
  // ========================================================
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.isGenerating) return;

    this.setData({
      activeTab: tab,
      modeDropdownVisible: false,
      styleModalVisible: false
    });
  },

  // ========================================================
  // INPUT & CONTROLS HANDLERS
  // ========================================================
  onPromptInput(e) {
    const text = e.detail.value;
    this.setData({
      promptText: text,
      charCount: text.length
    });
  },

  fillPrompt(e) {
    if (this.data.isGenerating) return;
    const text = e.currentTarget.dataset.text;
    const tabSwitch = e.currentTarget.dataset.tabSwitch;
    
    const updateData = {
      promptText: text,
      charCount: text.length
    };
    
    if (tabSwitch) {
      updateData.activeTab = 'home';
    }

    this.setData(updateData);
  },

  toggleModeDropdown() {
    if (this.data.isGenerating) return;
    this.setData({
      modeDropdownVisible: !this.data.modeDropdownVisible
    });
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    const label = e.currentTarget.dataset.label;
    if (this.data.isGenerating) return;

    this.setData({
      currentMode: mode,
      currentModeLabel: label,
      modeDropdownVisible: false
    }, () => {
      this.initStardustParticles();
    });
  },

  toggleEnhance() {
    if (this.data.isGenerating) return;
    this.setData({
      isEnhancing: !this.data.isEnhancing
    });
  },

  openStyleModal() {
    if (this.data.isGenerating) return;
    this.setData({
      styleModalVisible: true,
      modeDropdownVisible: false
    });
  },

  closeStyleModal() {
    this.setData({
      styleModalVisible: false
    });
  },

  selectStyle(e) {
    const styleName = e.currentTarget.dataset.style;
    const currentText = this.data.promptText;
    const newText = currentText ? `${currentText}，${styleName}风格` : `${styleName}风格`;
    
    this.setData({
      promptText: newText,
      charCount: newText.length,
      styleModalVisible: false
    });
  },

  stopBubble() {
    // Helper to stop event propagation
  },

  onPointsTap() {
    this.setData({
      activeTab: 'inspiration' // Switch to Recharge page directly
    });
  },

  // ========================================================
  // PORTED PAGE 2: 画廊 (History Gallery) LOGIC
  // ========================================================
  deleteGalleryItem(e) {
    const itemId = parseInt(e.currentTarget.dataset.id, 10);
    const items = this.data.galleryItems;
    
    // 1. Locate and trigger fade-out transition state
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return Object.assign({}, item, { isFading: true });
      }
      return item;
    });

    this.setData({
      galleryItems: updatedItems
    });

    // 2. Filter out element from DOM after transition timeout (400ms)
    setTimeout(() => {
      const filtered = this.data.galleryItems.filter(item => item.id !== itemId);
      this.setData({
        galleryItems: filtered
      });

      wx.showToast({
        title: '画作已成功删除',
        icon: 'none',
        duration: 1500
      });
    }, 400);
  },

  goToGenerate() {
    this.setData({
      activeTab: 'home'
    });
  },

  // ========================================================
  // PORTED PAGE 3: 充值中心 (Recharge) LOGIC
  // ========================================================
  switchRechargeSubTab(e) {
    const subTab = e.currentTarget.dataset.subtab;
    this.setData({
      rechargeSubTab: subTab
    });
  },

  selectRechargeTier(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10);
    this.setData({
      selectedTierIndex: index,
      customRechargeVal: ''
    });
  },

  onCustomRechargeInput(e) {
    const val = e.detail.value;
    this.setData({
      selectedTierIndex: -1, // Indicates custom value selected
      customRechargeVal: val
    });
  },

  watchVideoPoints() {
    wx.showLoading({
      title: '加载广告视频中...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        inspirationPoints: this.data.inspirationPoints + 5
      });
      wx.showToast({
        title: '观看成功！+5 灵感值',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  submitRecharge() {
    let rechargeAmount = 0;
    const { selectedTierIndex, customRechargeVal, rechargeTiers } = this.data;

    if (selectedTierIndex >= 0) {
      rechargeAmount = rechargeTiers[selectedTierIndex].points;
    } else {
      rechargeAmount = parseInt(customRechargeVal, 10) || 0;
    }

    if (rechargeAmount <= 0) {
      wx.showToast({
        title: '请选择或输入有效的充值额度',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发起安全充值...',
      mask: true
    });

    // Simulate mock WeChat Pay sequence
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        inspirationPoints: this.data.inspirationPoints + rechargeAmount
      });

      wx.showModal({
        title: '充值成功',
        content: `成功充值 ${rechargeAmount} 点灵感值！已为您更新至账户。`,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#a13a00'
      });
    }, 1200);
  },

  // ========================================================
  // PORTED PAGE 4: 我的 (Profile) LOGIC
  // ========================================================
  copyUID() {
    wx.setClipboardData({
      data: '8273641',
      success: () => {
        wx.showToast({
          title: 'UID已复制',
          icon: 'success'
        });
      }
    });
  },

  // ========================================================
  // GENERATE & ACTION EXPLOSION
  // ========================================================
  startGeneration(e) {
    const prompt = this.data.promptText.trim();
    if (this.data.isGenerating || !prompt) {
      return;
    }

    const cost = this.data.currentMode === 'flagship' ? 5 : (this.data.currentMode === 'advanced' ? 2 : 1);
    if (this.data.inspirationPoints < cost) {
      wx.showModal({
        title: '生成受阻',
        content: '灵感值不足，请前往充值中心获取或更换较低配置模式。',
        confirmText: '去充值',
        cancelText: '取消',
        confirmColor: '#a13a00',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              activeTab: 'inspiration' // Opens recharge tab
            });
          }
        }
      });
      return;
    }

    let centerX = this.canvasWidth / 2;
    let centerY = this.canvasHeight - 120 - (this.data.safeAreaBottom);
    if (e && e.detail && e.detail.x) {
      centerX = e.detail.x;
      centerY = e.detail.y;
    }

    this.triggerExplosionParticles(centerX, centerY, this.data.currentMode);

    this.setData({
      isGenerating: true,
      inspirationPoints: this.data.inspirationPoints - cost
    });

    // Simulate model inference and automatically add generated art to history gallery!
    setTimeout(() => {
      const newItems = Array.from(this.data.galleryItems);
      const newId = newItems.length > 0 ? Math.max(...newItems.map(i => i.id)) + 1 : 1;
      
      // Auto pre-append high fidelity image to gallery grid!
      newItems.unshift({
        id: newId,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ',
        desc: prompt,
        isFading: false
      });

      this.setData({
        isGenerating: false,
        promptText: '',
        charCount: 0,
        galleryItems: newItems
      });

      wx.showModal({
        title: '生成成功',
        content: '您的AI艺术品已生成成功，并已同步归入历史画库！',
        confirmText: '去画库查看',
        cancelText: '留在首页',
        confirmColor: '#a13a00',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              activeTab: 'gallery'
            });
          }
        }
      });
    }, 3000);
  },

  // ========================================================
  // CANVAS 2D STARDUST ENGINE
  // ========================================================
  initBgParticleCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#particle-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) return;
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = app.globalData.pixelRatio || 2;
        
        this.bgCanvasNode = canvas;
        this.bgCtx = ctx;

        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        this.initStardustParticles();
        this.runStardustAnimationLoop();
      });
  },

  initStardustParticles() {
    this.bgParticles = [];
    let count = 30; 
    if (this.data.currentMode === 'advanced') count = 50;
    if (this.data.currentMode === 'flagship') count = 75;

    for (let i = 0; i < count; i++) {
      this.bgParticles.push(this.createStardustParticle(true));
    }
  },

  createStardustParticle(randomY = false) {
    const mode = this.data.currentMode;
    let speed = Math.random() * 0.15 + 0.05;
    let alpha = Math.random() * 0.2 + 0.05;
    let size = Math.random() * 1.5 + 0.5;

    if (mode === 'advanced') {
      speed = Math.random() * 0.3 + 0.1;
      alpha = Math.random() * 0.28 + 0.05;
    } else if (mode === 'flagship') {
      speed = Math.random() * 0.5 + 0.15;
      alpha = Math.random() * 0.38 + 0.1;
      size = Math.random() * 2.2 + 0.6;
    }

    return {
      x: Math.random() * this.canvasWidth,
      y: randomY ? Math.random() * this.canvasHeight : this.canvasHeight + 10,
      size,
      speed,
      alpha,
      angle: Math.random() * Math.PI * 2,
      life: Math.random() * 1000,
      wavePhase: Math.random() * Math.PI * 2,
      waveSpeed: Math.random() * 0.015 + 0.005,
      waveAmp: Math.random() * 1.2 + 0.3
    };
  },

  runStardustAnimationLoop() {
    const loop = () => {
      const ctx = this.bgCtx;
      const mode = this.data.currentMode;

      if (!ctx) return;

      if (mode === 'advanced' || mode === 'flagship') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      } else {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      }

      if (this.touchActive) {
        this.avoidRadius += (140 - this.avoidRadius) * 0.15; 
      } else {
        this.avoidRadius += (0 - this.avoidRadius) * 0.1; 
      }

      for (let i = 0; i < this.bgParticles.length; i++) {
        let p = this.bgParticles[i];
        p.life++;

        if (mode === 'basic') {
          p.y -= p.speed;
          p.x += Math.sin(p.life * 0.005) * 0.1;
        } else if (mode === 'advanced') {
          p.y -= p.speed;
          p.x += Math.sin(p.wavePhase + p.life * p.waveSpeed) * p.waveAmp;
        } else { 
          p.angle += (Math.random() - 0.5) * 0.04;
          const vx = Math.cos(p.angle) * p.speed;
          const vy = Math.sin(p.angle) * p.speed - p.speed * 0.35; 
          p.x += vx;
          p.y += vy;

          if (this.avoidRadius > 1) {
            const dx = this.touchX - p.x;
            const dy = this.touchY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.avoidRadius && dist > 1) {
              const force = (this.avoidRadius - dist) / this.avoidRadius;
              const pushX = (dx / dist) * force * 1.5;
              const pushY = (dy / dist) * force * 1.5;
              p.x -= pushX;
              p.y -= pushY;
            }
          }
        }

        if (p.y < -30 || p.x < -30 || p.x > this.canvasWidth + 30 || p.y > this.canvasHeight + 30) {
          this.bgParticles[i] = this.createStardustParticle(false);
          p = this.bgParticles[i];
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (mode === 'flagship') {
          ctx.fillStyle = `rgba(255, 181, 152, ${p.alpha * 0.95})`; 
        } else if (mode === 'advanced') {
          ctx.fillStyle = `rgba(180, 180, 180, ${p.alpha * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(160, 160, 160, ${p.alpha})`;
        }
        ctx.fill();
      }

      this.bgAnimId = this.bgCanvasNode.requestAnimationFrame(loop);
    };

    loop();
  },

  handleTouchStart(e) {
    if (this.data.currentMode !== 'flagship' || !e.touches[0]) return;
    this.touchX = e.touches[0].x;
    this.touchY = e.touches[0].y;
    this.touchActive = true;
  },

  handleTouchMove(e) {
    if (this.data.currentMode !== 'flagship' || !e.touches[0]) return;
    this.touchX = e.touches[0].x;
    this.touchY = e.touches[0].y;
  },

  handleTouchEnd() {
    this.touchActive = false;
  },

  // ========================================================
  // CANVAS 2D FX EXPLOSIONS ENGINE
  // ========================================================
  initFxExplosionCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#fx-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = app.globalData.pixelRatio || 2;

        this.fxCanvasNode = canvas;
        this.fxCtx = ctx;

        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
      });
  },

  triggerExplosionParticles(x, y, mode) {
    const ctx = this.fxCtx;
    if (!ctx) return;

    let count = 25; 
    let decayMin = 0.015;
    let decayMax = 0.035;
    let sizeMax = 3.5;
    let velocityScale = 5;

    if (mode === 'advanced') {
      count = 50;
      sizeMax = 4.8;
      velocityScale = 7;
    } else if (mode === 'flagship') {
      count = 85;
      sizeMax = 6.0;
      velocityScale = 10;
      decayMin = 0.01;
      decayMax = 0.025;
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * velocityScale + 2.5;
      const decay = Math.random() * (decayMax - decayMin) + decayMin;
      const size = Math.random() * sizeMax + 1.2;
      const hue = Math.random() * 25 + 10; 

      this.fxParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 1.0,
        decay,
        color: `hsla(${hue}, 100%, 65%, `
      });
    }

    if (!this.fxAnimId) {
      this.runFxExplosionLoop();
    }
  },

  runFxExplosionLoop() {
    const loop = () => {
      const ctx = this.fxCtx;
      if (!ctx) return;

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (let i = this.fxParticles.length - 1; i >= 0; i--) {
        let p = this.fxParticles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= p.decay;
        p.size *= 0.97;

        if (p.life <= 0 || p.size <= 0.2) {
          this.fxParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.life + ')';
        ctx.fill();
      }

      if (this.fxParticles.length > 0) {
        this.fxAnimId = this.fxCanvasNode.requestAnimationFrame(loop);
      } else {
        this.fxAnimId = null;
      }
    };

    loop();
  }
});
