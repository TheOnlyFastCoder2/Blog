import ListOfFriends from "./ListOfFriends";
import useChatComponent from "./Chat/useChatComponent";
import { Flex, Center} from "@chakra-ui/react";
import { border } from "@/libs/globalProps";

export default function PageContacts () {
  const {Chat, toConnectChatById} = useChatComponent()
  
  return (
    <Center w="full">
      <Flex w="min(100%, 1200px)" aspectRatio={"1200/600"} rounded={"xl"} overflow={"hidden"} {...border}>
        <ListOfFriends {...{toConnectChatById}}/>
        <Chat/>
      </Flex>
    </Center>
  
  )
}