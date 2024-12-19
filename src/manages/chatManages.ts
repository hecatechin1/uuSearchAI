import {getChatList,getMessagesList,sendMessage} from "../services/chatServices";
import {chat_list,current_chat,current_chat_id,current_message} from "../stores/chatStores";
import {userID,language} from "../stores/userStores"
import {isStreaming} from "../stores/globalParamentStores"
import { get } from 'svelte/store';

let sse_source:any = null;


export async function getChatListData() {
    let data = await getChatList();
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
        clist .push({
            cid:c.cid,
            name:c.name,
        });
    }
    chat_list.set(clist);
    return 0;
}

export async function getMessagesListData() {
    let data = await getMessagesList();
    console.log(data);
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

export async function getMessage(pid:number,msg:string,ai:string,model:string){
    isStreaming.set(true);
    if(sse_source){
        sse_source.close();
        sse_source = null;
    }

    sse_source = await sendMessage(msg,pid,ai,model);
    sse_source.addEventListener("message",(e:any)=>{
        sse_source.resetTimeout();
        let data = e.data;
        let msg_info = checkMessageEnd(data);
        if(msg_info){
            current_chat.update(v=>{
                v.push({
                    'message':{
                        'role':'user',
                        'content':msg
                    },
                    'cid':get(current_chat_id),
                    'pid':pid,
                    "mid":msg_info.pid,
                    'tm':msg_info.tm
                });
                v.push({
                    'message':{
                        'role':'assistant',
                        'content':get(current_message)
                    },
                    'cid':msg_info.cid,
                    'pid':msg_info.pid,
                    "mid":msg_info.mid,
                    'tm':msg_info.tm
                });
                 return v
                });
                console.log(get(current_chat));
        }else{
            current_message.update(v=>{return v+data});
            console.log(get(current_message));
        }

    });

    sse_source.addEventListener("error",(e:any)=>{
        sse_source.close();
    });

}
//用于检查消息是否结束，结束返回mid,cid 未结束返回消息本身
function checkMessageEnd(msg:string){
    //检查msg前五位是否是"[done]"
    if(msg.substring(0,5) == "[done]"){
        let msg_info = JSON.parse(msg.substring(5,msg.length));
        return {
            mid:msg_info.mid,
            cid:msg_info.cid,
            tm:msg_info.tm,
            pid:msg_info.pid
        }
    }
    return false;
}