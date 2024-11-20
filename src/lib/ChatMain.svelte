<script lang="ts">
    import ChatMessage from '$libs/ChatMessage.svelte';
    import { t } from 'svelte-i18n'; // 导入本地化方法
    import { writable } from 'svelte/store';
    import {
        messages,
        sendKey,
        lineBreakKey,
    } from "$stores/stores";
  
    export let selectedChatId;
  
    let messages = writable([
      { role: 'user', content: 'Hello!', ai: 'GPT', model: 'GPT 4.0' },
      { role: 'assistant', content: 'Hi there! How can I help you?', ai: 'GPT', model: 'GPT 4.0' },
    ]);
  
    let userInput = '';
  
    const sendMessage = () => {
      if (!userInput.trim()) return;
  
      messages.update((msgs) => [
        ...msgs,
        { role: 'user', content: userInput.trim(), ai: 'GPT', model: 'GPT 4.0' },
      ]);
      userInput = '';
    };
  </script>
  
  <div class="flex-1 flex flex-col">
    <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
      {#if $messages.length > 0}
        {#each $messages as message, i}
            <ChatMessage {message} index={i} />
        {/each}
      {:else}
        <div class="flex justify-center items-center h-full">
          <p>{$t("app.noConversation", { default: 'No coversation now, you can ask AI anything.' })}</p>
        </div>
      {/if}
    </main>
  
    <footer class="bg-white p-4 border-t">
      <div class="flex gap-4">
        <textarea
          placeholder={$t('app.placeholder', { default: 'Type your message...' })}
          bind:value={userInput}
          rows="1"
          class="flex-1 resize-none border rounded px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
        <button
          on:click={sendMessage}
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          {$t('app.send', { default: 'Send' })}
        </button>
      </div>
    </footer>
  </div>
  