import {getChatList,getMessagesList,sendMessage,deleteChat,updateChatInfo} from "../services/chatServices";
import {chat_list,current_chat,current_chat_id,current_message,current_chat_ai,current_chat_model,models} from "../stores/chatStores";
import {userID,language} from "../stores/userStores"
import {isNewchat, isStreaming} from "../stores/globalParamentStores"
import { get } from 'svelte/store';

let sse_source:any = null;

export function closeStream(){
    if(sse_source){
        sse_source.close();
        sse_source = null;
    }
    isStreaming.set(false);
}

export async function getChatListData() {
    let data = await getChatList();
    //判断每个conversation距离今天差几天，然后分组显示
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    let r_clist = data.result;
    let clist = [];
    for(let i =r_clist.length-1;i>=0;i--){
        let c = r_clist[i];
        let d =  new Date(c.tm);
        let date = new Date(d.getFullYear(),d.getMonth(),d.getDate());
        const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        clist .push({
            cid:c.cid,
            name:c.name,
            tm:c.tm,
            daydiff:dayDiff,
            ai:c.ai,
            model:c.model
        });
    }
    chat_list.set(clist);
    return 0;
}

export async function getMessagesListData() {
    let cid= get(current_chat_id);
    let data = await getMessagesList(cid);
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    let r_mlist = data.result;
    let mlist = [];
    for(let i =0;i<r_mlist.length;i++){
        let m:any = r_mlist[i];
        mlist.push({
            'message':{
                'role':m.message.role,
                'content':m.message.content
            },
            'cid':m.cid,
            'pid':m.pid,
            "mid":m.mid,
            'tm':m.tm,
            'ai':m.ai,
           'model':m.model
        });
    }
    //防止操作过快current_chat更新频繁，导致点击的和显示消息不一致
    if(cid=get(current_chat_id)){
        current_chat.set(mlist);
    }
    return 0;
}

//传入user_msg的index,用index从current_chat中获取msg等参数，然后改变index+1的数据，
//这样可以同时完成retry和send两个功能
// export async function getMessage(pid:number,msg:string,ai:string,model:string){
export async function getMessage(msg:string,ai:string,model:string){
    current_message.set("");
    isStreaming.set(true);
    closeStream();
    let pid = 0;
    current_chat.update(value=>{
        if(value.length >= 2){
            pid = value[value.length-1].mid || 0;
        }
        value.push({
            'message':{
                'role':'user',
                'content':msg
            },
            'cid':0,
            'pid':0,
            "mid":0,
            'tm':0,
            'ai':ai,
            'model':model
        });
        value.push({
            'message':{
                'role':'assistant',
                'content':'',
            },
            'cid':0,
            'pid':0,
            "mid":0,
            'tm':0,
            'ai':ai,
            'model':model
        });
        return value;
    });
    sse_source = await sendMessage(msg,pid,ai,model);
    sse_source.addEventListener("message",(e:any)=>{
        sse_source.resetTimeout();
        let data = e.data;
        let msg_info = checkMessageEnd(data);
        if(msg_info){
            current_chat.update(v=>{
                //因为用户发送msg的msgid只能在sse结束后获取，所以在此处修改用户消息的msgid
                v[v.length-2].mid = msg_info.pid;
                v[v.length-2].cid = msg_info.cid;
                v[v.length-2].pid = get(isNewchat) ? 0: v[v.length-3].mid;
                v[v.length-2].tm = msg_info.tm;
                v[v.length-1].tm=msg_info.tm;
                v[v.length-1].cid=msg_info.cid;
                v[v.length-1].message.content = get(current_message);
                v[v.length-1].mid = msg_info.mid;
                v[v.length-1].pid = msg_info.pid;
                 return v
                });
            isStreaming.set(false);
            if(get(isNewchat)){
                current_chat_id.set(msg_info.cid);
                setTimeout(()=>{
                    isNewchat.set(false);//24-12-25  服务器的列表更新有点延迟，列表更新请求延迟一下
                },3*1000);
            }
        }else{
            current_message.update(v=>{return v+data});
            current_chat.update(v=>{
                v[v.length-1].message.content = get(current_message);
                return v;
            });
        }
    });
    sse_source.addEventListener("error",(e:any)=>{
        closeStream();
    });
}

//用于检查消息是否结束，结束返回mid,cid 未结束返回消息本身
function checkMessageEnd(msg:string){
    //检查msg前五位是否是"[done]"
    if(msg.substring(0,6) == "[DONE]"){
        let msg_info = JSON.parse(msg.substring(6,msg.length));
        return {
            mid:msg_info.mid,
            cid:msg_info.cid,
            tm:msg_info.tm,
            pid:msg_info.pid
        }
    }
    return false;
}

export async function deleteChatData(index:number){
    let cid = get(chat_list)[index].cid;
    let data = await deleteChat(cid);
    if(data==1){
        return 1;
    }
    if(data.code!=0){
        return data.code;
    }
    if(cid==get(current_chat_id)){
        createNewChat();
    }
    chat_list.update(v=>{
        v.splice(index,1);
        return v;
    });
    return 0;
}

export async function createNewChat(){
    closeStream();
    current_chat.set([]);
    current_chat_id.set(0);
    current_chat_ai.set(0);
    current_chat_model.set(0);
    isNewchat.set(true);
}

export async function changeChatModel(ai:number,model:number){
    current_chat_ai.set(ai);
    current_chat_model.set(model);
    let ai_name = models[get(current_chat_ai)].ai;
    let model_name = models[get(current_chat_ai)].models[get(current_chat_model)].model;
    let data = await updateChatInfo(get(current_chat_id),'',ai_name,model_name);
    if(data == 1){
        return 1;
    }
    if(data.code!=0){
        return data.code;
    }
    return 0;
}

export async function renameChat(cid:number,name:string){
    let data = await updateChatInfo(cid,name);
    if(data == 1){
        return 1;
    }
    if(data.code!=0){
        return data.code;
    }

    return 0;
}