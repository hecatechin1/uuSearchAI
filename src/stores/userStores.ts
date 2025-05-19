import { type Writable, writable,get } from "svelte/store";

//userID
export const userID = writable('');
//email
export const userEmail = writable('');
//会员等级
export const userLevel = writable(0);

//token
// export const userTokens = writable(-1);
//token使用量
//freeToken
export const used_FreeTokens = writable(0);
//normalToken
export const used_NormalTokens = writable(0);
//expensiveToken
export const used_ExpensiveTokens = writable(0);

//会员时长
export const userPlanEndtime = writable(0);
//会员类型
export const userPlanMode = writable('uugpt_free');
//订阅类型
export const userSubMode = writable('free');
//用户头像
export const userAvatar = writable('');
//用户昵称
export const userNickname = writable('');
//用户类型，普通用户，遨游用户，google用户
export const userType = writable('');


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


//根据会员类型获取最大设备数量
export function getMaxDeviceByPlan(){
    let plan = get(userPlanMode);
    if(/free/i.test(plan)){
      return 2; 
    }
    if(/basic/i.test(plan)){
      return 5; 
    }
    if(/pro/i.test(plan)){
      return 10; 
    }
  }
