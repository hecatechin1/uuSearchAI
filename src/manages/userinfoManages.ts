import { userID, userEmail, userLevel, userTokens, userPlanEndtime,userPlanMode,userSubMode,getEmailCodeId, userAvatar, userType } from '../stores/userStores';
import { isLogin,isGuest } from "../stores/globalParamentStores";
import {sendForgetEmailCode,changePassword, getInfo, checkEmail, sendEmailCode,verifycode,setPassword,resetPassword,login, updateData,getUserData, guestSignup,logout,getMaxthonUserInfo,loginMxUser } from "../services/usersServices";
import {hash256,getCookieValue} from "../utils/generalUtils";
import {sendKey,lineBreakKey,language} from "../stores/settingsStores";
import {get} from "svelte/store";
// import {} from "cookie";



export async function userLoginForMaxthon(){
    let mxtoken = getCookieValue('MXTOKEN');
    if(mxtoken!=null){
        let mxProfileData = await getMaxthonUserInfo(mxtoken);
        if(mxProfileData!=1){
            let logindata = await loginMxUser(mxtoken);
            if(logindata.code==0){
                userEmail.set(mxProfileData.account);
                userAvatar.set(mxProfileData.avatar_url == "" ? "" : mxProfileData.avatar_url);
                userType.set('maxthon');
                return;
            }
        }
    }
}

export async function getUserInfo() {
    let uugpt_ut = getCookieValue('uugpt_ut');
    if(uugpt_ut==null){
       return 1; 
    }
    let data = await getInfo();
    if (data.code != 0) {
        return 1;
    }
    userID.set(data.info.uid);
    if(get(userType) != 'maxthon') userEmail.set(data.info.email);
    if(data.info.pay){
        userPlanEndtime.set(data.info.pay.endTime);
        userPlanMode.set(data.info.pay.product);
        userSubMode.set(data.info.pay.mode);
    }
    getUpdateUserData_Settings();
    isLogin.update(v=>{
        if(get(userType)!=='maxthon' && get(userEmail) == null){
            isGuest.set(true);
            return false;
        }else{
            isGuest.set(false);
            return true;
        }

    });
}

export async function userLogout(){
    document.cookie = 'uugpt_ut=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.uugpt.com; path=/;';
    return 0;

}
export async function checkUserEmail(email: string) {
    let data = await checkEmail(email);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return 1;
    }
    return data.exist;
}
export async function sendUserEmailCode(email: string){
    let data = await sendEmailCode(email,getEmailCodeId(true));
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return 1;
    }
    return 0;
}
export async function checkverifycode(code: string){
    let data = await verifycode(code,getEmailCodeId());
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}

export async function setUserPassword(email:string,password:string,verifyCode:string){
    password = await hash256(password);
    let data;
    if(get(userID)!==''){
        data = await resetPassword(email,password,verifyCode);
    }else{
        data = await setPassword(email,password);
    }
     
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}
//忘记密码——重置密码
export async function resetUserPassword(email:string,password:string,verifyCode:string){
    password = await hash256(password);
    let data = await resetPassword(email,password,verifyCode);
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}

//已登录用户——更改密码
export async function changeUserPassword(email:string,password:string){
    password = await hash256(password);
    let data = await changePassword(email,password);
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}

export async function userLogin(email:string,password:string){
    password = await hash256(password);
    let data = await login(email,password);
    if (data == 1) {
        return {code:1,msg:1};
    }
    if (data.code!= 0) {
        return {code:data.code,msg:data.msg};
    }
    // userID.set(data.uid);
    // userEmail.set(data.email);
    // isLogin.set(true);
    getUserInfo();//重新请求用户数据，更新用户信息
    return {code:data.code,msg:data.msg};
}

export async function UpdateUserData_Settings(send:string,linebreak:string,lang:string){
    let data = await updateData({sendkey:send,linebreakkey:linebreak,language:lang});
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}

export async function getUpdateUserData_Settings(){
    let data = await getUserData();

    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    let userdata = data.data;
    if(userdata.sendkey){
        sendKey.set(userdata.sendkey);
    }
    if(userdata.linebreakkey){
        lineBreakKey.set(userdata.linebreakkey);
    }
    if(userdata.language){
        language.set(userdata.language);
    }
    language.set(userdata.language);
    return 0;
}

export async function guest_signup(){
    let data = await guestSignup();
    
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    isGuest.set(true);
    userID.set(data.uid);
    return 0;
}

export async function sendForgetCode(email:string){
    let data = await sendForgetEmailCode(email);
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    return 0;
}
