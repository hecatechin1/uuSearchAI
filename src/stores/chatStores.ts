import { type Writable, writable } from "svelte/store";

//会话列表
export const chatList: Writable<string[]> = writable([]);
//message
export const message: Writable<string[]> = writable([]);
