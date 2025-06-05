import { type Writable, writable, get } from "svelte/store";

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
    'error_code':string;
}
//会话列表
export const chat_list: Writable<Conversation[]> = writable([]);

//当前会话
export const current_chat: Writable<Message[]> = writable([]);

//当前会话id
export const current_chat_id = writable(0);


//当前消息
export const current_message = writable('');

export const dataLoaded = writable(false);

export const models = [
    {
        ai: "openai",
        aiName: "GPT",
        models: [
            { model: "gpt-4o-mini", name: "4o-mini", price: "Lite" },
            { models: "gpt-4.1-mini", name: "4.1-mini", price: "Lite" },
            { model: "gpt-4.1-nano", name: "4.1 nano", price: "Lite" },
            { model: "gpt-4o", name: "4o", price: "Balanced" },
            { model: "gpt-4.1", name: "4.1", price: "Balanced" },
            { model: "o1", name: "o1", price: "Elite" },
            { model: "o1-mini", name: "o1-mini", price: "Balanced" },
            { model: "o3-mini", name: "o3-mini", price: "Balanced" },
            { model: "o3", name: "o3", price: "Elite" }
        ],
    },
    {
        ai: "anthropic",
        aiName: "Claude",
        models: [
            { model: "claude-3.5-haiku", name: "3.5 haiku", price: "Balanced" },
            { model: "claude-3.5-sonnet", name: "3.5 sonnet", price: "Balanced" },
            { model: "claude-4-sonnet-20250514", name: "4 sonnet", price: "Balanced" },
            { model: "claude-3.7-sonnet", name: "3.7 sonnet", price: "Elite" },
            { model: "claude-4-opus-20250514", name: "4 opus", price: "Elite" },
        ],
    },
    {
        ai: "google",
        aiName: "Gemini",
        models: [
            { model: "gemini-2.0-flash-lite-001", name: "2.0 flash lite", price: "Lite" },
            { model: "gemini-flash-1.5", name: "1.5 flash", price: "Lite" },
            { model: "gemini-2.0-flash-001", name: "2.0 flash", price: "Lite" },
            { model: "gemini-pro-1.5", name: "1.5 pro", price: "Balanced" },
        ],
    },
    {
        ai: "deepseek",
        aiName: "Deepseek",
        models: [
            { model: "deepseek-chat:free", name: "V3", price: "Lite" },
            { model: "deepseek-r1:free", name: "R1", price: "Lite" },
        ],
    },
    {
        ai: "qwen",
        aiName: "Qwen",
        models: [
            { model: "qwen-plus", name: "Plus", price: "Balanced" }
        ]
    }
];

export const current_chat_ai = writable(models[0].ai);
export const current_chat_model = writable(models[0].models[0].model);
export const current_chat_ainame = writable('');
export const current_chat_modelname = writable('');
current_chat_ai.subscribe(v => {
    for (let i = 0; i < models.length; i++) {
        if (models[i].ai == v) {
            current_chat_ainame.set(models[i].aiName);
            current_chat_modelname.set(models[i].models[0].name);
            break;
        }
    }
});

current_chat_model.subscribe(v => {
    for (let i = 0; i < models.length; i++) {
        if (models[i].models.find(m => m.model == v)) {
            current_chat_modelname.set(models[i].models.find(m => m.model == v)?.name || models[i].models[0].name);
            break;
        }
    }
});
current_chat_id.subscribe(v => {

    if (v == 0) {
        defaultaimodel();
    }
    let chats = get(chat_list);
    for (let i = 0; i < chats.length; i++) {
        let c = chats[i];
        if (c.cid == v) {
            current_chat_ai.set(c.ai);
            current_chat_model.set(c.model);
            break;
        }
    }
});
export function defaultaimodel() {
    current_chat_ai.set(models[0].ai);
    current_chat_model.set(models[0].models[0].model);
}

export function getAiName(ai:string){
    for (let i = 0; i < models.length; i++) {
        if (models[i].ai == ai) {
            return models[i].aiName;
        }
    }
}

export function getModelName(model:string){
    for (let i = 0; i < models.length; i++) {
        if (models[i].models.find(m => m.model == model)) {
            return models[i].models.find(m => m.model == model)?.name;
        }
    }
}

export function getIndexByCid(cid:number){
    //根据cid获取当前会话在chat_list中的索引
    let chats = get(chat_list);
    for (let i = 0; i < chats.length; i++) {
        let c = chats[i];
        if (c.cid == cid) {
            return i;
        }
    }
}
