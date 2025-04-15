import { } from "../stores/userStores";
import { createTimeOutFetch, getCookieValue } from "../utils/generalUtils";
import { init, t } from "svelte-i18n"; // 导入本地化方法
import { get } from 'svelte/store';

//登录，注册
export async function fetchData() {

  const response = await fetch('/api/data'); // 请求 API
  if (response.ok) {
    await response.json(); // 解析 JSON 数据
  } else {
    console.error(get(t)("ERR.CONNECTION_FAILED")); // 打印错误信息
  }
}

//获取用户信息
export async function getInfo() {
  try {
    let date = Date.now(); // 生成随机数
    let response = await createTimeOutFetch()(`https://api.uugpt.com/user/info?date=${date}`, {
      method: "GET",
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data); // 打印数据
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }
}

export async function getMaxthonUserInfo(maxthonToken: string) {
  try {
    let response = await createTimeOutFetch()(`https://api.maxthon.com/web/profile`, {
      method: "GET",
      credentials: 'include',
      headers: {
        "mxtoken": maxthonToken,
      }
      //  mxtoken:maxthonToken,
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data); // 打印数据
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }
}

export async function loginMxUser(mxtoken: string) {
  try {
    let response = await createTimeOutFetch()(`https://api.uugpt.com/user/login_partner?partner=mx&mxtoken=${mxtoken}`, {
      method: "GET",
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data); // 打印数据
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
      return data;
    } else {
      return 1;
    }
  } catch (e: any) {
    // console.log("发送错误",e.name);
    return 1;
  }
}


//发送邮箱验证码
export async function sendEmailCode(email: string, code_id: string) {
  try {
    let res = await createTimeOutFetch()("https://api.maxthon.com/web/sendcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        code_id: code_id,
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
    let res = await createTimeOutFetch()("https://api.maxthon.com/web/verifycode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        code_id: code_id,
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

export async function guestSignup() {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/signup`, {
      method: "GET",
      credentials: 'include'
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

//1.没有忘记密码的情况下，重置密码 2.未登录用户在先使用后注册的情况下，设置邮箱密码
export async function changePassword(email: string, password: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: `{
        "info": {
          "password": "${password}",
          "email": "${email}"
        }
      }`

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

//登录
export async function login(email: string, password: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/login?email=${email}&password=${password}`, {
      method: "GET",
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      // const cookie =res.headers.get('set-cookie');
      // const expires = new Date();
      // expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 设置过期时间
      // document.cookie = `uugpt_ut =${cookie}; expires=${expires.toUTCString()}; path=/`;
      // // document.cookie = cookie;
      // res.headers.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}

//退出登录
export async function logout() {
  try {
    let res = await createTimeOutFetch()(``, {
      method: "GET",
      credentials: 'include'
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
//忘记密码——重置密码
export async function resetPassword(email: string, password: string, verifyCode: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/resetPass?email=${email}&new_pass=${password}&code=${verifyCode}`, {
      method: "GET",
      credentials: 'include'
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

//更改玩家数据（设置按键，语言等）
export async function updateData(data: any) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/userdata/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data)
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

export async function getUserData() {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/userdata`, {
      method: "GET",
      credentials: 'include',
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
//忘记密码——发送验证码
export async function sendForgetEmailCode(email: string) {
  try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/user/sendCode?email=${email}`, {
      method: "GET",
      credentials: 'include',
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
