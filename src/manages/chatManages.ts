import {getChatList,getMessagesList} from "../services/chatServices";
import {chat_list,current_chat} from "../stores/chatStores";


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