import api from "@/libs/api";
import { PostDTOSample } from "@/libs/api/services/api.post";
import { Box, Flex, Show, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useParams } from "react-router";


import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';

import EditorjsList from '@editorjs/list';
//@ts-ignore
import SimpleImageTools from 'simple-image-editorjs';
//@ts-ignore
import SimpleImage from "@editorjs/simple-image";
//@ts-ignore
import LinkTool from '@editorjs/link';
//@ts-ignore
import RawTool from '@editorjs/raw';
import PrismCodeTool from '@/libs/EditorJS/plugins/PrismCodeTool'
import { border } from "@/libs/globalProps";


export default function PagePost () {
  const refEJS = useRef<EditorJS>(null);
  const refEJSDiv = useRef<HTMLDivElement>(null);
  const params = useParams();
  const [post , setPost] = useState<PostDTOSample>();
  const [isPending , startTransition] = useTransition();

  const initEditor = (container: HTMLDivElement) => {
    const editor = new EditorJS({
      onReady: () => {
        refEJS.current = editor;
        addBlocks(JSON.parse(post!.content), editor)
      },
      // data,
      holder: container,
      readOnly: true,
      tools: {
        header: Header,
        quote: Quote,
        code:PrismCodeTool,
        raw: RawTool,
        linkTool: LinkTool,
        list: {
          //@ts-ignore
          class: EditorjsList,
          inlineToolbar: true,
        }
      }
    });
  };

  function addBlocks(blocks:OutputData["blocks"], editor: EditorJS) {
    if(refEJS.current !== null) {
      blocks.forEach((block)=> {
        editor.blocks.insert(block.type, block.data);
      });
    } 
  }

  useEffect(() => {
    startTransition(async () => {
      if(!params.id) return;
      try {
        const resp = await api.PostService.toGetPostByID(params.id);
        setPost(resp.data)
      } catch (error) {
        console.error(error);
      }
    })
  }, [params.id]);

  
  useEffect(() => {
    if(!isPending && refEJSDiv.current) {
      initEditor(refEJSDiv.current);
    }
  }, [isPending]);


  return (
   <Show when={!isPending && post}>
    <Flex w="full" h="full" justifyContent={"center"} overflowY={"auto"}>
      <Box w={"min(100%, 1200px)"} bg={"fg.inverted"} py="2" px={"4"} minH={"min-content"} {...border}>
        <Text fontWeight={"Bold"} style={{color:"var(--textHeder)"}} textStyle={"3xl"} maxW={"900px"}>{post?.title}</Text>
        <Text my="5" textStyle={"md"}  style={{color:"var(--textBody)"}} fontWeight={600} >{post?.description}</Text>
        <Box 
          ref={refEJSDiv} id="editorjs" 
          className='dark read-only' border={"none"}
          minWidth="full" minHeight="full"/>
      </Box>
    </Flex>
   </Show>
  )
}
