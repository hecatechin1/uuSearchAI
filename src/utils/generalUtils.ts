import {sha256} from 'js-sha256'
import { init, t } from "svelte-i18n"; // 导入本地化方法
import { get } from 'svelte/store';
import QRCode from 'qrcode';
  import html2canvas from 'html2canvas';
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

export async function drawQRCode(logoUrl:string,size:number,logoSize:number,canvas: HTMLCanvasElement, data: string) {
    if (!canvas || !data) return;
    try {
      // 生成基础二维码
      await QRCode.toCanvas(canvas, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      // 添加Logo
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = logoUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject; 
      })
      
      // img.onload = () => {
        // 计算Logo位置（居中）
        const center = size / 2;
        const logoPos = center - logoSize / 2;
        
        // 绘制白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(logoPos - 5, logoPos - 5, logoSize + 10, logoSize + 10);
        
        // 绘制Logo
        ctx.drawImage(img, logoPos, logoPos, logoSize, logoSize);
      // };

      return canvas.toDataURL('image/png');

    } catch (err) {
      console.error("生成带Logo的二维码失败:", err);
    }
}

export async function convertToImage(targetElement:HTMLElement) {
  let imageUrl = '';
  // 保存原始样式
    const originalStyles = {
      position: targetElement.style.position,
      overflow: targetElement.style.overflow,
      height: targetElement.style.height
    };
    
    // 临时移除限制
    targetElement.style.position = 'static';
    targetElement.style.overflow = 'visible';
    targetElement.style.height = 'auto';
    
    // 创建克隆元素
    const clone = targetElement.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = `${targetElement.scrollWidth}px`;
    // clone.style.height = `${targetElement.scrollHeight+100}px`;
    clone.style.zIndex = '1000';
    clone.style.removeProperty('max-height'); // 移除 overflow 属性
    document.body.appendChild(clone);
    // return;
    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 100));
    // 截图
    const canvas = await html2canvas(clone, {
      scale: 1,
      useCORS:true,
      backgroundColor: '#ffffff',
      width: targetElement.scrollWidth,
      height: targetElement.scrollHeight+130,
      scrollY: -window.scrollY, // 解决滚动偏移
      scrollX: -window.scrollX,
    });
    
    // 清理
    document.body.removeChild(clone);
    
    // 恢复原始样式
    Object.assign(targetElement.style, originalStyles);
    
    // 生成图片
    imageUrl = canvas.toDataURL('image/png');
    return imageUrl;
  }



  // 解析 hash 参数为对象
export function parseHashParams() {
  const hash = window.location.hash.substring(1); // 去掉开头的 #
  const params = new URLSearchParams(hash);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
}
export  function removeHashParam(paramName) {
  // 解析当前 hash 参数
  const params = new URLSearchParams(window.location.hash.substring(1));
  
  // 删除指定参数
  if (params.has(paramName)) {
    params.delete(paramName);
    
    // 重建 hash 字符串
    const newHash = params.toString() ? '#' + params.toString() : '';
    
    // 更新 URL
    const url = new URL(window.location);
    url.hash = newHash;
    window.history.pushState({}, document.title, url);
  }
}