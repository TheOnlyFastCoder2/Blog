import { PostDTOGetOptions, PostDTOSample } from "@/libs/api/services/api.post";
import api from "@/libs/api";

import { Flex, For, Center, Show } from "@chakra-ui/react";
import { useEffect, useState, useTransition } from "react";
import Post from "./Post";
import Searcher from "./Post/Searcher";
import { useUserStore } from "@/libs/store/User/STUser";
import { pxGlobal } from "@/libs/globalProps";
import { reaction } from "mobx";


export default function () {
  const user = useUserStore();
  const [ posts, setPosts ] = useState<PostDTOSample[]>([]);
  const [ isPending, startTransition ] = useTransition();

  function toGetPost(params?:PostDTOGetOptions) {
    startTransition(async () => {
      try {
        const resp = await api.PostService.toGetPost({
          limit: 5,
          page: 1,
          ...params,
        });

        setPosts(resp.data);
      } catch (error) {
        
      }
    }); 
  }

  useEffect(() => {
    toGetPost();
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => user.tagsForFilter.filter(({isChecked}) => isChecked).map(({name}) => name),
      (tags) => {
        toGetPost({
          tags: tags.join(","),
        })
      }
    )
    return () => {
      disposer();
    };
  }, [user]);

  return (
    <Show when={!isPending}>
      <Center w="full" flexDir={"column"}>
        <Flex 
          pos={"relative"}
          w={"min(100%, 600px)"} className="hiddenScrollBar"
          flexGrow={1} flexDirection={"column"} gap="4"
          alignItems={"center"} overflowY={"scroll"} 
          pb={"5"} h={"full"} px={{mdDown:pxGlobal.px.mdDown}}>
          <Searcher/>
          <For each={posts}>
            {(data) => (
              <Post key={data.created_at.toString()} {...data} />
            )}
          </For>
        </Flex>
      </Center>
    </Show>
   
  )
};