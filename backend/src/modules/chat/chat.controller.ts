import { Elysia, } from "elysia";
import { ChatDTO, type ChatDTOSample, type MessageDTOCreate, type MessageDTODelete, type MessageDTOUpdate } from "./chat.dto";
import ServiceChat from "./chat.service";



import type { TWS } from "./ws";
import isError from "$/utils/isError";



type TServiceChat =  keyof typeof ServiceChat; 

function hasKeyServiceChat<Key extends string>(key: Key) {
  return (key in ServiceChat) as Key extends TServiceChat ? true : false;
}

const clients = new Set<TWS>();
function mailingByUsers(data: any, action: 'DELETE_MESSAGE'|'UPDATE_MESSAGE'|'SEND_MESSAGE') {
  clients.forEach((ws)=> {
    ws.send({action,data});
  });
}

export default (
  new Elysia()
  .get('/chat', async ({ query, error}) => {
    return isError(await ServiceChat.getChatIdByUsers(query), error)
  }, {query: ChatDTO.getChatByUsers})

  .ws('/ws/chat/:id', {
    params: ChatDTO.getChatById,

    open(ws) {
      clients.add(ws);
    },
    
    close(ws) {
      clients.delete(ws); 
    },
    
    async message(ws) {
      const { id } = ws.data.params;
      const { actionKey, message } = ws.body as ChatDTOSample;

      if (hasKeyServiceChat(actionKey)) {
        switch (actionKey as TServiceChat) {
          case 'getChat': return await ServiceChat.getChat(id);
          case 'sendMessage': return mailingByUsers(await ServiceChat.sendMessage(message as MessageDTOCreate), 'SEND_MESSAGE');
          case 'updateMessage':return mailingByUsers(await ServiceChat.updateMessage(message as MessageDTOUpdate), 'UPDATE_MESSAGE');
          case 'deleteMessage':return mailingByUsers(await ServiceChat.deleteMessage(message as MessageDTODelete), 'DELETE_MESSAGE');
        }
      }
    }
  })
);