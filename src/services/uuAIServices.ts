import { SSE } from 'sse.js';
import { get, writable } from 'svelte/store';
import {messages, userRequestedStreamClosure,isStreaming ,streamContext} from "../stores/stores";
import {setMessagesHistory} from "../manages/messageManages";
import { countTicks } from '../utils/generalUtils';
import { t } from "svelte-i18n";

let currentmid = null;
let globalSource: EventSource | null = null;  

let timeoutId: NodeJS.Timeout | null = null; // 用于超时检测
export const closeStream = async()=>{
    console.log(currentmid);
    globalSource?.close();
    let cm = get(messages);
    if(currentmid<0){
        currentmid = cm.length-1;
    }
    cm[currentmid].content = cm[currentmid].content.replace(/█+$/, '') ||  get(t)("app.linkError");
    setMessagesHistory(cm);
    isStreaming.set(false);
    currentmid = null;
}


const resetTimeout = (source: EventSource, currentMessages: any[], mid: number, streamText: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    timeoutId = setTimeout(() => {
      // 10秒内未收到任何消息，认为连接失败
    //   console.error('10秒内未收到任何消息，连接失败');
      source.close();
      isStreaming.set(false);
        
      if (mid < 0) {
        setMessagesHistory([...currentMessages, {
          role: 'assistant',
          content: streamText.replace(/█+$/, '') || get(t)("app.linkError"),
          isLiked: false,
          isDisliked: false
        }]);
      } else {
        currentMessages[mid].content = streamText.replace(/█+$/, '') ||  get(t)("app.linkError");
        setMessagesHistory(currentMessages);
      }
  
      streamText = ''; // 清空streamText
      currentmid = null;
    }, 20*1000); // 20 秒超时
  };

export async function sendMessage(msg:any,mid:number) {

    userRequestedStreamClosure.set(false);
    let hasError = false;
    let currentMessages = get(messages);
    let tickCounter =0;
    let ticks = false;
    currentMessages = [...currentMessages];
    if(mid <0){
        setMessagesHistory([...currentMessages,{
            role:'assistant',
            content:"█"+ (ticks ? "\n```" : ""),
            isLiked:false,
            isDisliked:false
        }]);
    }else{
        currentMessages[mid].content = "█";

            // currentMessages[mid].content = streamText;
        
        setMessagesHistory(currentMessages);
    }

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
        resetTimeout(source, currentMessages, mid, streamText);
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
                            // content:streamText +  "█"+ (ticks ? "\n```" : ""),
                            content:streamText +  "█",
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
            currentmid = null;
        }

    });

    source.addEventListener('error',()=>{
        resetTimeout(source, currentMessages, mid, streamText);
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
        currentmid=null;
    });

    source.stream();  
    globalSource = source;  
    currentmid = mid;
     // 开始时初始化超时检测
    resetTimeout(source, currentMessages, mid, streamText);
}