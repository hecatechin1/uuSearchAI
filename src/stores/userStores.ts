import { type Writable, writable,get } from "svelte/store";

//userID
export const userID = writable('');
//email
export const userEmail = writable('');
//会员等级
export const userLevel = writable(0);
//token
export const userTokens = writable(0);
//会员时长
export const userPlanEndtime = writable(0);
//会员类型
export const userPlanMode = writable('uugpt_free');
//订阅类型
export const userSubMode = writable('free');


//邮箱验证码随机ID
const emailCodeID = writable('');
export function getEmailCodeId(retry:boolean = false){
    if(get(emailCodeID)!='' && !retry){
        return get(emailCodeID);
    }
    let codeID = Math.random().toString(36).substring(2, 15);
    emailCodeID.set(codeID);
    return codeID;
}
//设置五分钟过期
emailCodeID.subscribe((value)=>{
    setTimeout(()=>{
        emailCodeID.set('');
    },5*60*1000);
});
//语言
export const language = writable('');
