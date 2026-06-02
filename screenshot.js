const automator = require('miniprogram-automator');
const path = require('path');

async function run() {
  console.log('正在拉起微信开发者工具，并载入小程序项目...');
  try {
    const miniProgram = await automator.launch({
      cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
      projectPath: '/Users/xiaoliang/项目/WeChat/gpt-image2-wechat',
    });

    console.log('已成功连接小程序模拟器！正在实时监听小程序控制台日志...');
    // 实时抓取并透传小程序内部的 console 打印及报错信息
    miniProgram.on('console', msg => {
      console.log(`[MINIPROGRAM CONSOLE] [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    console.log('正在等待页面加载...');
    const page = await miniProgram.reLaunch('/pages/index/index');
    await page.waitFor(2000); // 确保 stardust 等粒子系统及页面稳定

    const tabs = ['home', 'gallery', 'inspiration', 'profile'];
    for (const tab of tabs) {
      console.log(`正在获取当前活跃页面实例...`);
      const activePage = await miniProgram.currentPage();
      
      console.log(`正在模拟点击切换至 Tab [${tab}] ...`);
      // 模拟高保真用户点击，替代底层的直接 setData 数据注入
      const tabElement = await activePage.$(`.tab-item-${tab}`);
      if (tabElement) {
        await tabElement.tap();
      } else {
        console.warn(`未找到 Tab [${tab}] 的点击节点，回退使用 setData 变更为 [${tab}]`);
        await activePage.setData({
          activeTab: tab
        });
      }

      // 引入双重保险：等待 200ms 检测状态是否同步，若点击被模拟器边缘吞掉则以 setData 安全兜底
      await activePage.waitFor(200);
      const pageData = await activePage.data();
      if (pageData.activeTab !== tab) {
        console.warn(`[双保险触发] 模拟点击未完成 Tab 状态同步，强行执行数据注入兜底: [${tab}]`);
        await activePage.setData({
          activeTab: tab
        });
      }
      
      // 延迟等待动画过渡和页面完全渲染
      await activePage.waitFor(2000);

      const screenshotName = `test_screen_${tab}.png`;
      const screenshotPath = path.join(__dirname, screenshotName);
      console.log(`正在生成截图：${screenshotName}`);
      await miniProgram.screenshot({
        path: screenshotPath
      });
      console.log(`截图已保存到: ${screenshotPath}`);
    }

    console.log('所有页面截图生成完成，准备关闭连接...');
    await miniProgram.close();
    console.log('微信开发者工具连接已安全关闭。自动化流程结束！');
  } catch (error) {
    console.error('自动化流程中发生严重故障:', error);
    process.exit(1);
  }
}

run();
