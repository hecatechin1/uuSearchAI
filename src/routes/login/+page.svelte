<script>
  import Login from "$lib/Login.svelte";
  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }

function loginSuccess(){
  closeLoginCard();
}
</script>


  {#if !closeCard }  
  <!-- isPage控制是否显示关闭按钮，登录页面不显示，close-card用来通知父组件关闭登录卡片 -->
  <Login isPage={true} on:login-success={loginSuccess}/>
  {/if}


<style>

</style>

