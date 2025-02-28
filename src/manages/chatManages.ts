import { getChatList, getMessagesList, sendMessage, deleteChat, updateChatInfo, deleteMessage } from "../services/chatServices";
import { chat_list, current_chat, current_chat_id, current_message, current_chat_ai, current_chat_model, getIndexByCid, defaultaimodel, } from "../stores/chatStores";
import { userID, language } from "../stores/userStores"
import { isNewchat, isStreaming, showSidebar } from "../stores/globalParamentStores"
import { get } from 'svelte/store';

let sse_source: any = null;

export function closeStream() {
    if (sse_source) {
        sse_source.close();
        sse_source = null;
    }
    isStreaming.set(false);
}

export async function getChatListData() {
    let data = await getChatList();
    //判断每个conversation距离今天差几天，然后分组显示
    const now = new Date();
    const today:any = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return data.code;
    }
    let r_clist = data.result;
    let clist = [];
    for (let i = r_clist.length - 1; i >= 0; i--) {
        let c = r_clist[i];
        let d = new Date(c.tm);
        let date:any = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        clist.push({
            cid: c.cid,
            name: c.name,
            tm: c.tm,
            daydiff: dayDiff,
            ai: c.ai,
            model: c.model
        });
    }
    chat_list.set(clist);
    return 0;
}

export async function getMessagesListData() {
    let cid = get(current_chat_id);
    let data = await getMessagesList(cid);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return data.code;
    }
    let r_mlist = data.result;
    let mlist = [];
    for (let i = 0; i < r_mlist.length; i++) {
        let m: any = r_mlist[i];
        mlist.push({
            'message': {
                'role': m.message.role,
                'content': m.message.content
            },
            'cid': m.cid,
            'pid': m.pid,
            "mid": m.mid,
            'tm': m.tm,
            'ai': m.ai,
            'model': m.model,
            'error_code': '0'
        });
    }
    //防止操作过快current_chat更新频繁，导致点击的和显示消息不一致
    if (cid = get(current_chat_id)) {
        current_chat.set(mlist);
    }
    return 0;
}

//传入user_msg的index,用index从current_chat中获取msg等参数，然后改变index+1的数据，
//这样可以同时完成retry和send两个功能
// export async function getMessage(pid:number,msg:string,ai:string,model:string){
export async function getMessage(msg: string, ai: string, model: string) {
    current_message.set("");

    closeStream();
    isStreaming.set(true);
    let pid = 0;
    current_chat.update(value => {
        if (value.length >= 2) {
            pid = value[value.length - 1].mid || 0;
        }
        value.push({
            'message': {
                'role': 'user',
                'content': msg
            },
            'cid': 0,
            'pid': 0,
            "mid": 0,
            'tm': 0,
            'ai': ai,
            'model': model,
            'error_code': '0'
        });
        value.push({
            'message': {
                'role': 'assistant',
                'content': '█',
            },
            'cid': 0,
            'pid': 0,
            "mid": 0,
            'tm': 0,
            'ai': ai,
            'model': model,
            'error_code': '0'
        });
        return value;
    });
    sse_source = await sendMessage(msg, pid, ai, model);
    sse_source.addEventListener("message", (e: any) => {

        sse_source.resetTimeout();
        let data = e.data;
        let msg_err = checkMessageError(data);
        if (msg_err) {
            current_chat.update(v => {
                v[v.length - 1].error_code = msg_err.code;
                return v
            });
            closeStream();
            return;
        }
        let msg_info = checkMessageEnd(data);
        if (msg_info) {
            console.log(msg_info);
            //TODO:根据返回的消息，判断是否有错误，例如token不足，设备数量超限然后提示用户
            current_chat.update(v => {
                //因为用户发送msg的msgid只能在sse结束后获取，所以在此处修改用户消息的msgid
                v[v.length - 2].mid = msg_info.pid;
                v[v.length - 2].cid = msg_info.cid;
                v[v.length - 2].pid = (get(isNewchat) || v.length == 2) ? 0 : v[v.length - 3].mid;
                v[v.length - 2].tm = msg_info.tm;
                v[v.length - 1].tm = msg_info.tm;
                v[v.length - 1].cid = msg_info.cid;
                v[v.length - 1].message.content = get(current_message);
                v[v.length - 1].mid = msg_info.mid;
                v[v.length - 1].pid = msg_info.pid;
                v[v.length - 1].ai = msg_info.ai;
                v[v.length - 1].model = msg_info.model;
                return v
            });
            closeStream();
            if (get(isNewchat)) {
                current_chat_id.set(msg_info.cid);
                setTimeout(() => {
                    isNewchat.set(false);//24-12-25  服务器的列表更新有点延迟，列表更新请求延迟一下
                }, 3 * 1000);
            }
        } else {
            current_message.update(v => { return v + data });
            current_chat.update(v => {
                v[v.length - 1].message.content = get(current_message) + "█";
                return v;
            });
        }
    });
    sse_source.addEventListener("error", (e: any) => {
        closeStream();
    });
}

