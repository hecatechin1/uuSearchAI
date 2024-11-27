import { type Writable, writable } from "svelte/store";

//设置选项
//发送按键
export const sendKey = writable("Enter");
//换行按键
export const lineBreakKey = writable("Shift+Enter");
//语言
export const language = writable("en");