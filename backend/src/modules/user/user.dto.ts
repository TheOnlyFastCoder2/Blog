import { t } from 'elysia';

export const UserDTO = {
  subscribe: t.Object({
    user_id: t.Number(),
    stranger_id: t.Number(),
    confirm_status: t.Optional(t.Boolean(),),
  }),

  unsubscribe: t.Object({
    id: t.Number(),
    user_id: t.Number(),
    friend_id: t.Number(), // id_row
  })
}

export const FriendDTO = {
  getSubscribes: t.Object({
    user_id: t.Number(),
    confirm_status: t.Boolean(),
  }),
  getStrangers: t.Object({
    user_id: t.Number(),
  }),
  toConfirmStatus: t.Object({
    id:t.Number(),
  }),
}

export type UserDTOSubscribe = typeof UserDTO.subscribe.static; 
export type UserDTOUnsubscribe = typeof UserDTO.unsubscribe.static; 

export type UserDTOGetSubscribes = typeof FriendDTO.getSubscribes.static;
export type UserDTOGetStrangers = typeof FriendDTO.getStrangers.static;

export type FriendDTOConfirm = typeof FriendDTO.toConfirmStatus.static;