//用于检查消息是否结束，结束返回mid,cid 未结束返回消息本身
function checkMessageEnd(msg: string) {
    //检查msg前五位是否是"[done]"
    if (msg.substring(0, 6) == "[DONE]") {
        let msg_info = JSON.parse(msg.substring(6, msg.length));
        return {
            mid: msg_info.mid,
            cid: msg_info.cid,
            tm: msg_info.tm,
            pid: msg_info.pid,
            ai: msg_info.ai,
            model: msg_info.model
        }
    }
    return false;
}

function checkMessageError(msg: string) {
    //检查msg前五位是否是"[ERR]"

    if (msg.substring(0, 5) == "[ERR]") {
        let msg_info = JSON.parse(msg.substring(5, msg.length));
        return {
            code: msg_info.code
        }
    }
    return false;
}

export async function deleteChatData(index: number) {
    let cid = get(chat_list)[index].cid;
    let data = await deleteChat(cid);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return data.code;
    }
    if (cid == get(current_chat_id)) {
        createNewChat();
    }
    chat_list.update(v => {
        v.splice(index, 1);
        return v;
    });
    return 0;
}

export async function createNewChat(hidesiderbar = false) {
    closeStream();
    current_chat_id.set(0);
    defaultaimodel();
    isNewchat.set(true);
    showSidebar.set(!hidesiderbar);
}

export async function changeChatModel(ai: string, model: string) {
    current_chat_ai.set(ai);
    current_chat_model.set(model);
    let data = await updateChatInfo(get(current_chat_id), '', ai, model);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return data.code;
    }
    let index:any = getIndexByCid(get(current_chat_id));
    chat_list.update(v => {
        v[index].ai = ai;
        v[index].model = model;
        return v;
    });
    return 0;
}

export async function renameChat(cid: number, name: string) {
    let index:any = getIndexByCid(cid);
    let oldName = get(chat_list)[index].name;

    chat_list.update(v => {
        v[index].name = '正在修改。。。';
        return v;
    });
    let data = await updateChatInfo(cid, name);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return data.code;
    }
    chat_list.update(v => {
        if (data.code == 0) {
            v[index].name = name;
        } else {
            v[index].name = oldName;
        }
        return v;
    });

    return 0;
}

export async function deleteMessageData(index: number, toEnd = false) {
    let cid = get(current_chat)[index].cid;
    let mid = get(current_chat)[index - 1].mid;
    let data = await deleteMessage(cid, mid, toEnd);
    if (data == 1) return 1;
    if (data.code != 0) return data.code;
    current_chat.update(v => {
        if (toEnd) {
            v.splice(index - 1, v.length - index + 1);
        } else {
            v.splice(index - 1, 2);
        }
        return v;
    });
    return 0;
}
