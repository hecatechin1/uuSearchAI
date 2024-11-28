import { type Writable, writable } from "svelte/store";

//当前会话
export const currentChat = writable('');

//登录状态
export const isLogin = writable(false);

//


