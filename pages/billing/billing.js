const app = getApp();
const { request } = require('../../utils/api.js');

Page({
  data: {
    statusBarHeight: 20,
    safeAreaBottom: 0,
    logs: [],
    isLoading: true,
    isRefreshing: false
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      safeAreaBottom: sysInfo.safeAreaInsets ? sysInfo.safeAreaInsets.bottom : 0
    });
    this.fetchBillingHistory();
  },

  navBack() {
    wx.navigateBack();
  },

  onRefresh() {
    this.fetchBillingHistory(() => {
      this.setData({ isRefreshing: false });
    });
  },

  fetchBillingHistory(callback) {
    this.setData({ isLoading: true });
    
    request({
      url: '/billing/history',
      method: 'GET'
    }).then(res => {
      if (res.status === 'success') {
        this.setData({
          logs: res.data || [],
          isLoading: false
        });
      } else {
        this.setData({ isLoading: false });
      }
    }).catch(err => {
      console.error('拉取账单失败:', err);
      this.setData({ isLoading: false });
    }).finally(() => {
      if (callback) callback();
    });
  }
});
