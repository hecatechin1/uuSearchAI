<script lang="ts">
    import { t } from 'svelte-i18n'; // 导入本地化方法
    import {currentChat} from '../stores/userStores';
  
    // 模拟历史聊天记录
    let history = [
      { date: '2024-11-18', chats: [{ id: '1', title: 'Chat 1' }, { id: '2', title: 'Chat 2' }] },
      { date: '2024-11-19', chats: [{ id: '3', title: 'Chat 3' }] },
    ];
  
    export let onSelectChat;
  
    const selectChat = (chatId:string) => {
      // onSelectChat(chatId);
      currentChat.set(chatId);
    };
  </script>
  
  <aside class="w-64 text-white flex flex-col">
    <div class="flex-1 overflow-y-auto p-4">
      {#each history as { date, chats }}
        <div class="mb-6">
          <h3 class="text-gray-400 text-sm mb-2">{date}</h3>
          <ul>
            {#each chats as chat}
              <li class="mb-2">
                <button
                  class="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                  on:click={() => selectChat(chat.id)}
                >
                  {chat.title}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </aside>
  