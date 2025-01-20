import api from "@/libs/api";
import { UserDTOSample } from "@/libs/api/services/api.user";
import { useUserStore } from "@/libs/store/User/STUser";
import { For } from "@chakra-ui/react";
import User from "./User";
import { useState, useTransition, useEffect, useOptimistic } from "react";

type Action = { type: 'SUBSCRIPTION'; stranger: UserDTOSample };

export default function Strangers () {
  const userStore = useUserStore();
  const [ strangers, setStrangers ] = useState<UserDTOSample[]>([]);
  const [ _, startTransition ] = useTransition();

  const [optimisticFriends, setOptimisticFriends] = useOptimistic<UserDTOSample[], Action>(strangers, (prevStrangers, action) => {
    switch (action.type) {
      case 'SUBSCRIPTION':
        return prevStrangers.map(stranger => 
          stranger.id === action.stranger.id ? { ...stranger } : stranger
        );
      default:
        return prevStrangers;
    }
  });
  
  function toMakeQuery() {
    startTransition(async () => {
      try {
        const resp = await api.UserService.getNotFriends({
          user_id: userStore.user_id
        });
        setStrangers(resp.data);
      } catch (error) {
        console.error(error);
      }
    })
  }

  useEffect(() => {
    toMakeQuery();
  }, [])

  function toSubscribe(props: UserDTOSample) {
    startTransition(async () => {
      setOptimisticFriends({
        type: 'SUBSCRIPTION', 
        stranger: props
      });
      try {
        await api.UserService.toSubscribe({
          user_id: userStore.user_id,
          stranger_id: props.id,
          confirm_status: false,
        });
        toMakeQuery();
      } catch (error) {
        console.error(error);
      }
    })
  }

  return (
    <For each={optimisticFriends}>
      {(props) => {
        return (
          <User 
            key={props.id} 
            callback={toSubscribe.bind(null, props)} 
            textButton={"отправить заявку"} 
            userId={props.id}
            username={props.username}
            created_at={props.created_at}/>
        )
      }}
    </For>
  )
}