import { CommentDTOSample } from "@/libs/api/services/api.post";
import { Box, Flex, Link, Show, Text } from "@chakra-ui/react";
import { border } from "@/libs/globalProps";
import { useState } from "react";
import SenderComment from "./SenderMessage";
import { Pencil, X } from "lucide-react";
import { useUserStore } from "@/libs/store/User/STUser";
import IsUserAuth from "../../../../shared/isUserAuth";
import { IPropsIcon } from "../LowerPanel/IconCustom";

interface IProps {
  cbToUpdateComment: (value: string, data:CommentDTOSample, index:number) => void;
  cbToDeleteComment: (id:number, index:number) => void;
  data: CommentDTOSample;
  index: number;
}

export default function ({index, data, cbToUpdateComment, cbToDeleteComment}:IProps) {
  const user = useUserStore();
  const [isUnwrapComments, setUnwrapComments] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  function toUpdateComment (value: string) {
    cbToUpdateComment(value, data, index);
    setIsEdit(false);
  }

  return (
    <Box px="2" pt="2" {...border} borderTop={"none"} borderX={"none"}>
      <Flex justifyContent={"space-between"}>
        <Text px="2" textStyle={"xs"} fontWeight={"bold"}>{data.author_name}</Text>
        <IsUserAuth when={!isEdit && user.user_id === data.author_id}>
          <Flex gap="2" color="fg.subtle">
            <Icon Component={Pencil} onClick={setIsEdit.bind(null, true)}/>
            <Icon Component={X} onClick={cbToDeleteComment.bind(null,data.id, index)}/>
          </Flex>
        </IsUserAuth>
      </Flex>
      
      <Show 
        when={isEdit}
        children={
          <>
            <SenderComment 
              cb={toUpdateComment}
              value={data.text} 
              cbCancel={setIsEdit.bind(null, false)}/>
          </>
        }
        fallback={(
          <>
            <Text 
              px="2"
              pt="1" pb="2"
              color={"fg.subtle"}
              textStyle={"md"} 
              textWrap={"balance"} 
              lineClamp={!isUnwrapComments ? 3 : "none"} overflow={"hidden"} 
              textOverflow={"ellipsis"} boxOrient={"vertical"}
              children={data.text}
              />
            <Link px="2" pb={"2"} color={"fg.info"} onClick={setUnwrapComments.bind(null, !isUnwrapComments)}>
              {!isUnwrapComments ? "показать еще" : "скрыть"}
            </Link>
          </>
        )}/>
      
    </Box>
  )
};

export function Icon({Component, ...props}: IPropsIcon) {
  return (
    <Box _hover={{color:"bg.inverted"}}>
      <Component size={"14px"} cursor={"Pointer"} {...props}/>
    </Box>
  ) 
}