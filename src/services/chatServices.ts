import {createTimeOutFetch} from "../utils/generalUtils";
import {get} from "svelte/store";
import {userID} from "../stores/userStores";

//获取conversation列表
export async function getChatList(){
    try{
        let response = await createTimeOutFetch()(`https://api.uugpt.com/ai/conv/list?uid=${get(userID)}`);
        if(response.ok){
            const data = await response.json();
            return data;
        }else{
            return 1;
        }
    }catch(e){
        return 1;
    }
}