import { AxiosResponse } from "axios";
import { socket, instance, config } from "../api.config";

const chat = socket('chat');

export default abstract class ChatService {
  static chat:WebSocket;

  static async getChatIdByUsers(params: GetChatByUsersDTO): Promise<AxiosResponse<{id:number}, any>> {
    return await instance.get('/chat', {
      ...config,
      params,
    })
  }

  static async connect(chatId: string): Promise<MessageEvent<ChatDTOSample>> {
    this.chat = chat(chatId);
    return await this.chat.pingPong('onopen', {actionKey: "getChat"})
  }
  
  static async disconnect() {
    this.chat.close();
  }

  static sendMessage(content: string, sender_id: number, chat_id:number) {
    this.chat.emit({
      actionKey: 'sendMessage',
      message: {
        chat_id,
        content, 
        sender_id
      }
    });
  }

  static deleteMessage(id:number) {
    this.chat.emit({
      actionKey: 'deleteMessage',
      message: {id},
    });
  }

  static updateMessage(id:number, content: string) {
    this.chat.emit({
      actionKey: 'updateMessage',
      message: {id, content},
    });
  }

  static async listenerMessages(callback:(ev: MessageActionDTO) => void) {
    this.chat.onmessage = (ev) => {
      const resp = JSON.parse(ev.data);
      callback(resp as MessageActionDTO);
    }
  }
}

export interface MessageActionDTO {
  action: 'DELETE_MESSAGE'|'UPDATE_MESSAGE'|'SEND_MESSAGE',
  data: MessageDTO,
}

export interface GetChatByUsersDTO {
  friend_id: number;
  user_id: number;
}

export interface MessageDTO {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string; 
  updated_at: string; 
  sender: {
    username: string;
    created_at: string; 
  }
}

interface IFriend {
  id: number;
  user_id: number;
  friend_id: number;
  friend_name: string;
  created_at: string; 
}

interface IUserDTO {
  id: number;
  email: string;
  username: string;
  created_at: string; 
}

export interface ChatDTOSample {
  id: number;
  user_id: number;
  friend_id: number;
  createdAt: string;
  messages: MessageDTO[];
  friend: IFriend;
  user: IUserDTO;
}

export type ChatSample = Omit<ChatDTOSample, 'messages'>;