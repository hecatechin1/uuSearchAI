<script>
  import Login from "$lib/Login.svelte";
  import ModelSelector from '$lib/AIModelSelector.svelte';
  import AiModelSelector from "$lib/AIModelSelector.svelte";

  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }

function loginSuccess(){
  closeLoginCard();
}
  
</script>
<!-- <div class="flex items-center justify-center min-h-screen">
  {#if !closeCard }  
  <Login isPage={true} on:close-card={closeLoginCard} on:login-success={loginSuccess}/>
  {/if}

</div> -->

<!-- <main class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
  <h1 class="text-4xl font-semibold mb-8">欢迎使用模型选择器</h1>

 <AiModelSelector />
</main> -->