import {getChatList} from "../services/chatServices";
import {chat_list} from "../stores/chatStores";
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