import { Box, For } from "@chakra-ui/react";
import { useEffect, useState, useTransition } from "react";
import { CommentDTOSample } from "@/libs/api/services/api.post";
import api from "@/libs/api";
import { useUserStore } from "@/libs/store/User/STUser";
import Comment from "./Comment";
import SenderComment from "./SenderMessage";

interface IProps {
  post_id: number
  comments: CommentDTOSample[],
  cbSetQtyComments: (qty: number) => void, 
}


export default function (props: IProps) {
  const user = useUserStore();
  
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState<CommentDTOSample[]>(props.comments);
  
  function toSetComments (comment: CommentDTOSample) {
    setComments([...comments, comment]);
  }
  
  async function toDeleteComment(id:number, index: number) {
    try {
      await api.PostService.toDeleteComment({id});
      setComments((prevComments) => {
        prevComments.splice(index, 1);
        props.comments.splice(index, 1);
        return [...prevComments]
      });
    } catch (error) {
      console.error(error)
    }
  }

  async function toUpdateComment(value: string, data:CommentDTOSample, index:number) {
    try {
      const resp = await api.PostService.toUpdateComment({
        author_id: data.author_id,
        post_id: data.post_id,
        text: value
      });
      setComments((prevComments) => {
        prevComments[index] = resp.data;
        props.comments[index] = resp.data;
        return [...prevComments]
      });
    } catch (error) {
      console.error(error)
    }
  }

  function toCreateComment(value:string) {
    if(value.trim()) {
      startTransition(async () => {
        try {
          const resp = await api.PostService.toCreateComment({
            post_id:props.post_id,
            author_id:user.user_id,
            author_name:user.username,
            text: value,
          })
          toSetComments(resp.data);
          props.comments.push(resp.data);
        } catch (error) {
          console.error(error)
        }
      })
    }    
  }

  useEffect(() => {
    props.cbSetQtyComments(comments.length);
  }, [comments])
  return (
    <Box w={"min(100%, 600px)"}  overflow={"hidden"}>
        {user.isUserAuth && (
          <SenderComment isPending={isPending} cb={toCreateComment}/>
        )}
        <Box overflowY={"auto"} maxH={"600px"} >
          <For each={comments}>
            {(item, index) => (
              <Comment 
                data={item}
                index={index}
                cbToDeleteComment={toDeleteComment}
                cbToUpdateComment={toUpdateComment} 
                key={item.id+index}/>
            )}
          </For>
        </Box>
    </Box>
  )
};

