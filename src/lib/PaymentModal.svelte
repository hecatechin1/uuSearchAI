<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import successIcon from '../assets/pricing/success.svg';
  import failureIcon from '../assets/pricing/failure.svg';

  export let showModal = false;
  export let processing = false;
  export let success = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  let modalWidth = window.innerWidth >= 640 ? '440px' : '90%';
</script>

{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg" style="width: {modalWidth}">
      <h2 class="text-2xl font-bold mb-4">
        {#if processing}
          {$t('pricing.paymentProcessing')}
        {:else if success}
          <img src={successIcon} alt="Success" class="inline-block mr-2 w-10 h-10" /> {$t('pricing.paymentSuccess')}
        {:else}
          <img src={failureIcon} alt="Failure" class="inline-block mr-2  w-10 h-10" /> {$t('pricing.paymentFailure')}
        {/if}
      </h2>
      <p class="text-gray-700 mb-4">
        {#if processing}
          {$t('pricing.paymentProcessingMessage')}
        {:else if success}
          {$t('pricing.paymentSuccessMessage')}
        {:else}
          {$t('pricing.paymentFailureMessage')}
        {/if}
      </p>
      <div class="text-right">
        <button
          class="bg-themegreen text-white px-4 py-2 rounded hover:bg-themegreenhover disabled:opacity-0"
          on:click={closeModal}
          disabled={processing}
        >
          {$t('pricing.close')}
        </button>
      </div>
    </div>
  </div>
  <div class="fixed inset-0 bg-black opacity-50 z-40"></div>
{/if}