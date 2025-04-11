import {sha256} from 'js-sha256'
import { init, t } from "svelte-i18n"; // 导入本地化方法
import { get } from 'svelte/store';


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

export function clickOutside(node:any, callbackEvent:any) {
console.log(callbackEvent);
  function handleClick(event:any) {
    if (!node.contains(event.target) && !callbackEvent.originElement?.contains(event.target)) {
      callbackEvent.callback?.();
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
    options.credentials='include',
    setTimeout(() => {
      controller.abort();
    }, timeout);
    return fetch(resource, options)
  }
}

export function getErrorMessage(code: string) {
  const ErrorMessage = {
    "1": get(t)('ERR.CONNECTION_FAILED', {default: 'Connection failed, please check your network or try again later'}),
    "1000": get(t)('ERR.INVALID_EMAIL', {default: 'Invalid Email, please check your email or verify again'}),
    "101": get(t)('ERR.NO_UID', {default: 'User not found. This may be due to a server interface issue. Please log out and try again. If the problem persists, contact the administrator.'}),
    "100": get(t)('ERR.UNKNOWN', {default: 'Unknown error, please try again later'}),
    "ERR_PASSWORD_ERROR":get(t)('ERR.PASSWORD_ERROR', {default: 'Wrong password. Please check your password and try again.'}),
  }
  let errmsg = ErrorMessage[code];
  if(!errmsg){
    return errmsg = ErrorMessage[100];
  }
  return ErrorMessage[code];
}



// 密码加密函数
export async function hash256(str: string) {
  return sha256(str).toString();
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


export function addQueryParam(urlStr: string, key: string, value: string) {
  // 使用正则解析 URL 各部分
  const match = urlStr.match(
    /^(.*?:\/\/)?([^\/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/,
  );
  if (!match) return urlStr;

  // 解构匹配结果
  const [_, protocol = "", host, path, search, hash = ""] = match;

  // 处理查询参数
  const params = new URLSearchParams(search ? search.slice(1) : "");
  params.set(key, value); // 替换或添加参数

  // 生成新 URL
  const newSearch = params.toString();
  return `${protocol}${host}${path}${newSearch ? "?" + newSearch : ""}${hash}`;
}

