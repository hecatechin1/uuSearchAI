import { userID, userEmail, userLevel, userTokens, userVipTime, currentChat,getEmailCodeId } from '../stores/userStores';
import { isLogin } from "../stores/globalParamentStores";
import { getInfo, checkEmail, sendEmailCode,verifycode } from "../services/usersServices";
export async function getUserInfo() {
    getInfo().then((data) => {
        if (data.code != 0) {
            return;
        }
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