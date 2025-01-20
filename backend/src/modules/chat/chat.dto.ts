import { t } from 'elysia';

export const MessageDTO = {
  delete: t.Object({
    id: t.Number(),
  }),
  update: t.Object({
    id: t.Number(),
    content: t.String()
  }),
  create: t.Object({
    chat_id: t.Number(),
    sender_id: t.Number(),
    content: t.String()
  })
}
export const ChatDTO = {
  getChatByUsers: t.Object({
    friend_id: t.Number(),
    user_id: t.Number()
  }),

  getChatById: t.Object({
    id: t.String(),
  }),

  sample: t.Object({
    actionKey: t.String(),
    message: t.Union([MessageDTO.create, MessageDTO.update, MessageDTO.delete])
  })
  
}

export type MessageDTOCreate = typeof MessageDTO.create.static;
export type MessageDTODelete = typeof MessageDTO.delete.static;
export type MessageDTOUpdate = typeof MessageDTO.update.static;

export type ChatDTOGetChatById = typeof ChatDTO.getChatById.static;
export type ChatDTOGetChatByUsers = typeof ChatDTO.getChatByUsers.static;
export type ChatDTOSample = typeof ChatDTO.sample.static;