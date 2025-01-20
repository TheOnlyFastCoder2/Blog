import { Button } from "@/components/ui/button";
import { border } from "@/libs/globalProps";
import { Box, Text, For, Flex, Show } from "@chakra-ui/react";
import { useEffect, useState, useTransition } from "react";
import api from "@/libs/api";
import { useUserStore } from "@/libs/store/User/STUser";
import { FriendDTOSample } from "@/libs/api/services/api.user";
import { autorun } from "mobx";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

export default function ListOfFriends ({toConnectChatById}: {toConnectChatById: (chatId: string) => void}) {
  const userStore = useUserStore();
  const [ isShowed, setIsShowed ] = useState(true);
  const [ _, startTransition ] = useTransition();
  const [friends, setFriends ] = useState<FriendDTOSample[]>();

  useEffect(() => {
    autorun(() => {
      startTransition(async () => {
        try {
          const resp = await api.UserService.getFriends({
            user_id: userStore.user_id,
            confirm_status: true,
          });
          setFriends(resp.data);
        } catch (error) {
          console.error(error);
        }
      })
    })
  }, []);

  async function toFindChat(friend_id:number, user_id:number) {
    try { 
      const resp = await api.ChatService.getChatIdByUsers({friend_id, user_id});
      toConnectChatById(String(resp.data.id));
    } catch (error) {
      console.error(error);
    }
  }
 
  return (
    <Flex
      flexDir={"column"} overflowX={"hidden"}
      maxW={"400px"}  overflowY={"auto"}  h="100%"
      minW={isShowed ? "min(100%, 400px)": "60px"}
      {...border} borderY={"none"} borderLeft={"none"}>

      <Button onClick={setIsShowed.bind(null, !isShowed)} w={ "60px"}>
        {
          !isShowed
          ? <ArrowRightFromLine/>
          : <ArrowLeftFromLine/>
        }
      </Button>
      <Show when={isShowed}>
        <Flex flexDir={"column"} bg={"fg.inverted"} minH={"min-content"} >
          <For each={friends}>
            {({id, friend_id, friend_name, user_id}) => {
                return (
                <Button 
                  key={id} onClick={toFindChat.bind(null, friend_id, user_id)}
                  variant={"ghost"} textAlign={"unset"} p="unset" h="unset" 
                  fontWeight={"normal"} color={"fg.subtle"}
                  _hover={{color:"fg.muted"}}>
                  <Box {...border} px={4}  py={2} borderTop="none" borderX={"none"}>
                    <Text color="fg.info" textStyle={"sm"}>{friend_name}</Text>
                    <Text
                      textStyle={"md"} mt="1.5"
                      textWrap={"balance"}
                      lineClamp={2} overflow={"hidden"} 
                      textOverflow={"ellipsis"} boxOrient={"vertical"}
                      >
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                      Quisquam labore odio quos, nam assumenda magni eum nemo velit ipsam a obcaecati alias enim tempora facere at. Iusto laboriosam nostrum mollitia ab, maxime vero error pariatur aut at magni laudantium maiores repudiandae tenetur voluptatem itaque?
                    </Text>
                  </Box>
                </Button>
                ) 
            }}
          </For>   
        </Flex>
      </Show>
    </Flex>
  )
}