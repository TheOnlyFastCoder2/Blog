import type { MessageDTOCreate, MessageDTODelete, MessageDTOUpdate } from "$/modules/chat/chat.dto";
import type { PrismaClient } from "@prisma/client";

export default class ChatHandler {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getChat(chatId: number) {
    try {
      const chat = await this.db.chat.findUniqueOrThrow({
        where: {id: chatId},
        include: {
          messages: {
            select: {
              id:true,
              content: true,
              sender_id: true,
              created_at: true,
              sender: {
                select: {
                  username: true,
                  created_at: true,
                }
              }
            }
          },
          friend: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              created_at: true,
            }
          },
        }
      })
      return chat;
      
    } catch (error) {
      console.error(`Failed to get a chat: ${error}`)
      return [
        new Error("Failed to get a chat"),
        404
      ];
    }
  }

  async getChatIdByUsers(friend_id:number, user_id:number) {
    try {

      let [friend_1, friend_2] = await this.db.friend.findMany({
        where: {
          OR: [
            {user_id, friend_id},
            {friend_id:user_id, user_id:friend_id}
          ]
        }
      })

      const chat = await this.db.chat.findFirst({
        where: {
          OR: [
            {friend_id: friend_1.id},
            {friend_id: friend_2.id}
          ],
        },
        select: {
          id: true,
        }
      })

      return chat;
    } catch (error) {
      console.error(`Failed to get a chat: ${error}`)
      return [
        new Error("Failed to get a chat"),
        404
      ];
    }
  }
  async updateMessage(data: MessageDTOUpdate) {
    try {
      const message = await this.db.message.update({
        where: {id: data.id},
        data: {
          content: data.content,
          updated_at: new Date(),
        },
        include: {
          sender: {
            select: {
              created_at: true,
              username: true,
            }
          }
        }
      })

      return message;
    } catch (error) {
      console.error(`Failed to update a message: ${error}`)
      return [
        new Error("Failed to update a message"),
        409
      ];
    }
  }

  async deleteMessage(data: MessageDTODelete) {
    try {
      const message = await this.db.message.delete({
        where: {id: data.id},
      })
      return message;
    } catch (error) {
      console.error(`Failed to delete a message: ${error}`)
      return [
        new Error("Failed to delete a message"),
        404
      ];
    }
  }
  
  sendMessage(data: MessageDTOCreate) {
    try {
      const resp = this.db.message.create({
        data: {
          chat_id: data.chat_id,
          sender_id: data.sender_id,
          content: data.content!,
        },
        include: {
          sender: {
            select: {
              created_at: true,
              username: true,
            }
          }
        }
      });
      return resp;
    } catch (error) {
      console.error(`Failed to send Message: ${error}`)
      return [
        new Error("Failed to send Message"),
        404
      ];
    }
  }
}