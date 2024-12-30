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
            { model: "models/gemini-1-0-pro-vision", name: "1.0 pro vision", price: "" },
            { model: "models/gemini-1-5-flash", name: "1.5 flash", price: "" },
            { model: "gemini-1.5-pro", name: "1.5 pro", price: "" },
        ],
    },
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
        console.log(c,v);
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
