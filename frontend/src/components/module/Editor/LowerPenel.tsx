import { Button, Flex, Show } from "@chakra-ui/react";
import React, { useState, useTransition } from "react";
import api from "@/libs/api";
// import { AxiosError } from "axios";
import { toaster } from "@/components/ui/toaster";
import { PostDTOCreate } from "@/libs/api/services/api.post";
import { useUserStore } from "@/libs/store/User/STUser";

export interface IProps {
  data: React.RefObject<PostDTOCreate & {id:number|null}>
}

export default function LowerPanel({data}: IProps) {
  const userStore = useUserStore();
  const [isPending, startTransition] = useTransition();
  const [isCreatedPost, setIsCreatedPost] = useState(data.current.id ? true : false);

  function toCreatePost({title, description, content, tags}: PostDTOCreate) {
    startTransition(async () => {
      try {
        const resp = await api.PostService.toCreatePost({
          title: title,
          author_id: userStore.user_id,
          description: description,
          content: content,
          tags: tags
        });
        data.current.id = resp.data.id;
        toaster.create({
          title: "Пост успешно был создан",
          type: "success",
        });
        setIsCreatedPost(true);
      } catch (error) {
        console.error("Failed to create Post:", error);
      }
    });
  }

  function toUpdatePost({title, description, content, tags}: PostDTOCreate, id:number) {
    startTransition(async () => {
      try {
        await api.PostService.toUpdatePost({
          id,
          title: title,
          description: description,
          content: content,
          tags: tags
        });

        toaster.create({
          title: "Пост успешно обновлен",
          type: "success",
        });
      } catch (error) {
        console.error("Failed to update Post:", error);
      }
    });
  }

  function toSendData() {
    if(!data.current) return;
    
    const {title, description, id} = data.current;

    if(!title) return  (
      toaster.create({
        title: "вы не добавили заголовок к посту",
        type: "warning",
      })
    );

    if(!description) return (
      toaster.create({
        title: "вы не добавили описание к посту",
        type: "warning",
      })
    );

    id === null
    ? toCreatePost(data.current)
    : toUpdatePost(data.current, id);
  }


  return (
    <Flex 
      left="0" w="full" h="60px" bg="black" zIndex={"99"}
      pos={"absolute"} px="2" alignItems={"center"} borderTop={"2px"} 
      borderStyle={"solid"} borderColor={"gray.900"} bottom={"0"} >
      
      <Show 
        when={isCreatedPost} 
        children={
          <Button
            onClick={toSendData}
          
            variant={"solid"} 
            disabled={isPending}>обновить</Button>
        } 
        fallback={
          <Button
            onClick={toSendData} 
            variant={"outline"} 
            disabled={isPending}>сохранить</Button>
        }/>
          
    </Flex>
  )
}