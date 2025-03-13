<script>
    import SvelteMarkdown from 'svelte-markdown';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { lang } from '../../stores/globalParamentStores'
    import {
        formatMessageForMarkdown,   
    } from "../../utils/generalUtils"; 
    // import HtmlRenderer from '../../renderers/Html.svelte';
    // import LinkRenderer from "../../renderers/LinkRenderer.svelte";
    // import EmRenderer from "../../renderers/Em.svelte";
    // import ListRenderer from "../../renderers/ListRenderer.svelte";
    // import ListItemRenderer from "../../renderers/ListItem.svelte";
    // import ParagraphRenderer from "../../renderers/Paragraph.svelte";
  
    let contactEmail = "contact"+"@"+"example.com";
    let writtenDate = "2025-03-14";
    let updateDate = "2025-03-14";
    
    let content = "";
    let loading = true;
  
    onMount(async () => {
        try {
        const lang = $page.params.lang || 'en';
        // 添加?raw查询参数并移除.default
        const mdContent = await import(`/src/locales/docs/terms.${lang}.md?raw`);
        
        content = mdContent.default
            .replace(/{contactEmail}/g, () => contactEmail)
            .replace(/{writtenDate}/g, writtenDate)
            .replace(/{updateDate}/g, updateDate);
            
        } catch (e) {
        console.error('Failed to load markdown:', e);
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