import { PostDTOSample } from "@/libs/api/services/api.post";
import { Box, Flex, For, Link as CLink, Show, Text, LinkProps } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";
import Comments from "./Comments";
import { useUserStore } from "@/libs/store/User/STUser";
import IconComments from "./LowerPanel/IconComments";
import IconLike from "./LowerPanel/IconLike";
import LowerPanel from "./LowerPanel";
import Tag from "./Tags/Tag";
import Tags from "./Tags";
import { border } from "@/libs/globalProps";
import { useNavigate } from "react-router";
import IsUserAuth from "@/components/shared/isUserAuth";

export default function (props:PostDTOSample) {
  const userStore = useUserStore();
  const [isShowedComments, setIsShowedComments] = useState(false);
  const [qtyComments, setQtyComments] = useState(props.comments.length);
  
  function toSetQtyComments(qty: number) {
    setQtyComments(qty);
  }

  return (
    <>
      <Flex 
        flexDir={"column"} transition={"0.2s"} w="full"
        justifyContent={"space-between"} rounded="md" {...border}
      >
        <Box px="4" py="2">
          <Text mb="4" textStyle={"3xl"}>{props.title}</Text>
          <Text 
            color={"fg.subtle"}
            textStyle={"md"} textWrap={"balance"}
            lineClamp={8} overflow={"hidden"} 
            textOverflow={"ellipsis"} boxOrient={"vertical"}
            >{props.description}</Text>
        </Box>
        <Tags>
          <For each={props.tags}> 
            {({id, name}) => (
              <Tag key={id} children={name}/>
            )}
          </For>
        </Tags>
        <LowerPanel>
          <IconLike likes={props.likes} postId={props.id} userId={userStore.user_id}/>
          <IconComments qtyComments={qtyComments} cb={setIsShowedComments.bind(null, !isShowedComments)} />
          <Link 
            to={`/post/${props.id}`} 
            ml={"auto"} color="fg.subtle" 
            _hover={{color:"fg.muted"}}
            children={"посмотреть"}/>
          <IsUserAuth when={userStore.user_id === props.author_id}>
            <Link 
              to={`/editor-post/${props.id}`} 
              color="fg.subtle" 
              _hover={{color:"fg.muted"}}
              children={"редактировать"}/>
          </IsUserAuth>
        </LowerPanel>
        <Show when={isShowedComments}>
          <Comments 
            post_id={props.id}
            comments={props.comments} 
            cbSetQtyComments={toSetQtyComments}/>
        </Show>
      </Flex>
 
    </>
  )
};



interface ILink extends LinkProps, PropsWithChildren {
  to: string
}

function Link({to, ...props}: ILink) {
  const navigate = useNavigate();
  function handleOnClick() {
    navigate(to);
  }
  return <CLink onClick={handleOnClick} {...props} />
}
