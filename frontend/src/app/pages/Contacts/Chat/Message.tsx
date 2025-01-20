import { Icon } from "@/components/core/Feed/Post/Comments/Comment";
import SenderMessage from "@/components/core/Feed/Post/Comments/SenderMessage";
import api from "@/libs/api";
import { MessageDTO } from "@/libs/api/services/api.chat";
import { border } from "@/libs/globalProps";
import { useUserStore } from "@/libs/store/User/STUser";
import { Flex, Show, Text } from "@chakra-ui/react";
import { Pencil, X } from "lucide-react";
import { memo, useState } from "react";

interface IPropsMessage extends MessageDTO {
  isShowName: boolean,
  isShowDate: boolean,
  formattedData: string,
}

export default memo(function ({id, formattedData, isShowDate, sender_id, sender:{ username }, content, isShowName}:IPropsMessage) {
  const userStore = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isHovered, setIsHovered] = useState<number|undefined>(undefined);

  
  async function deleteMessage(messageId:number) {
    api.ChatService.deleteMessage(messageId);
  }

  async function updateMessage(messageId:number, content:string) {
    api.ChatService.updateMessage(messageId, content);
  }

  return (
    <Flex 
      w="full" flexDir={"column"} 
      onMouseEnter={() => setIsHovered(id)}
      onMouseLeave={() => setIsHovered(undefined)}
      >
      <Text color={"fg.subtle/60"} textAlign={"center"} textStyle={"md"} pt="3" hidden={isShowDate}>
        {formattedData}
      </Text>
      <Flex justifyContent={"space-between"} alignItems={"center"} >
        <Text 
          color={"fg.info"} textStyle={"md"}
          pt={isShowName ? 0 :  "3" } 
          opacity={isShowName && isShowDate ? 0 : 1}>
          {username}
        </Text>
        <Show when={isHovered && userStore.user_id == sender_id}>
          <Flex  w="full" alignItems={"center"} justifyContent={"flex-end"} gap="2" color="fg.subtle">
            <Icon Component={Pencil} onClick={setIsEdit.bind(null, true)}/>
            <Icon Component={X} onClick={deleteMessage.bind(null, id)}/>
          </Flex>
        </Show>
      </Flex>


      <Show when={!isEdit} 
        fallback={
          <SenderMessage 
          value={content} isMessage={true}
          cb={updateMessage.bind(null, id)}
          cbCancel={setIsEdit.bind(null, false)}/>
        }
        children={
          <Text 
            textStyle={"md"} my="2" bg={"fg.subtle/4"}  {...border} borderColor={"gray.800/50"}
            _hover={{bg:"fg.subtle/20"}} color={"isMeColor"}
            py="4" px="4" rounded={"md"}>
            {content}
          </Text>
        }/>
    </Flex>
  ) 
})