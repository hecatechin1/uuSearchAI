import { type Writable, writable } from "svelte/store";
export interface Conversation{
    'cid':number;
    'name':string;
    'tm':number;
    'daydiff':number,
}
export interface Message{
    'message':{
        'role':string;
        'content':string;
    };
    'cid':number;
    'pid':number;
    "mid":number;
    'tm':number;
    'ai':string;
    'model':string;
}

//会话列表
export const chat_list : Writable<Conversation[]> = writable([]);

//当前会话
export const current_chat : Writable<Message[]> = writable([]);

//当前会话id
export const current_chat_id = writable(0);

//当前消息
export const current_message = writable('');
