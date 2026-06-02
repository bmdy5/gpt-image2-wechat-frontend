const automator = require('miniprogram-automator');
const path = require('path');

// 100% 绝对安全的 1x1 像素纯红 Base64 本地内存解码图片，不经过任何外网握手，绝对免疫一切沙盒网络闪退！
const SAFE_BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function run() {
  console.log('正在拉起微信开发者工具，并载入小程序项目...');
  try {
    const miniProgram = await automator.launch({
      cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
      projectPath: '/Users/xiaoliang/项目/WeChat/gpt-image2-wechat',
    });

    console.log('已成功连接小程序模拟器！正在实时监听小程序控制台日志...');
    miniProgram.on('console', msg => {
      console.log(`[MINIPROGRAM CONSOLE] [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    console.log('正在等待页面加载...');
    const activePage = await miniProgram.reLaunch('/pages/index/index');
    await activePage.waitFor(2000); // 确保页面稳定

    // =========================================================================
    // 🚉 黄金单向列车第一站：HOME TAB (首页相关的所有 6 个状态在此原地一次性完成)
    // =========================================================================
    console.log('\n--- [黄金单向列车第一站] 开始测试 HOME 页面 ---');

    // 1. 首页默认态
    const homePath = path.join(__dirname, 'test_screen_home.png');
    console.log('正在生成截图：test_screen_home.png');
    await miniProgram.screenshot({ path: homePath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 2. 上传参考图状态
    console.log('正在注入纯本地解码的 Base64 参考图数据...');
    await activePage.setData({ refImgUrl: SAFE_BASE64_IMAGE });
    await activePage.waitFor(1500); // 等待 DOM 重排及缩略图淡入稳定
    const uploadPath = path.join(__dirname, 'test_screen_home_upload.png');
    console.log('正在生成截图：test_screen_home_upload.png');
    await miniProgram.screenshot({ path: uploadPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 3. 激活模式选择下拉菜单
    console.log('正在注入状态以激活模式选择下拉菜单...');
    await activePage.setData({ modeDropdownVisible: true });
    await activePage.waitFor(1000);
    const dropdownPath = path.join(__dirname, 'test_screen_home_dropdown.png');
    console.log('正在生成截图：test_screen_home_dropdown.png');
    await miniProgram.screenshot({ path: dropdownPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 还原下拉框状态
    await activePage.setData({ modeDropdownVisible: false });
    await activePage.waitFor(800);

    // 4. 打开风格选择抽屉
    console.log('正在注入状态以打开风格选择抽屉...');
    await activePage.setData({ styleModalVisible: true });
    await activePage.waitFor(1500);
    const stylePath = path.join(__dirname, 'test_screen_home_style.png');
    console.log('正在生成截图：test_screen_home_style.png');
    await miniProgram.screenshot({ path: stylePath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 还原风格弹窗状态
    await activePage.setData({ styleModalVisible: false });
    await activePage.waitFor(800);

    // 5. 切换至进阶模式
    console.log('正在注入状态以切换为进阶模式...');
    await activePage.setData({
      currentMode: 'advanced',
      currentModeLabel: '进阶模式'
    });
    await activePage.waitFor(1500); // 等待模式重载及界面变动
    const advancedPath = path.join(__dirname, 'test_screen_home_advanced.png');
    console.log('正在生成截图：test_screen_home_advanced.png');
    await miniProgram.screenshot({ path: advancedPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 6. 切换至旗舰模式
    console.log('正在注入状态以切换为旗舰模式...');
    await activePage.setData({
      currentMode: 'flagship',
      currentModeLabel: '旗舰模式'
    });
    await activePage.waitFor(1500);
    const flagshipPath = path.join(__dirname, 'test_screen_home_flagship.png');
    console.log('正在生成截图：test_screen_home_flagship.png');
    await miniProgram.screenshot({ path: flagshipPath });
    await activePage.waitFor(3000); // 拓宽 GPU 物理排空冷却时间，保障显存彻底回收

    // =========================================================================
    // 🚉 黄金单向列车第二站：GALLERY TAB (画廊相关的所有 3 个状态在此原地一次性完成)
    // =========================================================================
    console.log('\n--- [黄金单向列车第二站] 单向切往 GALLERY 页面 ---');
    await activePage.callMethod('switchTab', {
      currentTarget: { dataset: { tab: 'gallery' } }
    });
    await activePage.waitFor(2000); // 等待 Tab 切换和 DOM 渲染稳定

    // 7. 画廊默认态
    const galleryPath = path.join(__dirname, 'test_screen_gallery.png');
    console.log('正在生成截图：test_screen_gallery.png');
    await miniProgram.screenshot({ path: galleryPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 8. 激活删除二次确认磨砂弹窗
    console.log('正在注入状态以激活画廊卡片删除确认弹窗...');
    await activePage.setData({
      deleteConfirmVisible: true,
      deletingItemId: 1
    });
    await activePage.waitFor(1200);
    const confirmPath = path.join(__dirname, 'test_screen_gallery_confirm.png');
    console.log('正在生成截图：test_screen_gallery_confirm.png');
    await miniProgram.screenshot({ path: confirmPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 还原删除弹窗状态
    await activePage.setData({ deleteConfirmVisible: false, deletingItemId: null });
    await activePage.waitFor(800);

    // 9. 展开大图沉浸式预览
    console.log('正在注入纯本地 Base64 状态以展开大图沉浸式预览...');
    await activePage.setData({
      previewVisible: true,
      previewImgUrl: SAFE_BASE64_IMAGE,
      previewItemId: 1,
      previewItemIsLiked: false
    });
    await activePage.waitFor(1200);
    const previewPath = path.join(__dirname, 'test_screen_gallery_preview.png');
    console.log('正在生成截图：test_screen_gallery_preview.png');
    await miniProgram.screenshot({ path: previewPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // 还原预览状态 (不置空大图 CDN 链接，防范图片拔除引发的 Webview 闪退)
    await activePage.setData({ previewVisible: false, previewItemId: null });
    await activePage.waitFor(800);

    // =========================================================================
    // 🚉 黄金单向列车第三站：INSPIRATION TAB (充值中心状态在此原地完成)
    // =========================================================================
    console.log('\n--- [黄金单向列车第三站] 单向切往 INSPIRATION 页面 ---');
    await activePage.callMethod('switchTab', {
      currentTarget: { dataset: { tab: 'inspiration' } }
    });
    await activePage.waitFor(2000); // 等待 Tab 切换和 DOM 渲染稳定

    // 10. 充值中心态
    const inspirationPath = path.join(__dirname, 'test_screen_inspiration.png');
    console.log('正在生成截图：test_screen_inspiration.png');
    await miniProgram.screenshot({ path: inspirationPath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    // =========================================================================
    // 🚉 黄金单向列车第四站：PROFILE TAB (个人中心状态在此原地完成)
    // =========================================================================
    console.log('\n--- [黄金单向列车第四站] 单向切往 PROFILE 页面 ---');
    await activePage.callMethod('switchTab', {
      currentTarget: { dataset: { tab: 'profile' } }
    });
    await activePage.waitFor(2000); // 等待 Tab 切换和 DOM 渲染稳定

    // 11. 个人中心态
    const profilePath = path.join(__dirname, 'test_screen_profile.png');
    console.log('正在生成截图：test_screen_profile.png');
    await miniProgram.screenshot({ path: profilePath });
    await activePage.waitFor(2000); // GPU 截图后排空冷却

    console.log('\n所有 11 张物理回归截图完美且安全生成，准备断开连接...');
    await miniProgram.close();
    console.log('微信开发者工具连接已安全关闭。自动化流程结束！');
  } catch (error) {
    console.error('自动化单向列车流程中发生严重故障:', error);
    process.exit(1);
  }
}

run();
