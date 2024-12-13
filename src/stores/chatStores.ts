import { type Writable, writable } from "svelte/store";
export interface Conversation{
    'cid':number;
    'name':string;
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
}

//会话列表
export const chat_list : Writable<Conversation[]> = writable([]);

//当前会话
export const current_chat : Writable<Message[]> = writable([]);

//当前会话id
export const current_chat_id = writable(0);
