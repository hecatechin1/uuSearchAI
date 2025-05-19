import { userID,language } from '../stores/userStores';
import { get } from "svelte/store";
import { isLogin } from "../stores/globalParamentStores";
import { getInfo, checkEmail, sendEmailCode,verifycode,setPassword,resetPassword,login } from "../services/usersServices";
import {hash256} from "../utils/generalUtils";
import {createPayment,getAiLimit} from "../services/planServices"
import {addQueryParam} from "../utils/generalUtils"

export async function getPaymentAddress(plan:string,callbackUrl:string){
    // plan = plan + "_test";
    let suc_url = addQueryParam(callbackUrl,'payback','0');
    let can_url = addQueryParam(callbackUrl,'payback','1');
    let data = await createPayment(plan,suc_url,can_url,get(language));
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return 1;
    }
    return data;
}

export async function getPlanManageAddress(){
    return 'https://api.uugpt.com/pay/manage-subscription';
}

export async function getLimit(){
    let data = await getAiLimit();
    if (data == 1) {
        return 1;
    }
    if (data.code!= 0) {
        return 1;
    }
    return data;
    
}