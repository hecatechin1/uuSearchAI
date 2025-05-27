<script lang="ts">
    import ShareLinkModal from "../../lib/ShareLinkModal.svelte";
    let isLinkModalOpen = false;
    let shareLink = "https://uugpt.com/share?conversation=123456";
  
    function handleCopyLink() {
      isLinkModalOpen = true;
    }
  </script>
  
  <!-- 在适当位置触发 -->
  <button on:click={handleCopyLink}>Share Link</button>
  <ShareLinkModal bind:isOpen={isLinkModalOpen} {shareLink} />