import db from "$/DBHandlers/db";
import type { ChatDTOGetChatByUsers, ChatDTOSample, MessageDTOCreate, MessageDTODelete, MessageDTOUpdate } from "./chat.dto";

export default abstract class ServiceChat {
  static getChat(chatId: string) {
    return db.chats.getChat(Number(chatId))
  }

  static async getChatIdByUsers(query: ChatDTOGetChatByUsers) {
    return await db.chats.getChatIdByUsers(Number(query.friend_id), Number(query.user_id))
  }

  static sendMessage(data: MessageDTOCreate) {
    return db.chats.sendMessage(data);
  }

  static updateMessage(data: MessageDTOUpdate) {
    return db.chats.updateMessage(data)
  }

  static deleteMessage(data: MessageDTODelete) {
    return db.chats.deleteMessage(data)
  }
}