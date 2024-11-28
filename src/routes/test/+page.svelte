<script>
    import { onMount } from 'svelte';
  </script>
  
  <style>
    @import '../../styles/skeleton.css';
  </style>
  
  <div class="flex h-screen">
    <!-- Sidebar Skeleton -->
    <aside class="sidebar-skeleton z-[21] flex shrink-0 overflow-x-hidden max-md:!w-0 w-64 flex-col h-full bg-grey-700">
      <div class="header skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="message-loader"></div>
    </aside>
  
    <!-- Main Chat Skeleton -->
    <div class="main-chat-skeleton">
      <div class="message skeleton mb-5 message-flex-end"></div>
      <div class="message skeleton"></div>
      <div class="message large skeleton"></div>
      <div class="message skeleton"></div>
    </div>
  </div>
  