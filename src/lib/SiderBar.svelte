<script lang="ts">
  import { init, t } from "svelte-i18n"; // 导入本地化方法
  import avatarIcon from "../assets/login/avatar-default.svg";
  import { get } from "svelte/store";
  import { userID, userEmail } from "../stores/userStores";
  import { chat_list, current_chat_id, dataLoaded } from "../stores/chatStores";
  import {
    closeStream,
    getChatListData,
    createNewChat,
    renameChat,
  } from "../manages/chatManages";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    showErrorMessage,
    showSuccessMessage,
    isNewchat,
    showSidebar,
    showSidebarMd,
    isLogin,
  } from "../stores/globalParamentStores";
  import SideBarContexMenu from "$lib/SideBarContexMenu.svelte";
  import SearchChat from "$lib/SearchChat.svelte";
  import { clickOutside } from "../utils/generalUtils";

  const dispatch = createEventDispatcher();
  $: hiddenClass = $showSidebar ? "" : "hidden";
  $: mdHiddenClass = $showSidebarMd ? "" : "max-md:hidden";
  showSidebarMd.subscribe((v) => {
    showSidebar.set(true);
    return v;
  });
  let activeIndex = -1;
  let showMenuIndex = -1;
  // let showSidebar = true;
  // let showSidebarMd = false;
  let showSidebarMenu = false;
  let isReady = false;
  let daysdiff: any = {
    "0": $t("app.date.today"),
    "1": $t("app.date.yesterday"), 
    "3": $t("app.date.threeDaysAgo"),
    "7": $t("app.date.oneWeekAgo"),
    "30": $t("app.date.oneMonthAgo"),
    "180": $t("app.date.halfYearAgo"),
    "365": $t("app.date.oneYearAgo"),
  };
  let dataGroup: any = {};
  let dataGroupsKeys: any[] = [];
  let menuTop = 0;
  let menuLeft = 0;
  let menu_index = 0;
  let isShowRenameBox = false;
  let renameIndex = -1;
  let renameValue = "";
  let showSearchBox = false;
  onMount(async () => {
    dataLoaded.subscribe((v) => {
      if (v) {
        isReady = true;
      }
    });
    current_chat_id.subscribe((v) => {
      localStorage.setItem("current_chat_id", v.toString());
      let index = get(chat_list).findIndex((c) => c.cid == v);
      activeIndex = index;
    });
    isNewchat.subscribe(async (v) => {
      console.log(v,isReady);
      if (!v && isReady) {
        let res = await getChatListData();
      }
    });
    chat_list.subscribe((v) => {
      initlist();
    });
  });

  function initlist() {
    let group: any = {};
    let list = get(chat_list);
    if (list.length != 0) {
      for (let i = 0; i < list.length; i++) {
        let diff = list[i].daydiff;
        let label = getLabel(diff);
        if (!(label in group)) {
          group[label] = [];
        }
        group[label].push(i);
      }
    }
    dataGroupsKeys = Object.keys(group).sort((a, b) => Number(a) - Number(b));
    dataGroup = group;
  }
  function getLabel(day: number) {
    const keys = Object.keys(daysdiff)
      .map(Number)
      .sort((a, b) => a - b);
    if (day == 0) return 0;
    for (let k = 0; k < keys.length - 1; k++) {
      const c = keys[k];
      const n = keys[k + 1];
      if (day >= c && day < n) {
        return c;
      }
    }
    return keys[keys.length - 1];
  }
  function showLoginBox(){
    dispatch('showLoginBox');
  }
  function selectChat(index: number) {
    closeStream();
    activeIndex = index;
    let cc = get(chat_list)[index];
    isNewchat.set(false);
    current_chat_id.set(cc.cid);
    dispatch("selectChat", { selected: cc.cid });
  }
  function showUserMenu(){
    dispatch('show-user-menu');
  }
  //TODO：暂时没有分页功能，之后有了再用
  function handleScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 90) {
      //加载剩余的数据
    }
  }

  function newChat() {
    createNewChat();
  }

  function showMenu(event, index) {
    showMenuIndex = index;
    const rect = event.currentTarget.getBoundingClientRect();
    menuTop = rect.top + rect.height;
    menuLeft = rect.left;
    menu_index = index;
    showSidebarMenu = true;
  }
  function hideMenu() {
    showSidebarMenu = false;
    showMenuIndex = -1;
  }
  function showRenameBox(event: CustomEvent) {
    hideMenu();
    renameValue = $chat_list[event.detail.index].name;
    isShowRenameBox = true;
    renameIndex = event.detail.index;
  }

  async function rename() {
    if ($chat_list[renameIndex].name == renameValue) {
      isShowRenameBox = false;
      renameIndex = -1;
      renameValue = "";
      return;
    }
    // return;
    let code = await renameChat($chat_list[renameIndex].cid, renameValue);
    if (code == 0) {
      showSuccessMessage($t("app.renameSuccess"));
    } else {
      showErrorMessage($t("app.renameFailure"));
    }
    isShowRenameBox = false;
    renameIndex = -1;
    renameValue = "";
  }

  function closeSearchBox() {
    showSearchBox = false;
  }

  function searchBox_newChat() {
    closeSearchBox();
    newChat();
  }

  function searchBox_selectChat(event: CustomEvent) {
    // console.log(event.detail);
    closeSearchBox();
    selectChat(event.detail);
  }
