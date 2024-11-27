import { type Writable, writable } from "svelte/store";

//userID
export const userID = writable('');

//email
export const userEmail = writable('');

//会员等级
export const userLevel = writable(0);

//token
export const userTokens = writable(0);

//会员时长
export const userVipTime = writable(0);

//当前会话
export const currentChat = writable('');




