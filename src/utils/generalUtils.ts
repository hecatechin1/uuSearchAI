import {showErrorMessage,showSuccessMessage} from "../stores/globalParamentStores";
// utils/generalUtils.ts

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
  

  
  // Utility function to check if a message is an audio message
  export function isAudioMessage(message: any): message is { audioUrl: string; isAudio: boolean } {
    return message.isAudio === true;
  }
 export function countTicks(str: string) {
    let out: number = str.split("").filter((char) => char === "`").length;
    return out;
  }

// 请求超时处理,默认一分钟超时
  export function createTimeOutFetch(timeout = 60*1000) {
    return (resource:string, options={}) => {
      let controller = new AbortController();
      options = options || {};
      options.signal = controller.signal;
      setTimeout(() => {
        controller.abort();
      }, timeout);
      return fetch(resource, options)
    }
  }

  export function getErrorMessage(code:string){
    return ErrorMessage[code];
  }

  const ErrorMessage = {
    "1":"网络错误",
    "1000":"邮箱验证失败，请检查邮箱或者重新发送验证码",
    "101":" no uid",//暂时不用翻译
  }

  