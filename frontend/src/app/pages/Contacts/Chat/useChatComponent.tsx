
import SenderMessage from "@/components/core/Feed/Post/Comments/SenderMessage";
import Message from "./Message";
import api from "@/libs/api";
import { ChatSample, MessageActionDTO, MessageDTO } from "@/libs/api/services/api.chat";
import { useUserStore } from "@/libs/store/User/STUser";
import { Box, Flex, For } from "@chakra-ui/react";
import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";


type Action = { type: 'DELETE_MESSAGE'|'UPDATE_MESSAGE'|'SEND_MESSAGE'; message: MessageDTO }


export default function useChatComponent () {
  const userStore = useUserStore();
  const [ chat, setChat ] = useState<ChatSample>();
  const [ messages, setMessages ] = useState<MessageDTO[]>([]);
  const [ _,startTransition] = useTransition();

  function toConnectChatById(chatId: string) {
    startTransition(async () => {
      const resp = await api.ChatService.connect(chatId);
      const {messages, ...chat} = resp.parsedData;
      setChat(chat) 
      setMessages(messages);
    });
  }

  async function sendMessage(value: string) {
    if(chat) {
      api.ChatService.sendMessage(
        value, userStore.user_id, chat.id 
      )
    }
  }

  return {
    toConnectChatById,
    Chat: () => {
      const refChat = useRef<HTMLDivElement>(null);
      const [optimisticMessages, setOptimisticMessages] = useOptimistic<MessageDTO[], Action>(messages, (prevMessages, action) => {
        switch (action.type) {
          case 'SEND_MESSAGE': return [...prevMessages, action.message];
          case 'DELETE_MESSAGE': return prevMessages.filter(({ id }) => id !== action.message.id);
          case 'UPDATE_MESSAGE': return prevMessages.map((message) => 
              message.id === action.message.id ? {...action.message} : message
            );
          default:
            return prevMessages;
        }
      });
      
      function toScrollDown () {
        if (refChat.current && messages.length > 0) {
          refChat.current.scrollTop = refChat.current.scrollHeight;
        }
      }

      useEffect(() => {
        if(api.ChatService.chat) {
          toScrollDown();
          api.ChatService.listenerMessages(({data, action}: MessageActionDTO) => {
            startTransition(async () => {
              await setOptimisticMessages({
                type: action, 
                message: data
              });
              await toScrollDown();
            })
          })
        }
       
      }, [api.ChatService.chat])

      return !!chat && (
        <Flex flexDir={"column"} h="full" flexGrow={1} pt="2">
          <Flex ref={refChat} transition={"opacity 0.2s ease"} className="hiddenScrollBar" flexGrow={1} flexDir={"column"} h="full" px="2" overflowY={"auto"}>
            <Box>
              <For each={optimisticMessages}>
                {(props, i) => {
                  const isShowName = optimisticMessages[i-1]?.sender_id === props.sender_id;
                  const msgDate_curr = getTimeOfMessage(props.created_at);
                  const msgDate_prev = getTimeOfMessage(optimisticMessages[i-1]?.created_at);
                  const isShowDate = msgDate_curr === msgDate_prev;

                  return (
                    <Message 
                    key={props.id}
                    formattedData={msgDate_curr}
                    isShowDate={isShowDate}
                    isShowName={isShowName} 
                    {...props}/>
                  ); 
                }}
              </For>
            </Box>
          </Flex>
          <SenderMessage isMessage={true} cb={sendMessage}/>
        </Flex>
      )
    }
  }
};

function getTimeOfMessage(created_at: string) {
  const nowDate = new Date();
  const dateMessage = new Date(created_at);
  const diffTime = nowDate.getTime() - dateMessage.getTime(); 
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "сегодня";
  } else if (diffDays === 1) {
    return "вчера";
  } else if (diffDays > 1 && diffDays < 30) {
    return dateMessage.toLocaleDateString('ru-RU', { day: 'numeric', weekday: 'long' });
  } else if (diffDays >= 30 && diffDays < 365) {
    return dateMessage.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  } else {
    return dateMessage.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

