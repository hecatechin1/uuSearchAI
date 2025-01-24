import { } from "../stores/userStores";
import {createTimeOutFetch} from "../utils/generalUtils";

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
export async function getInfo() {
  try {
    let response = await createTimeOutFetch()(`https://api.uugpt.com/user/info`);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // 打印数据
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }




}

//验证邮箱是否存在
export async function checkEmail(email: string) {
  try {
    let response = await createTimeOutFetch()(`https://api.uugpt.com/user/exist?email=${email}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // 打印数据
      return data;
    } else {
      return 1;
    }
  } catch (e:any) {
    // console.log("发送错误",e.name);
    return 1;
  }
}


//发送邮箱验证码
export async function sendEmailCode(email: string, code_id: string) {
  try {
    let res = await createTimeOutFetch()("https://api.maxthon.com/web/sendcode",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email,
        code_id:code_id,
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }


}

//验证邮箱验证码
export async function verifycode(code: string, code_id: string) {
  try {
    let res = await createTimeOutFetch()("https://api.maxthon.com/web/verifycode",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        code:code,
        code_id:code_id,
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}


//注册
export async function setPassword(email: string, password: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/signup?email=${email}&password=${password}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}

//登录
export async function login(email: string, password: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/login?email=${email}&password=${password}`);
    if (res.ok) {
      const data = await res.json();
      const cookie =res.headers.get('set-cookie');
      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 设置过期时间
      document.cookie = `uugpt_ut =${cookie}; expires=${expires.toUTCString()}; path=/`;
      // document.cookie = cookie;
      res.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}
//重置密码
export async function resetPassword(email: string, password: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/update`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        info:{
        "password":password,
        "email":email
        }
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}

