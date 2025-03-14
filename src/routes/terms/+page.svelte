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
      const mdContent = await import(`../../locales/docs/terms.${lang}.md?raw`);
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
