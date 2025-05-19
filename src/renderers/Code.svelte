<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { t } from 'svelte-i18n';
  import CopyIcon from "../assets/copy.svg";
  import CheckIcon from "../assets/check.svg";
  import WrapIcon from "../assets/wrap.svg";
  import UnwrapIcon from "../assets/unwrap.svg";
  import hljs from "highlight.js";
  import { marked } from "marked";
  import "highlight.js/styles/default.css";
  import { isStreaming } from "../stores/stores";
  import { get } from 'svelte/store';
    import Html from './Html.svelte';

  export let text=""; // Markdown 中的代码内容
  export let language="";  // 代码语言
  let highlightedCode = "";
  let hj= hljs.highlightAuto(text);
  let wrap = true;
  // if(!get(isStreaming)){
  //   hj = hljs.highlightAuto(text);
  // }
  // let  hj = hljs.highlightAuto(text.replace('\\n', '\n'));

  let copied = false;

  let codeContainer: HTMLDivElement | null = null;// code容器div的dom元素
  let maxWidth = 0; // 用来设置code容器DIV的最大宽度
  const updateMaxWidth = () => {
    if (codeContainer !== null && typeof window !== 'undefined') {
      const parentElement = codeContainer.parentElement;
      if (parentElement) {
        requestAnimationFrame(() => {
          const rootStyle = getComputedStyle(document.documentElement);
          const rootFontSize = parseFloat(rootStyle.fontSize as string);
          // 使用父元素的宽度来计算 maxWidth
          maxWidth = parentElement.clientWidth - 40;
          // 将计算得到的 maxWidth 应用到 codeContainer 的样式上
          if (codeContainer) {
            codeContainer.style.maxWidth = `${maxWidth}px`;
            // 打印设置后的最大宽度
          }
        });
      }
    }
  };
// 高亮代码函数
const highlightCode = () => {
    if (language) {
      highlightedCode = hljs.highlight(language, text).value;
    } else {
      highlightedCode = hljs.highlightAuto(text).value;
    }
  };

   // 初次渲染时高亮代码
   onMount(() => {
    highlightCode();
    updateMaxWidth();
  });

  // 每次 text 更新时重新高亮
  afterUpdate(() => {
    highlightCode();
    updateMaxWidth();
  });
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;  // 设置为 true 显示成功消息
      setTimeout(() => {
        copied = false;  // 3 秒后隐藏成功消息
      }, 2000);
    } catch (error) {
      console.error("Error copying text: ", error);
    }
  };
  
</script>

<div class="code-container"  bind:this={codeContainer}>
  <div class="copycode">
    <div>{language}</div>
    {#if wrap}
    <button class="mr-4" on:click={()=>{wrap=false}}> 
      <img class="inline-block" alt="Wrap" src={UnwrapIcon} />
      {$t('app.unwrap')} 
    </button>

    {:else}
    <button class="mr-4" on:click={()=>{wrap=true}}>
      <img class="inline-block" alt="Unwrap" src={WrapIcon} /> 
      {$t('app.wrap')}  

    </button>
    {/if}
    <button class="" on:click={copyToClipboard}>
      {#if copied}
      <img class="inline-block" alt="Copied" src={CheckIcon} />
      
        <span>{$t('code.copied')}!</span>
      {:else}
      <img class="inline-block copycode-icon" alt="Copy Code" src={CopyIcon} />
      <span>{$t('code.copy')}</span>
      {/if}
    </button>
  </div>
  <!-- <pre style=" { wrap?"white-space: pre-wrap; word-wrap: break-word; overflow-x: auto;":""} "> -->
  <div style="overflow-x: auto;">
    <pre style=" { wrap?"white-space: pre-wrap;":"white-space: pre"} ">
      <code id='testid' >{@html highlightedCode}</code>
    </pre>
  </div>
</div>

<style>
  pre {
    background-color: #0d0d0d;
    border-radius: 0px 0px 10px 10px;
    padding: 20px;
    margin: 0 20px 0 20px;
    opacity: 0;
    animation: fade-in 0.5s ease-in-out forwards;
    margin-bottom: 1rem;
    font-weight: bold;
    overflow-x: auto;
    max-width: calc(100% - 40px); /* 减去 padding 的左右值 */
  }

  .copycode {
    display: flex;
    justify-content: flex-end;
    background-color: #333;
    margin: 0 20px 0 20px;
    border-radius: 10px 10px 0px 0px;
    padding: 0.5rem 1rem 0.5rem 1rem;
    color: rgb(187, 187, 187);
  }

  button {
    font-size: small;
    display: block;
    transition: all 0.1s ease-in-out;
    color: rgb(187, 187, 187);
  }

  button:hover {
    color: white;
  }

  .copycode button img {
    margin: 0;
    filter: brightness(0) invert(0.7);
  }

  .copycode button:hover img {
    filter: brightness(0) invert(1);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .code-container {
    position: relative;
    margin: 0 auto;
  }



</style>