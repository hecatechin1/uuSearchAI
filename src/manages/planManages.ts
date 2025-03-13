import { userID,language } from '../stores/userStores';
import { get } from "svelte/store";
import { isLogin } from "../stores/globalParamentStores";
import { getInfo, checkEmail, sendEmailCode,verifycode,setPassword,resetPassword,login } from "../services/usersServices";
import {hash256} from "../utils/generalUtils";
import {createPayment} from "../services/planServices"

export async function getPaymentAddress(plan:string,isYearly:boolean){
    let suc_url = "URL_ADDRESS";
    let can_url = "URL_ADDRESS";
    
    let data = await createPayment(plan,suc_url,can_url,get(language));
    console.log(data);
    if (data == 1) {
        return 1;
    }
    if (data.code != 0) {
        return 1;
    }
    return data.url;
}

export async function getPlanManageAddress(){
    return 'https://api.uugpt.com/manage-subscription';
}