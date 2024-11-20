<script lang="ts">
    import {t} from 'svelte-i18n'; // 导入本地化方法
    export let message;
    export let index;

    import CopyIcon from "../assets/copy.svg";
    import RetryIcon from "../assets/retry.svg";
    import UserIcon from "../assets/UserIcon.svg";
    import RobotIcon from "../assets/aianswer-avtar.svg";
    import MoreIcon from "../assets/moreactions.svg";
    import EditIcon from "../assets/edit.svg";
    import GPTIcon from "../../assets/gpt.svg";
    import ClaudeIcon from "../assets/claude.svg";
    import GeminiIcon from "../assets/gemini.svg";
    import LikeIcon from "../assets/helpful.svg";
    import DislikeIcon from "../assets/unhelpful.svg";
    import LikeActiveIcon from "../assets/helpful-checked.svg";
    import DislikeActiveIcon from "../assets/unhelpful-checked.svg";

    let isShowUserFirstQuery = true;

    import { copyTextToClipboard } from "../utils/generalUtils";

    const copyMessage = () => {
        copyTextToClipboard(message.content.replaceAll('\\n','\n'));
        alert($t('app.copied', { default: 'Copied!' }));
    };

    const likeMessage = () => (message.likes = true);
    const dislikeMessage = () => (message.dislikes = true);
    const retryMessage = () => alert($t('app.retrying', { default: 'Retrying...' }));



</script>

{#if message.role === "assistant"}
    <div class="message relative inline-block bg-primary mt-0 flex flex-col transition-all duration-200 ease-in-out">
        <div class="profile-picture flex align-middle">
            <img src={RobotIcon} alt="Robot Icon" class="w-8 h-8 rounded-full" />
            <div class="text-sm ml-2 ont-bold">
                {$t('app.assistantName', { default: 'uuGPT' })}
            </div>
        </div>
    </div>
{:else if message.role === "user"}
    <div class="message relative inline-block bg-primary mt-0 flex flex-col transition-all duration-200 ease-in-out">
        <div class="profile-picture flex align-middle">
            <img src={UserIcon} alt="User Icon" class="w-8 h-8 rounded-full" />
            <div class="text-sm ml-2 ont-bold">
                {$t('app.userName', { default: 'User' })}
            </div>
        </div>
    </div>
{/if}