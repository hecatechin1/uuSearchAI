<script>
  import Login from "$lib/Login.svelte";
  import ModelSelector from '$lib/AIModelSelector.svelte';
  import AiModelSelector from "$lib/AIModelSelector.svelte";
  import UserContexMenu from "$lib/UserContexMenu.svelte";
  import PaymentModal from "$lib/PaymentModal.svelte";

  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }

function loginSuccess(){
  closeLoginCard();
}

  let showPaymentModal = true;
  let paymentProcessing = true;
  let paymentSuccess = true;


  // 关闭模态框
  function closeModal() {
    showPaymentModal = false;
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

<!-- 模态框组件 -->
<PaymentModal
  showModal={showPaymentModal}
  processing={paymentProcessing}
  success={paymentSuccess}
  on:close={closeModal}
/>

