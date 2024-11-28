import {} from"../stores/userStores";

//登录，注册
export async function fetchData() {
    const response = await fetch('/api/data'); // 请求 API
    if (response.ok) {
      await response.json(); // 解析 JSON 数据
    } else {
      console.error('请求失败');
    }
  }
  
//获取用户信息
export async function getUserInfo() {
    const response = await fetch('https://api.uugpt.com/user/info'); // 请求 API
    if (response.ok) {
      const data = await response.json(); // 解析 JSON 数据
      return data; // 返回数据
    } else {
      console.error('请求失败');
    }
  }

