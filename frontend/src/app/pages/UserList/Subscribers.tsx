import api from "@/libs/api";
import { For } from "@chakra-ui/react";
import { FriendDTOSample } from "@/libs/api/services/api.user";
import { useUserStore } from "@/libs/store/User/STUser";
import { useState, useTransition, useEffect, useOptimistic } from "react";
import User from "./User";


interface IProps {
  confirm_status: boolean,
}

type Action = { type: 'TOGGLE_SUBSCRIPTION'; friend: FriendDTOSample };

export default function Subscribers ({confirm_status}:IProps) {
  const userStore = useUserStore();
  const [ friends, setFriends ] = useState<FriendDTOSample[]>([]);
  const [ _ , startTransition ] = useTransition();

  const [optimisticFriends, setOptimisticFriends] = useOptimistic<FriendDTOSample[], Action>(friends, (prevFriends, action) => {
  
    switch (action.type) {
      case 'TOGGLE_SUBSCRIPTION':
        return prevFriends.map(friend => 
          friend.id === action.friend.id ? { ...friend, confirm_status: !friend.confirm_status} : friend
        );
      default:
        return prevFriends;
    }
  });

  function toMakeQuery () {
    startTransition(async () => {
      try {
        const resp = await api.UserService.getFriends({
          user_id: userStore.user_id,
          confirm_status: confirm_status
        });

        setFriends(resp.data);
      } catch (error) {
        console.error(error);
      }
    })
  }
  useEffect(() => {
    toMakeQuery();
  }, [])

  async function toConfirmSubscribe(props: FriendDTOSample) {
    return await api.UserService.toConfirmSubscribe({
      id: props.id,
    });
  }

  async function toUnSubscribe(props: FriendDTOSample) {
    return await api.UserService.toUnSubscribe({
      id: props.id,
      user_id: userStore.user_id,
      friend_id: props.friend_id,
    });
  }

  function toggleSubscription (callback:(props: FriendDTOSample) => Promise<any>, props: FriendDTOSample) {
    startTransition(async () => {
      try {
        await setOptimisticFriends({ 
          type: 'TOGGLE_SUBSCRIPTION', 
          friend: props 
        });
        await callback(props);
        await toMakeQuery();
      } catch (error) {
        console.error(error);
      }
    })
  }

  return (
      <For each={optimisticFriends}>
        {(props) => {
          const isIam = (props.sender_id === userStore.user_id);
          const callback = confirm_status == false ? !isIam ? toConfirmSubscribe: toUnSubscribe : toUnSubscribe;

          return  (
            <User 
              key={props.id} 
              callback={toggleSubscription.bind(null, callback, props)} 
              textButton={confirm_status == false ? !isIam ? "подтвердить" : "отписаться" : "отписаться"} 
              userId={props.friend_id}
              username={props.friend_name}
              created_at={props.created_at}/>
          )
        }}
      </For>
  )
}