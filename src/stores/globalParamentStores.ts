import {writable } from "svelte/store";
export const showError = writable(false);//用于控制错误弹窗的显示
export const showSuccess = writable(false);//用于控制成功弹窗的显示
export const message = writable('');//用于控制弹窗的消息内容
export const isLogin = writable(false);//用于控制登录状态
export const currentConversationID = writable('');//用于控制当前的会话ID
export const isStreaming = writable(false);//用于控制是否正在流式传输
export function showErrorMessage(msg:string){
    message.set(msg);
    showError.set(true);
}
export function showSuccessMessage(msg:string){
    message.set(msg);
    showSuccess.set(true);
}