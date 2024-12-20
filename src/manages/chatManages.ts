import {getChatList,getMessagesList,sendMessage} from "../services/chatServices";
import {chat_list,current_chat,current_chat_id,current_message} from "../stores/chatStores";
import {userID,language} from "../stores/userStores"
import {isStreaming} from "../stores/globalParamentStores"
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
        });
    }
    chat_list.set(clist);
    return 0;
}

export async function getMessagesListData() {
    let data = await getMessagesList();
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
        });
    }
    current_chat.set(mlist);
    return 0;
}

//传入user_msg的index,用index从current_chat中获取msg等参数，然后改变index+1的数据，
//这样可以同时完成retry和send两个功能
// export async function getMessage(pid:number,msg:string,ai:string,model:string){
export async function getMessage(index:number){
    let  chat = get(current_chat)[index];
    let msg = chat.message.content;
    let pid = chat.pid;
    let ai = chat.ai;
    let model = chat.model;
    current_message.set("");
    isStreaming.set(true);
    closeStream();
    sse_source = await sendMessage(msg,pid,ai,model);
    sse_source.addEventListener("message",(e:any)=>{
        sse_source.resetTimeout();
        let data = e.data;
        let msg_info = checkMessageEnd(data);
        if(msg_info){
            current_chat.update(v=>{
                //修改用户消息的messageid
                v[index].mid = msg_info.pid;
                v[index].tm = msg_info.tm;
                v[index+1].tm=msg_info.tm;
                v[index+1].message.content = get(current_message);
                v[index+1].mid = msg_info.mid;
                v[index+1].pid = msg_info.pid;
                 return v
                });
            isStreaming.set(false);
        }else{
            current_message.update(v=>{return v+data});
            current_chat.update(v=>{
                v[index+1].message.content = get(current_message);
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