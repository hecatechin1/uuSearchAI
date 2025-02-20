import { userID, userEmail, userLevel, userTokens, userPlanEndtime,userPlanMode,userSubMode,getEmailCodeId } from '../stores/userStores';
import { isLogin } from "../stores/globalParamentStores";
import { getInfo, checkEmail, sendEmailCode,verifycode,setPassword,resetPassword,login, updateData,getUserData, guestSignup,logout } from "../services/usersServices";
import {hash256} from "../utils/generalUtils";
import {sendKey,lineBreakKey,language} from "../stores/settingsStores";
import {get} from "svelte/store";

export async function getUserInfo() {
    getInfo().then((data) => {
        if (data.code != 0) {
            return;
        }
        userID.set(data.info.uid);
        userEmail.set(data.info.email);
        if(data.info.pay){
            userPlanEndtime.set(data.info.pay.endTime);
            userPlanMode.set(data.info.pay.product);
            userSubMode.set(data.info.pay.mode);
        }
        getUpdateUserData_Settings();
        isLogin.set(true);
    });


}

export async function userLogout(){
    let data = await logout();
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return 1;
    }
    isLogin.set(false);
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

export async function setUserPassword(email:string,password:string){
    password = await hash256(password);
    let data;
    if(get(userID)!==''){
        data = await resetPassword(email,password);
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

export async function resetUserPassword(email:string,password:string){
    password = await hash256(password);
    let data = await resetPassword(email,password);
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
        return 1;
    }
    if (data.code!= 0) {
        return data.code;
    }
    // userID.set(data.uid);
    // userEmail.set(data.email);
    // isLogin.set(true);
    getUserInfo();//重新请求用户数据，更新用户信息
    return 0;
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
    userID.set(data.uid);
    return 0;
}