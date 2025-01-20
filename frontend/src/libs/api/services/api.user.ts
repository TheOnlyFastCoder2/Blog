import { instance, config } from "../api.config";
import { AxiosResponse } from 'axios';

export default abstract class UserService {
  static getFriends(params: UserDTOGet): Promise<AxiosResponse<FriendDTOSample[], any>> {
    return instance.get('/user/friends', {
       ...config,
      params,
    });
  }

  static getNotFriends(params: UserDTOGet): Promise<AxiosResponse<UserDTOSample[], any>> {
    return instance.get('/user/not-friends', {
      ...config,
     params,
   });
  }

  static toSubscribe(body: UserDTOSubscribe) {
    return instance.post('/user/subscribe', body);
  }

  static toConfirmSubscribe(body: FriendDTOConfirm) {
    return instance.patch('/user/confirm-friend', body);
  }

  static toUnSubscribe(params: FriendDTOUnsubscribe) {
    console.log(params)
    return instance.delete('/user/unsubscribe', {
      ...config,
      params,
    });
  }
}


interface UserDTOSubscribe {
  confirm_status?: boolean;
  user_id: number;
  stranger_id: number;
}

interface FriendDTOConfirm {
  id: number;
}

interface FriendDTOUnsubscribe {
  id: number;
  user_id: number;
  friend_id: number;
}

export interface UserDTOGet {
  user_id:number|string;
  confirm_status?: boolean;
}

export interface FriendDTOSample {
  id: number;
  user_id: number;
  friend_id: number;
  sender_id: number | null;
  friend_name: string;
  created_at: string;
  confirm_status: boolean;
}

export interface UserDTOSample {
  id: number;
  username: string;
  created_at: string,
}