<script>
    import SvelteMarkdown from "svelte-markdown";
    import { onMount } from "svelte";
    import titleImg from "../../assets/home/bg.png";

    let content = "";
    let loading = true;
  
    onMount(async () => {
      try {
        const lang = localStorage.getItem('locale') || "en";
        // 添加?raw查询参数并移除.default
        const mdContent = await import(`../../locales/docs/changelog.${lang}.md?raw`);
        content = mdContent.default.toString();
      } catch (e) {
        console.error("Fail to load", e);
        content = `# Error\nFail to Load the page：${e.message}`; // 显示具体错误信息
      } finally {
        loading = false;
      }
    });
  </script>
  
  {#if loading}
    <div class="text-center">loading...</div>
  {:else}
    <div class="full-width-banner"> 
        <img 
        src={titleImg}
        alt="Changelog Header"
        class="header-image"
        />
        <!-- <div class="banner-overlay">  // 新增文字遮罩层
        <h1 class="banner-title">{$LL.changelogTitle()}</h1>
        </div> -->
    </div>
    <main class="max-w-4xl mx-auto px-4 py-8 changelog-content">
      <SvelteMarkdown 
        source={content}
      />
    </main>
  {/if}
  
  <style global>
    .changelog-content :global(h1) {
      @apply text-3xl font-bold mt-4 mb-6 relative pl-4;
    }
    .changelog-content :global(h2) {
      @apply text-2xl font-bold mt-12 mb-6 relative pl-4;
      background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .changelog-content :global(p) {
      @apply text-lg font-bold mt-6 mb-4 relative pl-4;
    }
  
  
    .changelog-content :global(ul) {
      @apply list-none pl-8 space-y-4 relative;

    }
  
    .changelog-content :global(li) {
      @apply pl-6 relative;
    }
  
    /* 新增版本标签 */
    .changelog-content :global(h3) {
      @apply inline-block px-3 py-1 mb-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full;
    }

      /* 新增头图样式 */
  .full-width-banner {
    @apply relative w-full h-48 overflow-hidden;
  }

  .header-image {
    @apply w-full h-full object-cover object-center;
    filter: brightness(0.9);
  }

  .banner-overlay {
    @apply absolute inset-0 bg-gradient-to-r from-blue-800/60 to-purple-800/40 
           flex items-center justify-center;
  }

  .banner-title {
    @apply text-4xl font-bold text-white tracking-wide 
           drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)];
  }
  </style>