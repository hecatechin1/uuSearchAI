<script>
    import SvelteMarkdown from "svelte-markdown";
    import { onMount } from "svelte";
    // import { language } from "../../stores/settingsStores";
    // import { get } from "svelte/store";
  
  
    let contactEmail = "contact@example.com";
    contactEmail = contactEmail.replace(
      /(\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b)/g,
      '`$1`'
    );
    let writtenDate = "2025-03-14";
    let updateDate = "2025-03-14";
  
    let content = "";
    let loading = true;
  
    onMount(async () => {
      try {
        const lang = localStorage.getItem('locale') || "en";
        // 添加?raw查询参数并移除.default
        const mdContent = await import(`../../locales/docs/privacy.${lang}.md?raw`);
        content = mdContent.default
          .toString()
          .replace(/{contactEmail}/g, contactEmail)
          .replace(/{writtenDate}/g, writtenDate)
          .replace(/{updateDate}/g, updateDate);
      } catch (e) {
        console.error("Failed to load markdown:", e);
        content = `# Error\n加载失败：${e.message}`; // 显示具体错误信息
      } finally {
        loading = false;
      }
    });
  </script>
  
  {#if loading}
    <div class="text-center">Loading...</div>
  {:else}
    <main class="max-w-4xl mx-auto px-4 py-8">
      <SvelteMarkdown
       source={content} 
       />
    </main>
  {/if}
  
  <style global>
      main :global(h1) {
        @apply text-3xl font-bold mt-8 mb-6 pb-2 border-b border-gray-200;
      }
      
      main :global(h2) {
        @apply text-2xl font-semibold mt-8 mb-4;
      }
    
      main :global(h3) {
        @apply text-xl font-medium mt-6 mb-3;
      }
    
      main :global(p) {
        @apply text-gray-700 leading-relaxed mb-4;
      }
    
      main :global(ul) {
        @apply list-disc pl-8 mb-4 space-y-2;
      }
    
      main :global(ol) {
        @apply list-decimal pl-8 mb-4 space-y-2;
      }
    
      main :global(code) {
        @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
      }
    
      main :global(pre) {
        @apply bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-6;
      }
    
      main :global(pre code) {
        @apply bg-transparent p-0;
      }
    
      main :global(blockquote) {
        @apply border-l-4 border-gray-300 pl-4 text-gray-600 italic my-4;
      }
    
      main :global(table) {
        @apply w-full border-collapse my-6 text-left; 
    }

    main :global(th) {
        @apply bg-gray-50 py-3 px-4 font-semibold border-b border-gray-200 text-left;
    }

    main :global(td) {
        @apply py-3 px-4 border-b border-gray-200 text-left;
    }
    
      main :global(a) {
        @apply text-blue-600 hover:text-blue-800 hover:underline transition-colors;
      }
    </style>