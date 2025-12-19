
// 全局类型定义，防止TS报错
declare global {
  interface Window {
    ap?: any;
    wx?: any;
  }
}

/**
 * 检测当前运行环境
 * @returns 'wechat' | 'alipay' | 'other'
 */
function getEnv(): 'wechat' | 'alipay' | 'other' {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('micromessenger')) return 'wechat';
  if (ua.includes('alipay')) return 'alipay';
  return 'other';
}

/**
 * 唤起地图导航 (优先高德)
 * @param name 目的地名称
 * @param lat 纬度 (Latitude)
 * @param lon 经度 (Longitude)
 */
export function openMap(name: string, lat: number, lon: number) {
  const env = getEnv();
  const latitude = Number(lat);
  const longitude = Number(lon);

  console.log(`[Navigation] Env: ${env}, Dest: ${name} (${latitude}, ${longitude})`);

  switch(env) {
    case 'alipay':
      // 支付宝环境：尝试调用内置地图API，失败则尝试Scheme
      if (window.ap && window.ap.map) {
         window.ap.map.navigate({ latitude, longitude, name });
      } else {
         window.location.href = `alipays://platformapi/startapp?appId=20000067&page=pages/navi/navi&lat=${latitude}&lon=${longitude}&name=${encodeURIComponent(name)}`;
      }
      break;

    case 'wechat':
      // 微信环境：尝试跳转高德地图小程序
      // 注意：这通常需要在微信环境中引入 JSSDK，此处做防御性编程
      if (window.wx && window.wx.miniProgram) {
        window.wx.miniProgram.navigateTo({
          appId: 'wx600e65a561716960', // 高德地图小程序 AppID
          path: `pages/navi/navi?lat=${latitude}&lon=${longitude}&name=${encodeURIComponent(name)}`
        });
      } else {
        // 如果没有JSSDK环境 (如纯H5未鉴权)，提示用户用浏览器打开
        alert("请点击右上角菜单，选择“在浏览器打开”以启动地图导航。");
      }
      break;

    case 'other':
      // 外部浏览器：尝试唤起高德 App Scheme，超时降级到 H5
      const scheme = `amap://navi?sourceApplication=dongliGuide&poiname=${encodeURIComponent(name)}&lat=${latitude}&lon=${longitude}&dev=0&style=2`;
      // 高德 H5 导航链接
      const webUrl = `https://m.amap.com/navi/?dest=${latitude},${longitude}&destName=${encodeURIComponent(name)}&key=8428614f111312a91d57c0651f63e743`; 
      
      // 尝试打开 App
      window.location.href = scheme;
      
      // 设置超时跳转 H5 (如果2秒内没切走，说明没唤起App)
      const startTime = Date.now();
      const timer = setTimeout(() => {
        if (Date.now() - startTime < 2500 && !document.hidden) {
          window.location.href = webUrl;
        }
      }, 2000);

      // 监听页面隐藏事件，如果页面隐藏了，说明App唤起成功，清除定时器
      const visibilityChangeHandler = () => {
        if (document.hidden) {
          clearTimeout(timer);
          document.removeEventListener('visibilitychange', visibilityChangeHandler);
        }
      };
      document.addEventListener('visibilitychange', visibilityChangeHandler);
      break;
  }
}
