import { type Writable, writable } from "svelte/store";
export interface CustomMessage {
    'role': string,
    'content': string,
    'isLiked': boolean,
    'isDisliked': boolean
}
export const messages: Writable<CustomMessage[]> = writable([]);