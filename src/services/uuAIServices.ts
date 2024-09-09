import { SSE } from 'sse.js';
import { get, writable } from 'svelte/store';
import {messages, userRequestedStreamClosure,isStreaming ,streamContext} from "../stores/stores";
import {setMessagesHistory} from "../manages/messageManages";
import { countTicks } from '../utils/generalUtils';
let globalSource: EventSource | null = null;  


export const closeStream = async()=>{

}

export async function sendMessage(msg:any,mid:number) {
    userRequestedStreamClosure.set(false);
    let hasError = false;
    let currentMessages = get(messages);
    let tickCounter =0;
    let ticks = false;
    currentMessages = [...currentMessages];

    let done = false;
    let streamText = "";
    isStreaming.set(true);
    let source = new SSE("https://api.uugpt.com/ai/stream",{
        headers:{
            "Content-Type": "application/json",
        },
        method:"POST",
        payload: JSON.stringify({
            system:"All responses must be in Markdown format.Don't use '---' as devide line.",
            prompt:msg
        })
    });

    source.addEventListener("message",async(e:any)=>{
        if(e.data !== "[DONE]"){
            try{
                if(!hasError){
                    let msgTicks = countTicks(e.data);
                    tickCounter += msgTicks;
                    if (msgTicks === 0) tickCounter = 0;
                    if (tickCounter === 3) {
                      ticks = !ticks;
                      tickCounter = 0;
                    }
                    streamText += e.data;
                    streamContext.set({ streamText});

                    if(mid <0){
                        setMessagesHistory([...currentMessages,{
                            role:'assistant',
                            content:streamText +  "█"+ (ticks ? "\n```" : ""),
                            isLiked:false,
                            isDisliked:false
                        }]);
                    }else{
                        currentMessages[mid].content = streamText+"█";

                            // currentMessages[mid].content = streamText;
                        
                        setMessagesHistory(currentMessages);
                    }

                }
            }catch(error){
                hasError = true;
                source.close();
                isStreaming.set(false);
                return;
            }
        }else{
            streamText = streamText.replace(/█+$/, '');
            // console.log(streamText);
            done = true;
            isStreaming.set(false);
            source.close();

            if(mid <0){
                setMessagesHistory([...currentMessages,{
                    role:'assistant',
                    content:streamText,
                    isLiked:false,
                    isDisliked:false
                }]);
            }else{

                    currentMessages[mid].content = streamText;

                setMessagesHistory(currentMessages);
            }


            streamText = "";

        }

    });

    source.addEventListener('error',()=>{
        streamText = streamText.replace(/█+$/, '');
        isStreaming.set(false);
        source.close();
        if(mid <0){
            setMessagesHistory([...currentMessages,{
                role:'assistant',
                content:streamText,
                isLiked:false,
                isDisliked:false
            }]);
        }else{

                currentMessages[mid].content = streamText;
            
            setMessagesHistory(currentMessages);
        }

        streamText = "";
    });

    source.stream();  
    globalSource = source;  
}