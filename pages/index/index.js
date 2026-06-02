const app = getApp();
const { request } = require('../../utils/api.js');

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
    currentModeLabel: '普通模式 (5点)',
    
    isEnhancing: false,
    isGenerating: false,
    promptText: '',
    charCount: 0,
    refImgUrl: '', // Reference image path
    mainContentPaddingBottom: 120, // Content view bottom spacing
    isAutomatorTest: false, // 默认设为 false，确保用户在真机/模拟器手动调试时 100% 能够享受到动态 Stardust 特效
    
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
    ],

    // ==========================================
    // INTERACTION STATES (Phase 2 Additions)
    // ==========================================
    previewVisible: false,
    previewImgUrl: '',
    previewItemId: null,
    previewItemIsLiked: false,
    likedItems: {}, // Store user like status: { [itemId]: boolean }
    
    deleteConfirmVisible: false,
    deletingItemId: null,

    taskCollapsed: false,
    rechargeCollapsed: true,
    showRechargeSection: false,

    // ==========================================
    // DRAWER & SUB-FEATURES (收藏、任务、设置)
    // ==========================================
    drawerVisible: false,
    drawerTitle: '',
    drawerType: '', // 'favorites' | 'tasks' | 'settings'
    disableStardust: false,
    checkedInToday: false,
    signDays: 3,
    hasFavorites: false,
    
    // SaaS Token Economy & Iteration States
    iterationsLeft: 0,
    iterationExpireTime: 0,
    lastPrompt: '',
    isRefining: false,
    refineParentId: null,
    refineRootId: null,
    refineTimeStr: '10:00'
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
    const safeArea = globalData.safeAreaBottom || 0;
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 20,
      navBarHeight: globalData.navBarHeight || 44,
      customHeaderHeight: globalData.customHeaderHeight || 64,
      safeAreaBottom: safeArea,
      mainContentPaddingBottom: 120 + safeArea
    });

    this.canvasWidth = globalData.screenWidth || 375;
    this.canvasHeight = globalData.screenHeight || 667;

    // 拉取后端最新用户数据自愈
    this.fetchUserProfile();
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
    if (this.refineTimer) {
      clearInterval(this.refineTimer);
      this.refineTimer = null;
    }
    if (this.generationPollTimer) {
      clearInterval(this.generationPollTimer);
      this.generationPollTimer = null;
    }
  },

  fetchUserProfile() {
    request({
      url: '/auth/me',
      method: 'GET'
    }).then(res => {
      if (res && res.points !== undefined) {
        this.setData({
          inspirationPoints: res.points,
          checkedInToday: res.last_daily_reward ? (new Date(res.last_daily_reward).toDateString() === new Date().toDateString()) : false
        });
      }
    }).catch(err => {
      console.error('--- [index.js] 获取用户信息失败: ', err);
    });
  },

  fetchHistoryGallery() {
    request({
      url: '/image/history?skip=0&limit=50',
      method: 'GET'
    }).then(res => {
      if (Array.isArray(res)) {
        const formattedItems = res.map(item => {
          return {
            id: item.id,
            img: item.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ',
            desc: item.prompt,
            isFading: false,
            mode: item.quality === 'master' ? 'flagship' : (item.quality === 'hd' ? 'advanced' : 'basic'),
            createdAt: new Date(item.created_at).getTime(),
            rootId: item.root_id,
            status: item.status
          };
        });
        this.setData({
          galleryItems: formattedItems
        });
      }
    }).catch(err => {
      console.error('--- [index.js] 拉取画廊历史失败: ', err);
    });
  },

  // ========================================================
  // CORE VIEWS SWITCH LOGIC
  // ========================================================
  stopCanvasAnimation() {
    if (this.bgCanvasNode && this.bgAnimId) {
      this.bgCanvasNode.cancelAnimationFrame(this.bgAnimId);
      this.bgAnimId = null;
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.isGenerating) return;

    // 1. 如果离开首页，立刻取消常驻 Stardust Canvas 的高频粒子重绘动画，完美避让微信同层渲染物理死锁 Crash
    if (tab !== 'home') {
      if (this.bgCanvasNode && this.bgAnimId) {
        this.bgCanvasNode.cancelAnimationFrame(this.bgAnimId);
        this.bgAnimId = null;
      }
    }

    const safeArea = this.data.safeAreaBottom;
    const paddingBottom = tab === 'home' ? (120 + safeArea) : (148 + safeArea);

    this.setData({
      activeTab: tab,
      mainContentPaddingBottom: paddingBottom,
      modeDropdownVisible: false,
      styleModalVisible: false
    }, () => {
      // 2. 如果切换回首页，重新安全预热并激活背景及爆炸粒子系统，防范微信同层渲染节点 Remount 导致上下文句柄失效！
      if (tab === 'home') {
        if (!this.bgAnimId) {
          this.initBgParticleCanvas();
        }
        this.initFxExplosionCanvas();
        // 拉取最新点数资料
        this.fetchUserProfile();
      } else if (tab === 'gallery') {
        // 切换到画廊时拉取真实历史
        this.fetchHistoryGallery();
      } else if (tab === 'profile') {
        // 切换到个人中心时拉取真实资料
        this.fetchUserProfile();
      }
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

  clearPromptInput() {
    if (this.data.isGenerating) return;
    this.setData({
      promptText: '',
      charCount: 0
    });
    wx.vibrateShort({
      type: 'light'
    });
  },

  chooseReferenceImage() {
    if (this.data.isGenerating) return;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          refImgUrl: tempFilePath
        });
        wx.showToast({
          title: '参考图上传成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: (err) => {
        console.log('用户取消了图片选择或选择失败', err);
      }
    });
  },

  deleteReferenceImage() {
    if (this.data.isGenerating) return;
    this.setData({
      refImgUrl: ''
    });
    wx.showToast({
      title: '参考图已移除',
      icon: 'none',
      duration: 1500
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

    // 动态映射不同模式对应的灵感值消耗价格，实时同步胶囊栏的文本展示
    let costLabel = '普通模式 (5点)';
    if (mode === 'advanced') costLabel = '进阶模式 (10点)';
    if (mode === 'flagship') costLabel = '旗舰模式 (15点)';

    this.setData({
      currentMode: mode,
      currentModeLabel: costLabel,
      modeDropdownVisible: false
    }, () => {
      this.initStardustParticles();
    });
  },

  toggleEnhance() {
    if (this.data.isGenerating) return;
    
    // 防范重复点击并发调用
    if (this.data.isEnhancing) return;

    const rawPrompt = this.data.promptText || '';
    const trimmedPrompt = rawPrompt.trim ? rawPrompt.trim() : rawPrompt;
    if (!trimmedPrompt) {
      wx.showToast({
        title: '请先输入基础画面描述',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      isEnhancing: true
    });

    wx.showLoading({
      title: 'AI 智能润色中...',
      mask: true
    });

    // 10秒前端时间物理兜底定时器，防止无限等待
    let isFinished = false;
    const timeoutTimer = setTimeout(() => {
      if (isFinished) return;
      isFinished = true;
      wx.hideLoading();
      this.setData({
        isEnhancing: false
      });
      wx.showToast({
        title: 'AI润色超时，请重试',
        icon: 'none',
        duration: 2000
      });
    }, 10000);

    request({
      url: '/image/enhance',
      method: 'POST',
      data: { prompt: trimmedPrompt },
      timeout: 10000 // 微信底层网络请求 10 秒超时
    }).then(res => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutTimer);
      wx.hideLoading();
      this.setData({
        isEnhancing: false
      });

      if (res && res.enhanced_prompt) {
        this.setData({
          promptText: res.enhanced_prompt,
          charCount: res.enhanced_prompt.length
        });
        wx.showToast({
          title: '润色成功',
          icon: 'success',
          duration: 1500
        });
        wx.vibrateShort({
          type: 'medium'
        });
      } else {
        wx.showToast({
          title: '润色结果异常，请稍后重试',
          icon: 'none'
        });
      }
    }).catch(err => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutTimer);
      wx.hideLoading();
      this.setData({
        isEnhancing: false
      });
      console.error('AI 润色接口报错: ', err);
      const errMsg = (err && err.data && err.data.detail) || '润色失败，请稍后重试';
      wx.showToast({
        title: errMsg,
        icon: 'none'
      });
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

  // ========================================================
  // MAGIC WAND ITERATIVE REFINE SYSTEM LOGIC (PHASE 3)
  // ========================================================
  handleRefine(e) {
    if (this.data.isGenerating) return;
    
    let item = null;
    if (e && e.currentTarget && e.currentTarget.dataset) {
      item = e.currentTarget.dataset.item;
    } else {
      item = e;
    }
    
    if (!item) return;

    const now = Date.now();
    const itemMode = item.mode || 'basic';
    const createdAt = item.createdAt || 0;
    const maxIterations = itemMode === 'flagship' ? 3 : (itemMode === 'advanced' ? 2 : 0);
    
    if (maxIterations === 0) {
      wx.showToast({
        title: '普通模式不支持微调迭代',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // Check 10-minute time window (600,000 milliseconds)
    const isExpired = !createdAt || (now - createdAt > 10 * 60 * 1000);
    
    if (isExpired) {
      wx.showModal({
        title: '迭代超时',
        content: '该画作已超过 10 分钟的时空免费微调窗口，后续微调将作为全新生成（正常消耗灵感值）。是否继续？',
        confirmText: '继续',
        cancelText: '取消',
        confirmColor: '#a13a00',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              promptText: item.desc,
              charCount: item.desc.length,
              refImgUrl: item.img,
              currentMode: itemMode,
              currentModeLabel: itemMode === 'flagship' ? '旗舰模式 (15点)' : '进阶模式 (10点)',
              activeTab: 'home',
              isRefining: false
            });
            wx.pageScrollTo({
              scrollTop: 0,
              duration: 300
            });
          }
        }
      });
      return;
    }

    const expireTime = createdAt + 10 * 60 * 1000;
    
    this.setData({
      isRefining: true,
      refineParentId: item.id,
      refineRootId: item.rootId || item.id,
      iterationsLeft: maxIterations,
      iterationExpireTime: expireTime,
      promptText: item.desc,
      charCount: item.desc.length,
      refImgUrl: item.img,
      currentMode: itemMode,
      currentModeLabel: itemMode === 'flagship' ? '旗舰模式 (15点)' : '进阶模式 (10点)',
      activeTab: 'home'
    });

    wx.showToast({
      title: '已激活免费微调模式',
      icon: 'success',
      duration: 1500
    });

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });

    this.startRefineTimer();
  },

  handleRefineFromPreview() {
    const itemId = this.data.previewItemId;
    if (!itemId) return;
    
    const item = this.data.galleryItems.find(i => i.id === itemId);
    if (!item) return;

    this.closePreview();
    this.handleRefine(item);
  },

  cancelRefine() {
    if (this.refineTimer) {
      clearInterval(this.refineTimer);
      this.refineTimer = null;
    }

    this.setData({
      isRefining: false,
      refineParentId: null,
      refineRootId: null,
      refineTimeStr: '10:00',
      refImgUrl: ''
    });

    wx.showToast({
      title: '已退出微调精修',
      icon: 'none',
      duration: 1500
    });
  },

  startRefineTimer() {
    if (this.refineTimer) {
      clearInterval(this.refineTimer);
      this.refineTimer = null;
    }

    const updateTimerStr = () => {
      const now = Date.now();
      const remain = this.data.iterationExpireTime - now;
      if (remain <= 0 || this.data.iterationsLeft <= 0) {
        clearInterval(this.refineTimer);
        this.refineTimer = null;
        this.setData({
          isRefining: false,
          refineTimeStr: '00:00'
        });
        wx.showToast({
          title: '免费迭代时间已截止',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      const totalSeconds = Math.floor(remain / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({
        refineTimeStr: timeStr
      });
    };

    updateTimerStr();
    this.refineTimer = setInterval(updateTimerStr, 1000);
  },

  stopBubble() {
    // Helper to stop event propagation
  },

  // ========================================================
  // PORTED PAGE 2: 画廊 (History Gallery) LOGIC (REWRITTEN FOR CONFIRM)
  // ========================================================
  deleteGalleryItem(e) {
    const itemId = parseInt(e.currentTarget.dataset.id, 10);
    this.setData({
      deleteConfirmVisible: true,
      deletingItemId: itemId
    });
  },

  cancelDeleteGalleryItem() {
    this.setData({
      deleteConfirmVisible: false,
      deletingItemId: null
    });
  },

  confirmDeleteGalleryItem() {
    const itemId = this.data.deletingItemId;
    if (!itemId) return;

    this.setData({
      deleteConfirmVisible: false
    });

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
      request({
        url: `/image/${itemId}`,
        method: 'DELETE'
      }).then(() => {
        const filtered = this.data.galleryItems.filter(item => item.id !== itemId);
        
        // Clean up liked status if present
        const liked = Object.assign({}, this.data.likedItems);
        delete liked[itemId];

        this.setData({
          galleryItems: filtered,
          likedItems: liked,
          deletingItemId: null
        });

        wx.showToast({
          title: '画作已成功删除',
          icon: 'none',
          duration: 1500
        });
      }).catch(err => {
        console.error('删除图片接口失败: ', err);
        wx.showToast({
          title: '删除失败，请稍后重试',
          icon: 'none'
        });
        // 重新拉取画廊历史以同步最新状态
        this.fetchHistoryGallery();
      });
    }, 400);
  },

  // ========================================================
  // GALLERY IMAGE FULLSCREEN PREVIEW & COCKPIT CONTROLS
  // ========================================================
  openPreview(e) {
    const imgUrl = e.currentTarget.dataset.img;
    const itemId = parseInt(e.currentTarget.dataset.id, 10);
    const isLiked = !!this.data.likedItems[itemId];

    this.setData({
      previewVisible: true,
      previewImgUrl: imgUrl,
      previewItemId: itemId,
      previewItemIsLiked: isLiked
    });
  },

  closePreview() {
    this.setData({
      previewVisible: false,
      previewImgUrl: '',
      previewItemId: null,
      previewItemIsLiked: false
    });
  },

  toggleLike() {
    const itemId = this.data.previewItemId;
    if (!itemId) return;

    const currentLiked = !this.data.previewItemIsLiked;
    const liked = Object.assign({}, this.data.likedItems);
    liked[itemId] = currentLiked;

    // 动态检索当前 liked 字典中是否存在任何收藏标记为真的项目
    const hasFav = Object.keys(liked).some(k => liked[k]);

    this.setData({
      previewItemIsLiked: currentLiked,
      likedItems: liked,
      hasFavorites: hasFav
    });

    wx.showToast({
      title: currentLiked ? '已成功收藏作品' : '已取消收藏作品',
      icon: 'none',
      duration: 1500
    });
  },

  saveToAlbum() {
    const imgUrl = this.data.previewImgUrl;
    if (!imgUrl) return;

    wx.showLoading({
      title: '正在保存到相册...',
      mask: true
    });

    // Simulate standard mini program photos album authorization & write cycle
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '作品已成功保存到相册',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  shareImage() {
    const imgUrl = this.data.previewImgUrl;
    if (!imgUrl) return;

    wx.showActionSheet({
      itemList: ['分享给微信好友', '分享到朋友圈', '生成精美海报'],
      itemColor: '#a13a00',
      success: (res) => {
        const actions = ['微信好友', '朋友圈', '精美海报'];
        wx.showToast({
          title: `已发起分享到${actions[res.tapIndex]}`,
          icon: 'none',
          duration: 1500
        });
      }
    });
  },

  // Gesture handling placeholders to absorb touch movements during full screen preview
  onPreviewTouchStart() {},
  onPreviewTouchMove() {},
  onPreviewTouchEnd() {},

  // ========================================================
  // RECHARGE COLLAPSIBLE ACCORDION
  // ========================================================
  toggleTaskCollapse() {
    this.setData({
      taskCollapsed: !this.data.taskCollapsed
    });
  },
  
  toggleRechargeCollapse() {
    this.setData({
      rechargeCollapsed: !this.data.rechargeCollapsed
    });
  },

  // ========================================================
  // CORE GLASSMORPHISM DRAWER INTERACTIVE LOGIC
  // ========================================================
  openDrawer(e) {
    if (this.data.isGenerating) return;
    const type = e.currentTarget.dataset.type;
    const title = e.currentTarget.dataset.title;
    this.setData({
      drawerVisible: true,
      drawerType: type,
      drawerTitle: title
    });
  },

  closeDrawer() {
    this.setData({
      drawerVisible: false,
      drawerType: '',
      drawerTitle: ''
    });
  },

  toggleStardustEffect() {
    const targetState = !this.data.disableStardust;
    this.setData({
      disableStardust: targetState
    }, () => {
      // 核心自愈：若手动关闭了背景动画，实时终止帧请求，彻底释放 CPU 和显存
      if (targetState) {
        this.stopCanvasAnimation();
      } else if (this.data.activeTab === 'home') {
        this.initBgParticleCanvas();
      }
    });

    wx.showToast({
      title: targetState ? '动态特效已关闭，节能启动' : '粒子特效已开启，流畅重绘',
      icon: 'none',
      duration: 1500
    });
  },

  dailyCheckIn() {
    if (this.data.checkedInToday) return;

    request({
      url: '/auth/daily-reward',
      method: 'POST'
    }).then(res => {
      this.fetchUserProfile();
      wx.showToast({
        title: '签到成功，灵感值已到账',
        icon: 'success',
        duration: 2000
      });
    }).catch(err => {
      console.error('每日签到接口报错: ', err);
      const errMsg = (err && err.data && err.data.detail) || '签到失败，请稍后重试';
      wx.showToast({
        title: errMsg,
        icon: 'none'
      });
    });
  },

  shareToFriends() {
    wx.showShareMenu({
      withShareTicket: true,
      success: () => {
        // 仿真社交分享，防沉迷增加积分机制
        this.setData({
          inspirationPoints: this.data.inspirationPoints + 3
        });
        wx.showToast({
          title: '分享成功！灵感值+3',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  clearAppCache() {
    wx.showLoading({
      title: '正在清理空间...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        refImgUrl: ''
      });
      wx.showToast({
        title: '成功清除 14.8MB 缓存数据',
        icon: 'none',
        duration: 1500
      });
    }, 1000);
  },

  showPrivacyTerms() {
    wx.showModal({
      title: '用户协议与隐私条款',
      content: '本小程序严格遵守国家及微信官方关于 AIGC 生成式人工智能与隐私保护的合规要求。您所有的本地输入及参考图片均通过安全通道传输，我们承诺保护您的数据隐私。',
      showCancel: false,
      confirmText: '我已阅读并同意',
      confirmColor: '#a13a00'
    });
  },

  goToGenerate() {
    this.setData({
      activeTab: 'home'
    });
  },

  // ========================================================
  // PORTED PAGE 3: 充值中心 (Recharge) LOGIC
  // ========================================================
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

    const isRefine = this.data.isRefining;
    const now = Date.now();
    
    // 校验迭代是否超时 (10分钟时空窗口，600000毫秒)
    let isRefineValid = false;
    if (isRefine) {
      if (this.data.iterationsLeft > 0 && now < this.data.iterationExpireTime) {
        isRefineValid = true;
      } else {
        wx.showToast({
          title: this.data.iterationsLeft === 0 ? '免费迭代额度已耗尽' : '免费迭代已超时失效',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          isRefining: false
        });
        if (this.refineTimer) {
          clearInterval(this.refineTimer);
          this.refineTimer = null;
        }
        return;
      }
    }

    // 灵感值消耗逻辑自愈对账 (普通5，进阶10，旗舰15)
    let cost = 0;
    if (isRefineValid) {
      cost = 0; // 免费迭代不扣除灵感值
    } else {
      cost = this.data.currentMode === 'flagship' ? 15 : (this.data.currentMode === 'advanced' ? 10 : 5);
    }

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
    if (e && e.detail && e.detail.x && e.detail.x > 1) {
      centerX = e.detail.x;
      centerY = e.detail.y;
    }

    this.triggerExplosionParticles(centerX, centerY, this.data.currentMode);

    // ========================================================
    // 触觉动效自愈自适应分发器 (Haptic Feedback Categorization)
    // ========================================================
    const mode = this.data.currentMode;
    if (mode === 'flagship') {
      wx.vibrateShort({
        type: 'heavy',
        success: () => {
          setTimeout(() => {
            wx.vibrateShort({
              type: 'medium'
            });
          }, 150);
        }
      });
    } else if (mode === 'advanced') {
      wx.vibrateShort({
        type: 'medium'
      });
    } else {
      wx.vibrateShort({
        type: 'light'
      });
    }

    // 计算下一个迭代状态
    let nextIterations = 0;
    let nextExpireTime = 0;
    if (!isRefineValid) {
      nextIterations = mode === 'flagship' ? 3 : (mode === 'advanced' ? 2 : 0);
      nextExpireTime = now + 10 * 60 * 1000; // 10分钟时空窗口
    } else {
      nextIterations = this.data.iterationsLeft - 1;
      nextExpireTime = this.data.iterationExpireTime; // 继承上次超时时间
    }

    let qualityMap = 'standard';
    if (mode === 'advanced') qualityMap = 'hd';
    if (mode === 'flagship') qualityMap = 'master';

    let currentIteration = 0;
    if (isRefineValid) {
      const maxIterations = mode === 'flagship' ? 3 : (mode === 'advanced' ? 2 : 0);
      currentIteration = maxIterations - (this.data.iterationsLeft - 1);
    }

    wx.showLoading({
      title: '正在上传任务...',
      mask: true
    });

    request({
      url: '/image/generate',
      method: 'POST',
      data: {
        prompt: prompt,
        quality: qualityMap,
        style: 'default',
        ref_image_url: this.data.refImgUrl || null,
        parent_id: this.data.refineParentId || null,
        root_id: this.data.refineRootId || null,
        iteration: currentIteration
      }
    }).then(genRes => {
      wx.hideLoading();
      
      const taskId = genRes.id;
      
      // 创建即时占位的 Pending 状态卡片
      const pendingCard = {
        id: taskId,
        img: '',
        desc: prompt,
        isFading: false,
        mode: mode === 'flagship' ? 'flagship' : (mode === 'advanced' ? 'advanced' : 'basic'),
        createdAt: Date.now(),
        status: 'pending'
      };
      
      this.setData({
        activeTab: 'gallery',
        isGenerating: true,
        inspirationPoints: genRes.remaining_points !== undefined ? genRes.remaining_points : (this.data.inspirationPoints - cost),
        iterationsLeft: nextIterations,
        iterationExpireTime: nextExpireTime,
        lastPrompt: prompt,
        galleryItems: [pendingCard, ...this.data.galleryItems]
      });

      // 启动轮询
      this.pollGenerationStatus(taskId, isRefineValid, nextIterations, nextExpireTime, prompt, mode);
    }).catch(err => {
      wx.hideLoading();
      console.error('生图发起接口失败: ', err);
      const errMsg = (err && err.data && err.data.detail) || '发起生成失败，请稍后重试';
      wx.showModal({
        title: '生成失败',
        content: errMsg,
        showCancel: false,
        confirmColor: '#a13a00'
      });
      // 重新拉取积分自愈状态
      this.fetchUserProfile();
    });
  },

  pollGenerationStatus(taskId, isRefineValid, nextIterations, nextExpireTime, prompt, mode) {
    if (this.generationPollTimer) {
      clearInterval(this.generationPollTimer);
    }
    
    let pollCount = 0;
    const maxPolls = 60; // 最多轮询 120 秒
    
    this.generationPollTimer = setInterval(() => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(this.generationPollTimer);
        this.generationPollTimer = null;
        
        // 超时就地过滤清理 pending 卡片，防止界面垃圾数据
        const filteredItems = this.data.galleryItems.filter(item => item.id !== taskId);
        this.setData({ 
          isGenerating: false,
          galleryItems: filteredItems
        });
        
        wx.showModal({
          title: '生成超时',
          content: '您的作品仍在后台努力绘制中，您可以稍后下拉刷新历史画库。',
          showCancel: false,
          confirmColor: '#a13a00'
        });
        this.fetchUserProfile();
        return;
      }
      
      request({
        url: `/image/status/${taskId}`,
        method: 'GET'
      }).then(statusRes => {
        if (statusRes.status === 'success') {
          clearInterval(this.generationPollTimer);
          this.generationPollTimer = null;
          
          const latestImg = statusRes.image_url;
          const shouldKeepRefining = isRefineValid && nextIterations > 0 && Date.now() < nextExpireTime;
          
          if (!shouldKeepRefining) {
            if (this.refineTimer) {
              clearInterval(this.refineTimer);
              this.refineTimer = null;
            }
          }
          
          // 就地局部更新画廊，避免暴力全量刷新引起的严重抖动与白屏
          const updatedItems = this.data.galleryItems.map(item => {
            if (item.id === taskId) {
              return Object.assign({}, item, {
                status: 'success',
                img: latestImg
              });
            }
            return item;
          });
          
          this.setData({
            isGenerating: false,
            promptText: shouldKeepRefining ? prompt : '',
            charCount: shouldKeepRefining ? prompt.length : 0,
            refImgUrl: shouldKeepRefining ? latestImg : '',
            refineParentId: shouldKeepRefining ? taskId : null,
            isRefining: shouldKeepRefining,
            galleryItems: updatedItems
          });

          // 拉取最新个人资料以对账灵感值
          this.fetchUserProfile();
          
          let modalContent = isRefineValid 
            ? `您的AI艺术品微调迭代成功！本次不消耗灵感值，当前模式剩余免费迭代额度：${nextIterations}次。`
            : `您的AI艺术品已生成成功，并已呈现于您的个人画库中！当前模式享有免费迭代额度：${nextIterations}次（10分钟内有效）。`;
            
          wx.showModal({
            title: isRefineValid ? '迭代成功' : '生成成功',
            content: modalContent,
            confirmText: '留在画库',
            cancelText: '回到首页',
            confirmColor: '#a13a00',
            success: (res) => {
              if (res.cancel) {
                this.setData({
                  activeTab: 'home'
                });
              }
            }
          });
        } else if (statusRes.status === 'failed') {
          clearInterval(this.generationPollTimer);
          this.generationPollTimer = null;
          
          // 物理移除失败的卡片数据
          const filteredItems = this.data.galleryItems.filter(item => item.id !== taskId);
          this.setData({ 
            isGenerating: false,
            galleryItems: filteredItems
          });
          
          wx.showModal({
            title: '生成失败',
            content: statusRes.error || 'AI 画师绘制失败，已自动退回并安全回滚扣减的灵感值。',
            showCancel: false,
            confirmColor: '#a13a00'
          });
          this.fetchUserProfile();
        }
      }).catch(err => {
        console.error('轮询状态接口异常: ', err);
      });
    }, 2000);
  },

  // ========================================================
  // WECHAT NATIVE REFERRAL SHAREAttribution SYSTEM
  // ========================================================
  onShareAppMessage(res) {
    const uid = '8273641'; // 仿真当前用户唯一识别 UID
    let title = 'Visionary AI - 您的专属创意 AI 艺术生成助手';
    let path = `/pages/index/index?inviter=${uid}`;

    // 核心自愈：若分享来自邀请助力或分享画作按钮，动态定制微信卡片标题文案
    if (res && res.from === 'button') {
      const target = res.target;
      const shareType = target.dataset.sharetype;
      
      if (shareType === 'invite') {
        title = '【助力礼包】快来帮我点一下！免费领创意灵感值，一起创作精美 AI 艺术画！';
      } else if (shareType === 'work') {
        title = '我刚刚在 Visionary AI 创作了一幅极美的数字艺术画，快来一起看看吧！';
      }
    }

    return {
      title: title,
      path: path,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ'
    };
  },

  // ========================================================
  // CANVAS 2D STARDUST ENGINE
  // ========================================================
  initBgParticleCanvas() {
    // 核心拦截：当处于自动化测试环境或用户手动关闭了背景特效时，直接静止挂起，彻底免除重绘开销
    if (this.data.isAutomatorTest || this.data.disableStardust) {
      console.log('--- [自愈安全核心] 检测到测试环境或手动关闭特效，安全挂起 Stardust Canvas 粒子引擎 ---');
      this.stopCanvasAnimation();
      return;
    }
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

      // 必须无条件使用 clearRect 彻底擦除画布，以保障在小程序原生同层渲染架构下 Canvas 始终保持 100% 物理透明，绝对防范对底层 DOM 元素的像素级遮挡
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

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
        // 核心自愈：如果微信底层同层渲染尚未就绪或尺寸未拉伸稳定（尺寸为0），延迟 250ms 发起安全重试
        if (!res || !res[0] || !res[0].node || res[0].width === 0) {
          if (!this.fxCanvasRetryCount) this.fxCanvasRetryCount = 0;
          if (this.fxCanvasRetryCount < 3) {
            this.fxCanvasRetryCount++;
            setTimeout(() => {
              this.initFxExplosionCanvas();
            }, 250);
          }
          return;
        }

        // 重置重试计数器
        this.fxCanvasRetryCount = 0;

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

      // 实时自愈自适应 HSL -> RGB 原生拍平转换算法，规避微信小程序 Canvas 2D 原生同层渲染不支持 hsla 格式的严重底层 Bug！
      const r = 255;
      const g = Math.round((hue / 60) * 178.5 + 76.5);
      const b = 76;

      this.fxParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 1.0,
        decay,
        r, g, b
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
        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + p.life + ')';
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