</script>

{#if isReady}
  <aside
    class="z-[21] w-[260px] flex-shrink-0 overflow-x-hidden max-md:!fixed max-md:left-0 max-md:top-0 max-md:!z-50 max-md:border-r flex-col h-full bg-gray-100 {hiddenClass} {mdHiddenClass}"
  >
    <div
      class="draggable relative h-full w-full flex-1 items-start border-white"
    >
      <h2
        style="position:absolute;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;word-wrap:normal"
      >
        {$t("app.historyChats")}
      </h2>
      <nav
        class="flex h-full w-full flex-col px-3"
        aria-label={$t("app.historyChats")}
      >
        <!-- 顶部工具栏 -->
        <div
          class="flex justify-between flex h-[60px] items-center md:h-header-height"
        >
          <span class="flex" data-state="closed">
            <button
              on:click={() => {
                showSidebar.update((v) => {
                  return !v;
                });
              }}
              aria-label={$t("app.closeSidebar")}
              data-testid="close-sidebar-button"
              class="max-md:hidden h-10 rounded-lg px-2 text-themegreen focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-themegreyhover enabled:hover:bg-themegreyhover no-draggable"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-xl-heavy"
                ><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
                  fill="currentColor"
                ></path></svg
              >
            </button>

            <!-- 这个是移动端边栏开关按钮 -->
            <button
              on:click={() => {
                showSidebarMd.update((v) => {
                  return !v;
                });
              }}
              type="button"
              class="inline-flex rounded-md hover:bg-gray-200 focus:bg-gray-200 active:opacity-50 py-1.5 md:hidden"
              data-testid="open-sidebar-button"
              ><span class="sr-only">{$t("app.showSidebar")}</span><svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-lg mx-2 text-themegreen"
                ><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
                  fill="currentColor"
                ></path></svg
              ></button
            >
          </span>
          <div class="flex">
            <span class="flex">
              <button
                on:click={() => {
                  showSearchBox = true;
                }}
                aria-label="Ctrl K"
                class="h-10 rounded-lg px-2 text-themegreen focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-themegreyhover enabled:hover:bg-themegreyhover"
                data-testid="search-button"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-xl-heavy"
                  ><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.75 4.25C7.16015 4.25 4.25 7.16015 4.25 10.75C4.25 14.3399 7.16015 17.25 10.75 17.25C14.3399 17.25 17.25 14.3399 17.25 10.75C17.25 7.16015 14.3399 4.25 10.75 4.25ZM2.25 10.75C2.25 6.05558 6.05558 2.25 10.75 2.25C15.4444 2.25 19.25 6.05558 19.25 10.75C19.25 12.7369 18.5683 14.5645 17.426 16.0118L21.4571 20.0429C21.8476 20.4334 21.8476 21.0666 21.4571 21.4571C21.0666 21.8476 20.4334 21.8476 20.0429 21.4571L16.0118 17.426C14.5645 18.5683 12.7369 19.25 10.75 19.25C6.05558 19.25 2.25 15.4444 2.25 10.75Z"
                    fill="currentColor"
                  ></path></svg
                >
              </button>
            </span>
            <span class="flex">
              <button
                on:click={newChat}
                aria-label={$t("app.newChat")}
                data-tooltip={$t("app.newChat")}
                class="h-10 rounded-lg px-2 text-themegreen focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-themegreyhover enabled:hover:bg-themegreyhover"
                data-testid="clear-search-button"
                type="button"
              >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="currentColor">
                <path id="svg_1" d="m12.55289,1.06482l0.6064,0.00199c5.27267,0.29028 9.48364,4.50125 9.77591,9.82859l0,0.55172a10.24412,10.24412 0 0 1 -1.09947,4.64241a10.38131,10.38131 0 0 1 -13.25324,4.95058l-0.29425,-0.12824l-5.91485,1.97228a0.99409,0.99409 0 0 1 -1.28636,-1.15215l0.02982,-0.10537l1.97029,-5.91584l-0.12724,-0.29326a10.2481,10.2481 0 0 1 -0.78533,-3.59861l-0.00497,-0.37179a10.38131,10.38131 0 0 1 5.73691,-9.28184a10.24909,10.24909 0 0 1 4.64639,-1.10046zm0.55172,1.98818l-0.5547,0a8.26687,8.26687 0 0 0 -3.75071,0.88971a8.39511,8.39511 0 0 0 -4.64142,7.50739c-0.00298,1.30226 0.30121,2.58464 0.88772,3.74673a0.99409,0.99409 0 0 1 0.05567,0.76247l-1.47126,4.40979l4.41079,-1.47026a0.99409,0.99409 0 0 1 0.64119,0.00497l0.12128,0.0507c1.16209,0.58651 2.44547,0.89071 3.74872,0.88772a8.39611,8.39611 0 0 0 7.50739,-4.64539c0.58651,-1.1611 0.89071,-2.44547 0.88772,-3.74673l0.00199,-0.50003c-0.2356,-4.26068 -3.63838,-7.66346 -7.84339,-7.89707l-0.00099,0zm-0.60739,3.97637a0.99409,0.99409 0 0 1 0.99409,0.99409l0,2.48523l2.48523,0a0.99409,0.99409 0 0 1 0,1.98818l-2.48523,0l0,2.48523a0.99409,0.99409 0 0 1 -1.98818,0l0,-2.48523l-2.48523,0a0.99409,0.99409 0 0 1 0,-1.98818l2.48523,0l0,-2.48523a0.99409,0.99409 0 0 1 0.99409,-0.99409z" fill="currentColor"/>
              </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- 聊天列表 -->
        <div
          on:scroll={handleScroll}
          class="flex-col flex-1 transition-opacity duration-500 relative -mr-2 pr-2 overflow-y-auto"
        >
          <div
            class="flex flex-col gap-2 text-sm false mt-2 pb-2"
          >
            <!--日期循环开始 新聊天-->
            {#if $isNewchat}
              <div class="relative mt-2 first:mt-0 last:mb-3">
                <ol>
                  <li class="relative">
                    <div
                      class="no-draggable group relative rounded-lg active:opacity-90 hover:bg-themegreyhover cursor-pointer"
                    >
                      <span class="flex items-center gap-2 p-2">
                        <div
                          class="relative grow overflow-hidden whitespace-nowrap"
                        >
                          {$t("app.newChat")}
                          <div
                            class="absolute bottom-0 top-0 to-transparent right-0 bg-gradient-to-l w-10 from-60%"
                          ></div>
                        </div>
                      </span>
                      <div
                        class="absolute bottom-0 top-0 items-center gap-1.5 pr-2 right-0 flex hidden group-hover:flex"
                      ></div>
                    </div>
                  </li>
                </ol>
              </div>
            {/if}
            <!--日期循环结束-->

            <!--日期循环开始 今天-->
            {#each dataGroupsKeys as key}
              <div class="relative mt-2 first:mt-0 last:mb-3">
                <div class="sticky top-0 z-20 bg-gray-100">
                  <span class="flex h-9 items-center">
                    <h3
                      class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-gray-500"
                    >
                      {daysdiff[key]}
                    </h3>
                  </span>
                </div>
                <ol>
                  {#each dataGroup[key] as chatIndex}
                    <li class="relative">
                      <div
                        class:bg-themegreyhover2={activeIndex == chatIndex}
                        class:bg-themegreyhover={showMenuIndex == chatIndex}
                        class="no-draggable group relative rounded-lg hover:bg-themegreyhover cursor-pointer"
                      >
                        <button
                          on:click={() => {
                            selectChat(chatIndex);
                          }}
                        >
                          <span class="flex items-center gap-2 p-2">
                            <div
                              class="relative grow overflow-hidden whitespace-nowrap"
                            >
                              {$chat_list[chatIndex].name}
                              <div
                                class="absolute bottom-0 top-0 to-transparent right-0 bg-gradient-to-l w-10 from-60%"
                              ></div>
                            </div>
                          </span>
                        </button>
                        <div
                          class:hidden={showMenuIndex != chatIndex}
                          class="absolute bottom-0 top-0 hidden items-center gap-1.5 pr-2 right-0 flex group-hover:flex"
                        >
                          <span>
                            <button
                              on:click={(event) => {
                                showMenu(event, chatIndex);
                              }}
                              class:bg-themegreyhover2={showMenuIndex ==
                                chatIndex}
                              class="btn-custom w-8 flex items-center justify-center text-themegrey transition hover:bg-themegreyhover2"
                              data-tooltip={$t("app.options")}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon-md"
                                ><path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                                  fill="currentColor"
                                ></path></svg
                              >
                            </button>
                          </span>
                        </div>

                        <!-- 重命名div 编辑时显示，失去焦点保存 -->
                        {#if isShowRenameBox && renameIndex == chatIndex}
                          <div
                            use:clickOutside={rename}
                            class="absolute bottom-0 left-[7px] right-2 top-[6px] items-center rounded-lg"
                          >
                            <input
                              on:keyup={(event) => {
                                if (event.key === "Enter") rename();
                              }}
                              class="w-full border bg-transparent p-0 text-sm border-themegreen bg-white focus:outline-none border-2 rounded"
                              autofocus
                              bind:value={renameValue}
                            />
                          </div>
                        {/if}
                      </div>
                    </li>
                  {/each}
                </ol>
              </div>
              <!--日期循环结束-->
            {/each}
          </div>
        </div>

        <!-- 移动端账号数据显示位置 -->
        <div class="flex flex-col py-2 empty:hidden min-md:hidden">
          <div class="flex w-full items-center md:hidden">
            <div class="max-w-[100%] grow">
              <div class="group relative" data-headlessui-state="">
                {#if $isLogin}
                <button
                on:click={showUserMenu}
                class="flex w-full max-w-[100%] items-center gap-2 rounded-lg text-sm group-ui-open:bg-token-sidebar-surface-secondary p-2 hover:bg-token-sidebar-surface-secondary"
                data-testid="accounts-profile-button"
                id="headlessui-menu-button-:rsr:"
                type="button"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
                ><div
                  class="flex-shrink-0"
                  style="view-transition-name: var(--vt-profile-avatar-sidebar);"
                >
                  <div
                    class="flex items-center justify-center overflow-hidden rounded-full"
                  >
                    <div class="relative flex">
                      <img
                        alt="User"
                        width="32"
                        height="32"
                        class="rounded-sm"
                        referrerpolicy="no-referrer"
                        src={avatarIcon}
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="relative -top-px grow -space-y-px truncate text-start text-token-text-primary"
                >
                  <div dir="auto">{$userEmail}</div>
                </div>
              </button>
                {:else}
                <div class="flex items-center">
                  <button on:click={showLoginBox} class="submit-edit rounded-lg px-3 py-1 text-white bg-themegreen hover:bg-themegreenhover hover:text-white h-5}">{$t("login.login")}</button>
                </div>
                {/if}

              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    {#if showSidebarMenu}
      <div use:clickOutside={hideMenu}>
        <SideBarContexMenu
          left={menuLeft}
          top={menuTop}
          index={menu_index}
          on:show-renamebox={showRenameBox}
          on:closeContextMenu={hideMenu}
        />
      </div>
    {/if}

    {#if showSearchBox}
      <div>
        <SearchChat
          on:close={closeSearchBox}
          on:newChat={searchBox_newChat}
          on:selectChat={searchBox_selectChat}
        />
      </div>
    {/if}
  </aside>
{:else}
  <aside
    class="sidebar-skeleton z-[21] flex shrink-0 overflow-x-hidden max-md:!w-0 w-64 flex-col h-full bg-grey-700 w-[260px]"
  >
    <div class="header skeleton"></div>
    <div class="chat-item skeleton"></div>
    <div class="chat-item skeleton"></div>
    <div class="chat-item skeleton"></div>
    <div class="chat-item skeleton"></div>
    <!-- 分布加载转圈loading -->
    <!-- <div class="message-loader"></div> -->
  </aside>
{/if}

<style>
  @import "../styles/skeleton.css";
</style>
