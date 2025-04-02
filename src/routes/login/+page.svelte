<script>
  import Login from "$lib/Login.svelte";
  import {TestbaseURL,isLogin} from "../../stores/globalParamentStores"
  import { get } from 'svelte/store';
  import { onMount } from "svelte";
  import browserSignature from "browser-signature";
  import {
    browser_signature,
  } from "../../stores/globalParamentStores";
  import { getCookieValue } from "../../utils/generalUtils";
  import {
    getUserInfo,
    userLoginForMaxthon,
  } from "../../manages/userinfoManages";
  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }

function loginSuccess(){
  closeLoginCard();
  document.location.href =get(TestbaseURL)+ '/chat';
}

onMount(async () => {
  const urlParams = new URLSearchParams(window.location.search);
    let urlParameter = urlParams.get("mxcallback");
    const signature = browserSignature();
    browser_signature.set(signature);
    if (getCookieValue("MXTOKEN") != null || urlParameter != null) {
      await userLoginForMaxthon();
    }
  await getUserInfo();
  if(get(isLogin)){
    loginSuccess();
  }
})
</script>


  {#if !closeCard }  
  <!-- isPage控制是否显示关闭按钮，登录页面不显示，close-card用来通知父组件关闭登录卡片 -->
  <Login isResetPassword={false} isPage={true} on:login-success={loginSuccess}/>
  {/if}


<style>

</style>

