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
    galleryItems: [],

    // ==========================================
    // STYLE SELECTION DECOUPLED STATE & CONFIG
    // ==========================================
    selectedStyleId: 'default',
    selectedStyleName: '默认风格',
    styles: [
      { id: 'default', name: '默认风格', desc: '原生艺术呈现', pts: 'All', hint: '描述你想生成的画面', cssClass: 'style-default' },
      { id: 'real', name: '极致写实', desc: '仿真现实模拟', pts: 'All', hint: '描述人像或场景', cssClass: 'style-real' },
      { id: 'product', name: '商业大片', desc: '商业海报质感', pts: 'All', hint: '输入产品名称', cssClass: 'style-product' },
      { id: 'tech_poster', name: '科技海报', desc: '高级感信息排版', pts: 'All', hint: '输入海报主题', cssClass: 'style-tech-poster' },
      { id: 'travel_guide', name: '旅游攻略', desc: '手绘旅行手账', pts: 'All', hint: '如：大理 @ 3天', cssClass: 'style-travel-guide', recommendedRatio: '9:16' },
      { id: 'travel', name: '旅游海报', desc: '旅行杂志封面', pts: 'All', hint: '如：京都极简小巷，海岛日落', cssClass: 'style-travel', recommendedRatio: '9:16' },
      { id: 'vintage_5s', name: '复古纪实', desc: 'iPhone 5s 怀旧', pts: 'All', hint: '如：90年代香港中环', cssClass: 'style-vintage-5s', requiresImage: true, recommendedRatio: '9:16' },
      { id: 'restore_old', name: '老照片修复', desc: '质感修复高清还原', pts: 'All', hint: '输入需要重点修复的细节', cssClass: 'style-restore-old', requiresImage: true },
      { id: 'interior', name: '室内设计', desc: '空间重构方案', pts: 'HD+', hint: '如：现代极简、北欧风、日式', cssClass: 'style-interior', requiresImage: true, recommendedRatio: '16:9' },
      { id: 'product_detail', name: '详情页设计', desc: '复古简约商业视觉', pts: 'HD+', hint: '输入产品名称', cssClass: 'style-product-detail', recommendedRatio: '9:16' },
      { id: 'live_stream', name: '直播截图', desc: '还原带货现场', pts: 'HD+', hint: '输入直播内容', cssClass: 'style-live-stream', requiresImage: true, recommendedRatio: '16:9' },
      { id: 'ccd_snap', name: 'CCD 抓拍', desc: '闪光灯氛围', pts: 'HD+', hint: '如：深夜旺角街头', cssClass: 'style-ccd-snap', requiresImage: true, recommendedRatio: '9:16' },
      { id: 'eri_silhouette', name: '轮廓宇宙', desc: '史诗级叙事海报', pts: 'Master', hint: '输入叙事主题', cssClass: 'style-eri-silhouette' },
      { id: 'silk_road', name: '国风月夜', desc: '宋代山水意境', pts: 'Master', hint: '输入主题名称', cssClass: 'style-silk-road' },
      { id: 'relation_map', name: '关系图谱', desc: '作品逻辑关系梳理', pts: 'Master', hint: '如：三体、哈利波特', cssClass: 'style-relation-map', recommendedRatio: '9:16' },
      { id: 'encyclopedia', name: '博物馆图鉴', desc: '文博拆解信息图', pts: 'Master', hint: '如：明代铠甲', cssClass: 'style-encyclopedia', recommendedRatio: '9:16' },
      { id: 'knowledge_card', name: '知识图卡', desc: '现代百科科普图鉴', pts: 'Master', hint: '如：黑洞的形成', cssClass: 'style-knowledge-card', recommendedRatio: '9:16' },
      { id: 'ui_upgrade', name: 'UI 视觉进化', desc: '一键转高保真设计', pts: 'Master', hint: '上传截图直接生成', cssClass: 'style-ui-upgrade', requiresImage: true, recommendedRatio: '9:16' },
      { id: 'app_ui_design', name: 'APP UI 设计', desc: 'iOS 原生视觉全案', pts: 'Master', hint: '如：健身社交、咖啡电商', cssClass: 'style-app-ui-design', recommendedRatio: '9:16' },
      { id: 'campaign_poster', name: '运营 activity 页', desc: '移动端运营海报', pts: 'Master', hint: '如：新品首发', cssClass: 'style-campaign-poster', recommendedRatio: '9:16' }
    ],
    filteredStyles: [],

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

    // 初始化并过滤出当前模式下的可见风格
    this.updateFilteredStyles();

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
          let inheritProgress = 0;
          let inheritFading = false;
          const existItem = (this.data.galleryItems || []).find(o => o.id === item.id);
          if (existItem && (existItem.status === 'pending' || existItem.status === 'generating')) {
             inheritProgress = existItem.progress || 0;
             inheritFading = existItem.isFading || false;
          }
          return {
            id: item.id,
            img: item.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ',
            desc: item.prompt,
            isFading: inheritFading,
            mode: item.quality === 'master' ? 'flagship' : (item.quality === 'hd' ? 'advanced' : 'basic'),
            createdAt: new Date(item.created_at).getTime(),
            rootId: item.root_id,
            status: item.status,
            progress: inheritProgress
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

  updateFilteredStyles() {
    // 微信小程序风格列表设计为全量可见，以增强转化并与网站行为对齐
    this.setData({
      filteredStyles: this.data.styles || []
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
    this.setData({
      promptText: '',
      charCount: 0
    });
    wx.vibrateShort({
      type: 'light'
    });
  },

  chooseReferenceImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.showLoading({ title: '处理中...', mask: true });
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (dataRes) => {
            wx.hideLoading();
            const base64Str = 'data:image/jpeg;base64,' + dataRes.data;
            this.setData({
              refImgUrl: base64Str
            });
            wx.showToast({
              title: '参考图上传成功',
              icon: 'success',
              duration: 1500
            });
          },
          fail: (err) => {
            wx.hideLoading();
            console.error('读取图片数据失败', err);
            wx.showToast({
              title: '图片解析失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        console.log('用户取消了图片选择或选择失败', err);
      }
    });
  },

  deleteReferenceImage() {
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
      this.updateFilteredStyles(mode);

      // 级联降级安全校验：若切换到更低档次，且当前风格不属于该模式权限，则重置为默认风格
      const selectedId = this.data.selectedStyleId;
      const currentStyle = this.data.styles.find(s => s.id === selectedId);
      if (currentStyle) {
        if (mode === 'basic' && currentStyle.pts !== 'All') {
          this.setData({
            selectedStyleId: 'default',
            selectedStyleName: '默认风格'
          });
        } else if (mode === 'advanced' && currentStyle.pts === 'Master') {
          this.setData({
            selectedStyleId: 'default',
            selectedStyleName: '默认风格'
          });
        }
      }
    });
  },

  navToBilling() {
    wx.navigateTo({
      url: '/pages/billing/billing'
    });
  },

  toggleEnhance() {
    
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
    const styleId = e.currentTarget.dataset.style;
    const currentSelected = this.data.selectedStyleId;
    
    // 如果点击已选中的，则反选回 default
    const newSelected = currentSelected === styleId ? 'default' : styleId;
    const currentStyleObj = this.data.styles.find(s => s.id === newSelected);
    const styleName = currentStyleObj ? currentStyleObj.name : '默认风格';
    
    const updateObj = {
      selectedStyleId: newSelected,
      selectedStyleName: styleName,
      styleModalVisible: false
    };

    // 选中新风格后，根据其所属的最低模式阶梯，自动升级对应的生图模式
    if (newSelected !== 'default' && currentStyleObj) {
      const pts = currentStyleObj.pts;
      const currentMode = this.data.currentMode;
      
      if (pts === 'Master' && currentMode !== 'flagship') {
        updateObj.currentMode = 'flagship';
        updateObj.currentModeLabel = '旗舰模式 (15点)';
        wx.showToast({
          title: '已自动切换至旗舰模式',
          icon: 'none',
          duration: 1500
        });
      } else if (pts === 'HD+' && currentMode === 'basic') {
        updateObj.currentMode = 'advanced';
        updateObj.currentModeLabel = '进阶模式 (10点)';
        wx.showToast({
          title: '已自动切换至进阶模式',
          icon: 'none',
          duration: 1500
        });
      }
    }

    this.setData(updateObj, () => {
      if (updateObj.currentMode) {
        this.initStardustParticles();
      }
    });
  },

  // ========================================================
  // MAGIC WAND ITERATIVE REFINE SYSTEM LOGIC (PHASE 3)
  // ========================================================
  handleRefine(e) {
    if (this.data.isGenerating) {
      wx.showToast({ title: '当前正在生成，请稍后再微调', icon: 'none' });
      return;
    }
    
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
    if (this.data.isGenerating) {
      wx.showToast({ title: 'AI正在专注为您创作中，请等待上一幅完成', icon: 'none' });
      return;
    }
    if (!prompt) return;

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
        style: this.data.selectedStyleId,
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
        status: 'pending',
        progress: 0
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
    if (this.fakeProgressTimer) {
      clearInterval(this.fakeProgressTimer);
    }
    
    // --- 启动独立的高频平滑缓动算法 (Fake Progress) ---
    this.fakeProgressTimer = setInterval(() => {
      const currentItems = this.data.galleryItems;
      const targetIndex = currentItems.findIndex(item => item.id === taskId);
      
      // 仅当卡片存在且处于等待状态时进行进度动画
      if (targetIndex !== -1 && (currentItems[targetIndex].status === 'pending' || currentItems[targetIndex].status === 'generating')) {
        let currentProgress = currentItems[targetIndex].progress || 0;
        let increment = 1;
        
        // 动态非线性缓动：前期快速攀升，后期陷入长尾等待
        if (currentProgress < 40) increment = Math.floor(Math.random() * 4) + 2; // 2~5
        else if (currentProgress < 70) increment = Math.floor(Math.random() * 3) + 1; // 1~3
        else if (currentProgress < 90) increment = 1;
        else if (currentProgress < 99 && Math.random() > 0.7) increment = 1; // 极大概率停滞，制造真实思考感
        else increment = 0;
        
        if (increment > 0) {
          const key = `galleryItems[${targetIndex}].progress`;
          this.setData({ [key]: Math.min(99, currentProgress + increment) });
        }
      } else {
        // 如果卡片已经被清除或状态已终结，自毁定时器
        clearInterval(this.fakeProgressTimer);
        this.fakeProgressTimer = null;
      }
    }, 800);
    // ------------------------------------------------
    
    let pollCount = 0;
    const maxPolls = 60; // 最多轮询 120 秒
    
    this.generationPollTimer = setInterval(() => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(this.generationPollTimer);
        this.generationPollTimer = null;
        if (this.fakeProgressTimer) {
          clearInterval(this.fakeProgressTimer);
          this.fakeProgressTimer = null;
        }
        
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
          if (this.fakeProgressTimer) {
            clearInterval(this.fakeProgressTimer);
            this.fakeProgressTimer = null;
          }
          
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
                img: latestImg,
                progress: 100
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
          if (this.fakeProgressTimer) {
            clearInterval(this.fakeProgressTimer);
            this.fakeProgressTimer = null;
          }
          
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
