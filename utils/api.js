let BASE_URL = 'https://gpt-image2.xiaoliang.tech/api';

if (typeof wx !== 'undefined' && typeof wx.getAccountInfoSync === 'function') {
  try {
    const accountInfo = wx.getAccountInfoSync();
    const env = accountInfo.miniProgram.envVersion;
    if (env === 'develop') {
      BASE_URL = 'http://localhost:8002/api';
    }

  } catch (e) {
    console.error('获取小程序环境状态失败，降级使用生产域名: ', e);
  }
}
let isRefreshing = false;
let refreshQueue = [];

function request(options = {}) {
  const token = wx.getStorageSync('token');
  const headers = Object.assign({}, options.header || {}, {
    'content-type': 'application/json'
  });
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: headers,
      timeout: options.timeout || 15000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 拦截 401, 静默登录自愈
          if (!isRefreshing) {
            isRefreshing = true;
            silentLogin().then(newToken => {
              isRefreshing = false;
              // 逐个重放队列中的请求
              refreshQueue.forEach(cb => cb(newToken));
              refreshQueue = [];
            }).catch(err => {
              isRefreshing = false;
              refreshQueue = [];
              reject(res);
            });
          }
          
          // 将当前请求放入重放队列中
          refreshQueue.push((newToken) => {
            options.header = Object.assign({}, options.header || {}, {
              'Authorization': `Bearer ${newToken}`
            });
            request(options).then(resolve).catch(reject);
          });
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

function silentLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          wx.request({
            url: `${BASE_URL}/auth/wechat/mini-login`,
            method: 'POST',
            data: { code: loginRes.code },
            header: { 'content-type': 'application/json' },
            success: (res) => {
              if (res.statusCode === 200 && res.data && res.data.access_token) {
                const token = res.data.access_token;
                wx.setStorageSync('token', token);
                resolve(token);
              } else {
                reject(new Error('兑换 Token 失败'));
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        } else {
          reject(new Error('微信登录失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  request,
  silentLogin,
  BASE_URL
};
