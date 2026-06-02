App({
  onLaunch() {
    this.calculateSystemDimensions();
  },

  calculateSystemDimensions() {
    const sysInfo = wx.getSystemInfoSync() || {};
    const statusBarHeight = sysInfo.statusBarHeight || 20;

    let capsuleInfo = {};
    try {
      capsuleInfo = wx.getMenuButtonBoundingClientRect();
    } catch (e) {
      // Safe fallback if API fails
      capsuleInfo = {
        top: statusBarHeight + 4,
        bottom: statusBarHeight + 36,
        left: (sysInfo.screenWidth || 375) - 95,
        right: (sysInfo.screenWidth || 375) - 7,
        width: 88,
        height: 32
      };
    }

    // Calculate navbar overall height
    // Bounding Box top to status bar represents vertical gap. Double this gap and add the height of the capsule.
    const gap = capsuleInfo.top - statusBarHeight;
    const navBarHeight = capsuleInfo.height + (gap * 2);
    const customHeaderHeight = statusBarHeight + navBarHeight;

    this.globalData = {
      statusBarHeight,
      navBarHeight,
      customHeaderHeight,
      capsuleInfo,
      screenWidth: sysInfo.screenWidth || 375,
      screenHeight: sysInfo.screenHeight || 667,
      pixelRatio: sysInfo.pixelRatio || 2,
      safeAreaBottom: sysInfo.safeArea ? (sysInfo.screenHeight - sysInfo.safeArea.bottom) : 0
    };
  },

  globalData: {
    statusBarHeight: 20,
    navBarHeight: 44,
    customHeaderHeight: 64,
    capsuleInfo: null,
    screenWidth: 375,
    screenHeight: 667,
    pixelRatio: 2,
    safeAreaBottom: 0
  }
});
