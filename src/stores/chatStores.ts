import { type Writable, writable ,get } from "svelte/store";
export interface Conversation {
    'cid': number;
    'name': string;
    'tm': number;
    'daydiff': number,
    'ai': string;
    'model': string;
}

export interface Message {
    'message': {
        'role': string;
        'content': string;
    };
    'cid': number;
    'pid': number;
    "mid": number;
    'tm': number;
    'ai': string;
    'model': string;
}
//会话列表
export const chat_list: Writable<Conversation[]> = writable([]);

//当前会话
export const current_chat: Writable<Message[]> = writable([]);

//当前会话id
export const current_chat_id = writable(0);

//当前消息
export const current_message = writable('');


//记录的是models的下标
export const current_chat_ai = writable(0);
//记录的是models的下标
export const current_chat_model = writable(0);


export let models = [
    {
        ai: "openai",
        aiName: "GPT",
        models: [
            { model: "gpt-4o", name: "4o", price: "" },
            { model: "gpt-4o-mini", name: "4o-mini", price: "免费" },
            { model: "gpt-4-turbo", name: "4-turbo", price: "" },
            { model: "gpt-4", name: "4", price: "" },
            { model: "gpt-3.5-turbo", name: "3.5-turbo", price: "" },
        ],
    },
    {
        ai: "anthropic",
        aiName: "Claude",
        models: [
            { model: "claude-3-5-sonnet-20241022", name: "3.5 sonnet", price: "" },
            { model: "claude-3-5-haiku-20241022", name: "3.5 haiku", price: "" },
            { model: "claude-3-opus-20240229", name: "3 opus", price: "" },
            { model: "claude-3-sonnet-20240229", name: "3 sonnet", price: "" },
            { model: "claude-3-haiku-20240307", name: "3 haiku", price: "" },
        ],
    },
    {
        ai: "google",
        aiName: "Gemini",
        models: [
            { model: "models/gemini-1-0-pro", name: "1.0 pro", price: "" },
            { model: "models/gemini-1-0-pro-vision", name: "1.0 pro vision",price: ""},
            { model: "models/gemini-1-5-flash", name: "1.5 flash", price: "" },
            { model: "gemini-1.5-pro", name: "1.5 pro", price: "" },
        ],
    },
];