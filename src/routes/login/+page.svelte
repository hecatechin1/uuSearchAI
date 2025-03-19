<script>
  import Login from "$lib/Login.svelte";
  import {TestbaseURL} from "../../stores/globalParamentStores"
  import { get } from 'svelte/store';
  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }

function loginSuccess(){
  closeLoginCard();
  document.location.href =get(TestbaseURL)+ '/chat';
}
</script>


  {#if !closeCard }  
  <!-- isPage控制是否显示关闭按钮，登录页面不显示，close-card用来通知父组件关闭登录卡片 -->
  <Login isResetPassword={false} isPage={true} on:login-success={loginSuccess}/>
  {/if}


<style>

</style>

