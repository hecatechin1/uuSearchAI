<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  export let showModal = false;
  export let processing = false;
  export let success = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }
</script>

{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">
        {#if processing}
          {$t('pricing.paymentProcessing')}
        {:else if success}
          {$t('pricing.paymentSuccess')}
        {:else}
          {$t('pricing.paymentFailure')}
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
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" on:click={closeModal}>
        {$t('pricing.close')}
      </button>
    </div>
  </div>
  <div class="fixed inset-0 bg-black opacity-50 z-40"></div>
{/if}
