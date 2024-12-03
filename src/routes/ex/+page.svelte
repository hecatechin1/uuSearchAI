<script>
  import Login from "$lib/Login.svelte";


  let closeCard = false;
  function closeLoginCard() {
    closeCard = !closeCard;
  }


  
</script>
<div class="flex items-center justify-center min-h-screen">
  {#if !closeCard } 
  <Login isPage={true} on:close-card={closeLoginCard}/>
  {/if}

</div>
