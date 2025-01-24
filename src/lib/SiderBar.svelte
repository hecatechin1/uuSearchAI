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
    "0": "今天",
    "1": "昨天",
    "3": "三天前",
    "7": "一周前",
    "30": "一个月前",
    "180": "半年前",
    "365": "一年前",
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
      showSuccessMessage("修改成功");
    } else {
      showErrorMessage("修改失败");
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
              ><span class="sr-only">显示边栏</span><svg
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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-xl-heavy"
                  ><path
                    d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
                    fill="currentColor"
                  ></path></svg
                >
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
            class="flex flex-col gap-2 text-token-text-primary text-sm false mt-2 pb-2"
          >
            <!--日期循环开始 新聊天-->
            {#if $isNewchat}
              <div class="relative mt-2 first:mt-0 last:mb-3">
                <div class="sticky top-0 z-20 bg-gray-100">
                  <span class="flex h-9 items-center">
                    <h3
                      class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary"
                    ></h3>
                  </span>
                </div>
                <ol>
                  <li class="relative">
                    <div
                      class="no-draggable group relative rounded-lg active:opacity-90 hover:bg-themegreyhover cursor-pointer"
                    >
                      <span class="flex items-center gap-2 p-2">
                        <div
                          class="relative grow overflow-hidden whitespace-nowrap"
                        >
                          新聊天
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
                      class="px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-token-text-primary"
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
