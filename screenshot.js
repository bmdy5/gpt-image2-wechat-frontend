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
    miniProgram.on('console', msg => {
      if (msg && msg.text) {
        console.log(`[MINIPROGRAM CONSOLE] [${msg.type.toUpperCase()}] ${msg.text}`);
      }
    });

    console.log('正在等待页面加载...');
    const activePage = await miniProgram.reLaunch('/pages/index/index');
    await activePage.waitFor(4500); // 确保冷启动及 Canvas 2D 异步绑定彻底稳定就绪

    console.log('\n--- 开始执行粒子动效单点点击回归测试 ---');

    // 1. 输入文字 prompt（避开 startGeneration 的空值前置拦截）
    console.log('正在注入文字描述 Prompt...');
    await activePage.setData({
      promptText: '一只精致的白瓷茶杯，里面旋转着璀璨的微缩星系与星云'
    });
    await activePage.waitFor(1200);

    // 2. 定位“生成”按钮节点并触发模拟 tap 点击
    console.log('正在定位并模拟物理点击“生成”按钮...');
    const generateBtn = await activePage.$('.generate-btn');
    if (!generateBtn) {
      throw new Error('未在页面中找到生成按钮 (.generate-btn)');
    }
    
    // 执行 tap 动作，它会自动向下游 bindtap 派发真实的 tap 视口物理坐标
    await generateBtn.tap();
    console.log('“生成”按钮点击事件已派发！等待粒子在 350ms 内爆散至视觉最大波峰半径...');

    // 3. 等待 350ms 粒子波峰期并截取高保真渲染截图
    await activePage.waitFor(350);
    const explosionPath = path.join(__dirname, 'test_screen_explosion.png');
    console.log(`正在生成粒子爆炸波峰截图: ${explosionPath}`);
    await miniProgram.screenshot({ path: explosionPath });

    // 等待生成动画及震颤反馈余波完全平息
    await activePage.waitFor(2500);

    console.log('\n单点动效模拟点击及截图流程执行完毕，安全断开连接...');
    await miniProgram.close();
    console.log('测试完成！');
  } catch (error) {
    console.error('自动化回归中发生严重故障:', error);
    process.exit(1);
  }
}

run();
