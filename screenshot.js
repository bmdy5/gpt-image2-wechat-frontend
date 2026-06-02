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

    console.log('--- 正在模拟高级交互状态截图 ---');
    
    // 5. 模式下拉激活态
    console.log('正在切回首页以测试下拉菜单...');
    await (await miniProgram.currentPage()).setData({ activeTab: 'home' });
    await (await miniProgram.currentPage()).waitFor(1000);
    const modeTrigger = await (await miniProgram.currentPage()).$('.mode-dropdown-trigger');
    if (modeTrigger) {
      console.log('正在点击激活模式选择下拉菜单...');
      await modeTrigger.tap();
      await (await miniProgram.currentPage()).waitFor(1500);
      await miniProgram.screenshot({
        path: path.join(__dirname, 'test_screen_home_dropdown.png')
      });
      console.log('已生成下拉菜单状态截图: test_screen_home_dropdown.png');
      // 关闭下拉框以防遮挡后续
      await modeTrigger.tap();
      await (await miniProgram.currentPage()).waitFor(500);
    }

    // 6. 风格选择抽屉弹出态
    const styleTrigger = await (await miniProgram.currentPage()).$('.style-trigger');
    if (styleTrigger) {
      console.log('正在点击打开风格选择抽屉...');
      await styleTrigger.tap();
      await (await miniProgram.currentPage()).waitFor(1500);
      await miniProgram.screenshot({
        path: path.join(__dirname, 'test_screen_home_style.png')
      });
      console.log('已生成风格抽屉状态截图: test_screen_home_style.png');
      // 关闭风格弹窗以还原页面
      const closeBtn = await (await miniProgram.currentPage()).$('.modal-close');
      if (closeBtn) {
        await closeBtn.tap();
      } else {
        await (await miniProgram.currentPage()).setData({ styleModalVisible: false });
      }
      await (await miniProgram.currentPage()).waitFor(500);
    }

    // 7. 删除二次确认磨砂弹窗态
    console.log('正在切回画廊以测试删除二次确认弹窗...');
    await (await miniProgram.currentPage()).setData({ activeTab: 'gallery' });
    await (await miniProgram.currentPage()).waitFor(1000);
    const deleteBtn = await (await miniProgram.currentPage()).$('.delete-btn');
    if (deleteBtn) {
      console.log('正在点击激活画廊卡片删除按钮...');
      await deleteBtn.tap();
      await (await miniProgram.currentPage()).waitFor(1500);
      await miniProgram.screenshot({
        path: path.join(__dirname, 'test_screen_gallery_confirm.png')
      });
      console.log('已生成删除确认弹窗状态截图: test_screen_gallery_confirm.png');
      // 关闭弹窗以防影响后续
      const cancelBtn = await (await miniProgram.currentPage()).$('.btn-cancel');
      if (cancelBtn) {
        await cancelBtn.tap();
      } else {
        await (await miniProgram.currentPage()).setData({ deleteConfirmVisible: false });
      }
      await (await miniProgram.currentPage()).waitFor(500);
    }

    // 8. 大图沉浸式预览态
    console.log('正在执行大图沉浸式预览态测试...');
    const cardImg = await (await miniProgram.currentPage()).$('.card-img');
    if (cardImg) {
      console.log('正在点击画卡图片打开全屏沉浸预览...');
      await cardImg.tap();
    } else {
      console.warn('未直接找到 .card-img 节点，尝试使用通用 image 节点点击...');
      const fallbackImg = await (await miniProgram.currentPage()).$('image');
      if (fallbackImg) {
        await fallbackImg.tap();
      }
    }

    // 引入双保险：等待 200ms 检测大图详情是否展开，若模拟点击失效则执行安全的数据注入拉起
    await (await miniProgram.currentPage()).waitFor(200);
    const postTapData = await (await miniProgram.currentPage()).data();
    if (!postTapData.previewVisible) {
      console.warn('[双保险触发] 大图沉浸预览未成功展开，执行安全数据注入强行拉起...');
      await (await miniProgram.currentPage()).setData({
        previewVisible: true,
        previewImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYorjDASP6BiWN8BqUMV6co7VAkYKnXG-Wf8un89g-YL5MoDccZKhp_3HeLPhilkQxtPBDhuty19WHFoCbuT1YpBN120gGaPTC5paIy72m39c6GnIl_nnbn_JzXzODKR1eIfUE1WTBJELckV3kPwyf9J73afPE33chKZGkh0SUNmCWGc_C2Em84YFdPc3mHWF3I3GZZFGoebKC-xdZaBPyoIih2xCPWu6tJYWTTuOH9woDvPJ6-qdt4RBHgHaooEzQh2-rKiE6aQ',
        previewItemId: 1,
        previewItemIsLiked: false
      });
    }

    await (await miniProgram.currentPage()).waitFor(1500);
    const previewPath = path.join(__dirname, 'test_screen_gallery_preview.png');
    console.log('正在生成大图沉浸预览截图...');
    await miniProgram.screenshot({
      path: previewPath
    });
    console.log(`大图沉浸预览状态截图已保存到: ${previewPath}`);

    // 关闭大图层还原页面
    const previewOverlay = await (await miniProgram.currentPage()).$('.preview-overlay');
    if (previewOverlay) {
      await previewOverlay.tap();
    } else {
      await (await miniProgram.currentPage()).setData({ previewVisible: false });
    }
    await (await miniProgram.currentPage()).waitFor(500);

    // 9. 切换至进阶模式激活态
    console.log('正在执行进阶模式激活态测试...');
    console.log('正在切回首页以测试进阶模式...');
    await (await miniProgram.currentPage()).setData({ activeTab: 'home' });
    await (await miniProgram.currentPage()).waitFor(1000);
    
    const modeTriggerForAdvanced = await (await miniProgram.currentPage()).$('.mode-dropdown-trigger');
    if (modeTriggerForAdvanced) {
      console.log('正在点击打开模式下拉以选择“进阶模式”...');
      await modeTriggerForAdvanced.tap();
      await (await miniProgram.currentPage()).waitFor(500);
      const modeOptions = await (await miniProgram.currentPage()).$$('.mode-option');
      if (modeOptions && modeOptions.length >= 2) {
        console.log('正在点击选择 [进阶模式] ...');
        await modeOptions[1].tap();
        await (await miniProgram.currentPage()).waitFor(2000); // 等待粒子系统重绘稳定
        
        const advancedPath = path.join(__dirname, 'test_screen_home_advanced.png');
        console.log('正在生成进阶模式截图...');
        await miniProgram.screenshot({
          path: advancedPath
        });
        console.log(`进阶模式激活态截图已保存到: ${advancedPath}`);
      }
    }

    // 10. 切换至旗舰模式激活态
    console.log('正在执行旗舰模式激活态测试...');
    const modeTriggerForFlagship = await (await miniProgram.currentPage()).$('.mode-dropdown-trigger');
    if (modeTriggerForFlagship) {
      console.log('正在点击打开模式下拉以选择“旗舰模式”...');
      await modeTriggerForFlagship.tap();
      await (await miniProgram.currentPage()).waitFor(500);
      const modeOptions = await (await miniProgram.currentPage()).$$('.mode-option');
      if (modeOptions && modeOptions.length >= 3) {
        console.log('正在点击选择 [旗舰模式] ...');
        await modeOptions[2].tap();
        await (await miniProgram.currentPage()).waitFor(2000); // 等待粒子系统及物理仿真稳定
        
        const flagshipPath = path.join(__dirname, 'test_screen_home_flagship.png');
        console.log('正在生成旗舰模式截图...');
        await miniProgram.screenshot({
          path: flagshipPath
        });
        console.log(`旗舰模式激活态截图已保存到: ${flagshipPath}`);
      }
    }

    // 还原模式至 basic 默认状态以防后续负面效应
    console.log('正在还原为普通模式...');
    await (await miniProgram.currentPage()).setData({
      currentMode: 'basic',
      currentModeLabel: '普通模式'
    });
    await (await miniProgram.currentPage()).waitFor(500);

    console.log('所有页面截图生成完成，准备关闭连接...');
    await miniProgram.close();
    console.log('微信开发者工具连接已安全关闭。自动化流程结束！');
  } catch (error) {
    console.error('自动化流程中发生严重故障:', error);
    process.exit(1);
  }
}

run();
