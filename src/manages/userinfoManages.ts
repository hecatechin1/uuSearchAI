import { userID, userEmail, userLevel, userTokens, userVipTime,getEmailCodeId } from '../stores/userStores';
import { isLogin } from "../stores/globalParamentStores";
import { getInfo, checkEmail, sendEmailCode,verifycode,setPassword,resetPassword,login } from "../services/usersServices";
import {hash256} from "../utils/generalUtils";

export async function getUserInfo() {
    getInfo().then((data) => {
        if (data.code != 0) {
            return;
        }
        userID.set(data.info.uid);
        userEmail.set(data.info.email);
        isLogin.set(true);
    });


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
    let data = await setPassword(email,password);
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