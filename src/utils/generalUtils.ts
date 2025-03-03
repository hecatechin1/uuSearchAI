import {sha256} from 'js-sha256'

// Utility function for formatting messages for Markdown rendering
export function formatMessageForMarkdown(content: string): string {
  // Replace newline characters with two spaces followed by a newline character
  // console.log(content.replace(/\\n/g, '  \n'));
  return content.replace(/\\n/g, '\r\n');
}

// Utility function to copy text to clipboard
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text successfully copied to clipboard');
    return true;
  } catch (err) {
    console.error('Failed to copy text to clipboard: ', err);
    return false;
  }
}

export function clickOutside(node:any, callback:any) {
  function handleClick(event:any) {
    if (!node.contains(event.target)) {
      callback?.();
    }
  }
  document.addEventListener('click', handleClick, true);
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}

export function getElementPostionDiff(ele : HTMLElement) {
  let rect = ele.getBoundingClientRect();
  let postion = {
    top:0,
    left:0,
    right:0,
    bottom:0
  }
  // 元素的中心点坐标
  const centerX = rect.left;
  const centerY = rect.top;

  // 视口中心点坐标
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;

  // 水平判断
  if(centerX < viewportCenterX){
    postion.left = rect.left;
  }else{
    postion.right = window.innerWidth - rect.left;
  }

  if(centerY < viewportCenterY ){
    postion.top = rect.bottom;
  }else{
    postion.bottom = window.innerHeight - rect.top;
  }

  return postion;
}

// Utility function to check if a message is an audio message
export function isAudioMessage(message: any): message is { audioUrl: string; isAudio: boolean } {
  return message.isAudio === true;
}
export function countTicks(str: string) {
  let out: number = str.split("").filter((char) => char === "`").length;
  return out;
}

// 请求超时处理,默认一分钟超时
export function createTimeOutFetch(timeout = 60 * 1000) {
  return (resource: string, options = {}) => {
    let controller = new AbortController();
    options = options || {};
    options.signal = controller.signal;
    setTimeout(() => {
      controller.abort();
    }, timeout);
    return fetch(resource, options)
  }
}

export function getErrorMessage(code: string) {
  return ErrorMessage[code];
}

const ErrorMessage = {
  "1": "网络错误",
  "1000": "邮箱验证失败，请检查邮箱或者重新发送验证码",
  "101": " no uid",//暂时不用翻译
  "100": "未注册"
}

// 密码加密函数
export async function hash256(str: string) {
  return sha256(str).toString();
  // 将输入字符串转为 ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  console.log(window)
  // 使用 SubtleCrypto API 计算 SHA-256 哈希值
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // 将 ArrayBuffer 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 将 buffer 转为字节数组
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(""); // 转为十六进制字符串
  return hashHex;
}



export function getCookieValue(name:string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
