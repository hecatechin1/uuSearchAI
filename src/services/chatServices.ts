import { SSE, type AddEventListener } from "sse.js";
import { createTimeOutFetch } from "../utils/generalUtils";
import { get } from "svelte/store";
import { userID, language } from "../stores/userStores";
import { current_chat_id, current_message } from "../stores/chatStores";
import { isNewchat, isStreaming } from "../stores/globalParamentStores";

SSE.prototype.timeoutId = null;
SSE.prototype.resetTimeout = function () {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
  this.timeoutId = setTimeout(() => {
    this.timeoutId = null;
    this.close();
    isStreaming.set(false);
  }, 20 * 1000);
};

//获取conversation列表
export async function getChatList() {
  try {
    let response = await createTimeOutFetch()(
      `https://api.uugpt.com/ai/conv/list?uid=${get(userID)}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }
}

export async function getMessagesList(cid:number) {
  try {
    let response = await createTimeOutFetch()(
      `https://api.uugpt.com/ai/conv/get?cid=${cid}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }
}

export async function sendMessage(msg: string, pid: number, ai: string, model: string) {
  let payload = {
    ai: ai,
    model: model,
    system: "在所有回答前面添加一个随机数字,并且对话标题前面也添加一个随机数字",
    uid: get(userID),
    message: {
      role: "user",
      content: msg,
    },
    lan: get(language),
  };
  if(isNewchat){
    Object.assign(payload,{cid:get(current_chat_id),pid:pid});
  }
  let sse_source = new SSE("https://api.uugpt.com/ai/stream2", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify(payload),
  });
  return sse_source;
}

export async function deleteChat(cid:number){
  try {

    
    let response = await createTimeOutFetch()(
      `https://api.uugpt.com/ai/conv/delete?cid=${cid}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }
}

export async function updateChatInfo(cid:number,name='',ai='',model=''){
  try {
    let body = {cid:cid}
    if (name!=''){
      Object.assign(body,{name:name});
    }
    if (ai!='' && model!=''){
      Object.assign(body,{ai:ai,model:model});
    }
    let response = await createTimeOutFetch()(`https://api.uugpt.com/ai/conv/update`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(body)
    } );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return 1;
    }
  } catch (e) {
    return 1;
  }

}
