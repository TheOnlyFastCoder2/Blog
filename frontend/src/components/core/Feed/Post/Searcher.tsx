import api from "@/libs/api"; 
import { PostDTOSample } from "@/libs/api/services/api.post";
import { Box, Button, Text, Flex, For, Input, List } from "@chakra-ui/react";
import { useState, useTransition } from "react";
import { Search } from 'lucide-react';
import {DialogBackdrop, DialogRoot} from "@/components/ui/dialog"
import { useNavigate } from "react-router";

export default function () {
  const navigate = useNavigate();
  const [ posts , setPosts ] = useState<PostDTOSample[]>([]);
  const [ value, setValue ] = useState<string>("");
  const [ isPending, startTransition ] = useTransition();
  
  function handleOnKeyDown({currentTarget: { value }}: React.FormEvent<HTMLInputElement>) {
    if(!value.trim()) {
      setPosts([]);
    }
    setValue(value);
  }

  function toSearch(e: React.KeyboardEvent<HTMLInputElement>) {
     if(e.key === 'Enter' && !!value.trim()) {
      startTransition(async () => {
        try {
          const resp = await api.PostService.toSearchPost({
            limit: 5,
            title: value,
          })

          setPosts(resp.data);
        } catch (error) {
          
        }
      })

    }    
  }

  function toGoPostPage(id: number) {
    navigate(`/post/${id}`);
  }

  function toClearSearcher () {
    setPosts([]);
  }

  return (
    <Box  w="full" pos="sticky" top="0" pt="2" bg="fg.inverted" shadow="xl">
      <Flex 
        w="full" pr="4" alignItems={"center"} gap={"4"} {...border}>
          <Input 
            border="none" outline={"none"} onInput={handleOnKeyDown} 
            onKeyDown={toSearch} value={value} disabled={isPending}/>
          <Box color={isPending ? "bg.inverted" : "fg.subtle"}><Search size={14}/></Box>
          
          <DialogRoot open={!!posts.length} size={"full"}>
            <DialogBackdrop onClick={toClearSearcher}/>
          </DialogRoot>

          <Box 
            hidden={!posts.length} pos="absolute" top="100%" mt="2" 
            bg="fg.inverted" zIndex={9999}  w="full"  boxShadow={"2xl"}
            overflowY={"auto"} maxH="600px" {...border}>
            <List.Root  listStyleType={"none"} bg="bg.muted" gap={"1px"}>
              <For each={posts}>
                {(post) => (
                  <List.Item key={post.id} w="full">
                    <Button 
                      w={"full"} minH="min"
                      px="4" py={"20px"}
                      variant={"ghost"}
                      rounded={"none"}
                      bg={"fg.inverted"}
                      justifyContent={"left"}
                      onClick={toGoPostPage.bind(null, post.id)}
                      >
                        <Text
                          textStyle={"md"}  color={"fg.muted"}
                          lineClamp={1} overflow={"hidden"} textWrap={"nowrap"}
                          textOverflow={"ellipsis"} boxOrient={"vertical"}>
                          {post.title}
                        </Text>
                      </Button>
                  </List.Item>
                )}
              </For>
            </List.Root>
          </Box>
        </Flex>
    </Box>
  )
};

const border = {
  border:"1px", 
  borderStyle:"solid", 
  borderColor:"gray.800",
  rounded:"md"
}