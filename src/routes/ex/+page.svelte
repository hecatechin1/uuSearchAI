<script>
  import Login from "$lib/Login.svelte";
  import ModelSelector from '$lib/AIModelSelector.svelte';
  import AiModelSelector from "$lib/AIModelSelector.svelte";

  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }


  
</script>
<!-- <div class="flex items-center justify-center min-h-screen">
  {#if !closeCard }  -->
  <!-- isPage控制是否显示关闭按钮，登录页面不显示，close-card用来通知父组件关闭登录卡片 -->
  <!-- <Login isPage={true} on:close-card={closeLoginCard}/>
  {/if}

</div> -->

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
  <h1 class="text-4xl font-semibold mb-8">欢迎使用模型选择器</h1>

  <!-- 使用 ModelSelector 组件 -->
 <AiModelSelector />
</main>