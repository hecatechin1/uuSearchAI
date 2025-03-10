<script lang="ts">
  import { t } from "svelte-i18n";
  import { onMount, createEventDispatcher } from "svelte";
  import {
    chat_list,
    current_chat_ainame,
    current_chat_id,
    current_chat_modelname,
    defaultaimodel,
    models,
  } from "../stores/chatStores";
  import { changeChatModel,createNewChat } from "../manages/chatManages";
  import avatar from "../assets/login/avatar-default.svg";
  import { getElementPostionDiff } from "../utils/generalUtils.js";
  import { showSidebar, isLogin } from "../stores/globalParamentStores";
  import { userAvatar, userType} from "../stores/userStores";

  // export let showSidebar = false;

  let isLogedin = false;
  let showModelSelectorbtn: HTMLElement;
  let dispatch = createEventDispatcher();
  let showTopbarModelMenu = true;

  function showModelSelector() {
    let position = getElementPostionDiff(showModelSelectorbtn);
    dispatch("show-selector", {
      originElement: showModelSelectorbtn,
      position: position,
      callback: selectedCallback,
    });
  }
  function showUserMenu() {
    dispatch("show-user-menu");
  }
  function selectedCallback(ai: string, model: string) {
    changeChatModel(ai, model);
  }
  function showLoginBox() {
    dispatch("showLoginBox");
  }
  onMount(() => {});
</script>

<div
  class="draggable no-draggable-children sticky min-h-[44px] top-0 p-2 mb-1.5 flex items-center justify-between z-10 h-header-height font-semibold bg-white max-md:hidden"
>
  <div class="absolute start-1/2 -translate-x-1/2"></div>
  <div class="flex items-center gap-0 overflow-hidden">
    <!-- 侧边栏关闭时显示的按钮 -->

    {#if !$showSidebar}
      <div class="flex items-center">
        <span class="flex" data-state="closed"          >
          <button
            on:click={() => {
              showSidebar.update((v) => {
                return !v;
              });
            }}
            aria-label={$t("app.closeSidebar")}
            data-testid="close-sidebar-button"
            class="h-10 rounded-lg px-2 text-themegreen focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-themegreyhover enabled:hover:bg-themegreyhover no-draggable"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon-xl-heavy max-md:hidden"
              ><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
                fill="currentColor"
              ></path></svg
            >
          </button>
        </span >
        <span class="flex" data-state="closed">
          <button
          on:click={() => {
            createNewChat(true);
          }}
            aria-label={$t("app.newChat")}
            data-tooltip={$t("app.newChat")}
            class="max-md:hidden h-10 rounded-lg px-2 text-themegreen focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-themegreyhover enabled:hover:bg-themegreyhover"
            data-testid="clear-search-button"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              fill="currentColor"
            >
              <path
                id="svg_1"
                d="m12.55289,1.06482l0.6064,0.00199c5.27267,0.29028 9.48364,4.50125 9.77591,9.82859l0,0.55172a10.24412,10.24412 0 0 1 -1.09947,4.64241a10.38131,10.38131 0 0 1 -13.25324,4.95058l-0.29425,-0.12824l-5.91485,1.97228a0.99409,0.99409 0 0 1 -1.28636,-1.15215l0.02982,-0.10537l1.97029,-5.91584l-0.12724,-0.29326a10.2481,10.2481 0 0 1 -0.78533,-3.59861l-0.00497,-0.37179a10.38131,10.38131 0 0 1 5.73691,-9.28184a10.24909,10.24909 0 0 1 4.64639,-1.10046zm0.55172,1.98818l-0.5547,0a8.26687,8.26687 0 0 0 -3.75071,0.88971a8.39511,8.39511 0 0 0 -4.64142,7.50739c-0.00298,1.30226 0.30121,2.58464 0.88772,3.74673a0.99409,0.99409 0 0 1 0.05567,0.76247l-1.47126,4.40979l4.41079,-1.47026a0.99409,0.99409 0 0 1 0.64119,0.00497l0.12128,0.0507c1.16209,0.58651 2.44547,0.89071 3.74872,0.88772a8.39611,8.39611 0 0 0 7.50739,-4.64539c0.58651,-1.1611 0.89071,-2.44547 0.88772,-3.74673l0.00199,-0.50003c-0.2356,-4.26068 -3.63838,-7.66346 -7.84339,-7.89707l-0.00099,0zm-0.60739,3.97637a0.99409,0.99409 0 0 1 0.99409,0.99409l0,2.48523l2.48523,0a0.99409,0.99409 0 0 1 0,1.98818l-2.48523,0l0,2.48523a0.99409,0.99409 0 0 1 -1.98818,0l0,-2.48523l-2.48523,0a0.99409,0.99409 0 0 1 0,-1.98818l2.48523,0l0,-2.48523a0.99409,0.99409 0 0 1 0.99409,-0.99409z"
                fill="currentColor"
              />
            </svg>
          </button>
          </span >
      </div>
    {/if}

    <button
      bind:this={showModelSelectorbtn}
      on:click={showModelSelector}
      type="button"
      class="relative group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 hover:bg-gray-200 focused:bg-gray-200 font-semibold text-themegrey overflow-hidden whitespace-nowrap"
      ><div class="text-themegrey">
        {$current_chat_ainame}
        <span class="text-themegrey">{$current_chat_modelname}</span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="icon-md text-themegrey"
        ><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
          fill="currentColor"
        ></path></svg
      >
    </button>
  </div>
  {#if $isLogin}
    <div class="gap-2 flex items-center pr-1 leading-[0]">
      <button
        on:click={showUserMenu}
        aria-label={$t("app.openPersonalMenu", {
          default: "Open Profile menu",
        })}
        data-testid="profile-button"
        class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200 focus-visible:bg-gray-200"
        ><div
          class="flex items-center justify-center overflow-hidden rounded-full"
        >
          <div class="relative flex">
            <img
              alt="User"
              width="32"
              height="32"
              class="rounded-sm"
              referrerpolicy="no-referrer"
              src={$userAvatar || avatar }
            />
          </div>
        </div></button
      >
    </div>
  {:else}
    <div class="flex items-center">
      <button
        on:click={showLoginBox}
        class="submit-edit rounded-lg px-3 py-1 text-white bg-themegreen hover:bg-themegreenhover hover:text-white h-5}"
        >{$t("login.login")}</button
      >
    </div>
  {/if}
</div>
<div
  class="no-draggable flex w-full items-center justify-center bg-token-main-surface-primary md:hidden"
></div>
