import db from "$/DBHandlers/db";
import type { FriendDTOConfirm, UserDTOSubscribe, UserDTOUnsubscribe } from "./user.dto"

function toBooleanType(value: boolean|string|number) {
  switch (value) {
    case 'true': return true;
    case 'false': return false;
  }
  return Boolean(value);
} 

export default abstract class ServiceUser {
  static getFriends(id:number, confirm_status: boolean) {
    return db.users.getFriends(Number(id), toBooleanType(confirm_status));
  }

  static toConfirmSubscribe({id}:FriendDTOConfirm) {
    return db.users.toConfirmSubscribe(id);
  }

  static getNotFriends(id:number) {
    return db.users.getNotFriends(Number(id));
  }

  static toSubscribe(data: UserDTOSubscribe) {
    return db.users.toSubscribe(data);
  }

  static toUnsubscribe({ id, user_id, friend_id }: UserDTOUnsubscribe) {
    return db.users.toUnsubscribe({
      id: Number(id), 
      user_id: Number(user_id), 
      friend_id: Number(friend_id)
    });
  }
}