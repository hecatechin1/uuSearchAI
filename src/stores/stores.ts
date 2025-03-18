import { type Writable, writable } from "svelte/store";
import { onMount } from 'svelte';
export interface CustomMessage {
    'role': string,
    'content': string,
    'isLiked': boolean,
    'isDisliked': boolean
}

//面板
export const settingsVisible = writable(false);
//设置选项

//发送按键 
export const sendKey = writable("Enter");

//换行按键
export const lineBreakKey = writable("Shift+Enter");


export const isStreaming = writable(false);
export const userRequestedStreamClosure = writable(false);



export const currentMessageid = writable(0);
export const streamContext = writable({ streamText: '' });
export const messages: Writable<CustomMessage[]> = writable([]);
