import { createTimeOutFetch } from "../utils/generalUtils";
import { get } from "svelte/store";
import { userID, language } from "../stores/userStores";
import { isNewchat, isStreaming,browser_signature } from "../stores/globalParamentStores";

export async function createPayment(plan:string,suc_url:string,can_url:string,lang:string){
    try {
        let res = await createTimeOutFetch()(`https://api.uugpt.com/user/pay/createPayment`,{
          method:"POST",
          credentials: 'include',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            product:plan,
            success_url:suc_url,
            cancel_url:can_url,
            lang:lang,
          })
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        } else {
          return 1;
        }
      } catch (error) {
        return 1;
      }

}

export async function getAiLimit() {
    try {
    let res = await createTimeOutFetch()(`https://api.uugpt.com/ai/limit/`, {
      method: "GET",
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return 1;
    }
  } catch (error) {
    return 1;
  }
}

//直接跳转链接，函数弃用
// export async function planManage(){
//     try {
//         let res = await createTimeOutFetch()(`https://api.uugpt.com/user/pay/manage-subscriptiont`);
//         if (res.ok) {
//           const data = await res.json();
//           return data;
//         } else {
//           return 1;
//         }
//       } catch (error) {
//         return 1;
//       }

// }