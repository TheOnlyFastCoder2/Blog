import { Box, Button, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import "@/assets/css/JSEditor.css";

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
import PrismCodeTool from '@/libs/EditorJS/plugins/PrismCodeTool';

import { border } from '@/libs/globalProps';



interface IProps {
  callback:  (value: string, type: string) => void,
  data?: string,
}


export default function JSEditor({callback, data}: IProps) {
  const refEJS = useRef<EditorJS>(null);
  const refEJSDiv = useRef<HTMLDivElement>(null);
  const [isFulledSize, setIsFulledSize] =  useState(false);
  
  const initEditor = () => {
    let DEFAULT_INITIAL_DATA:OutputData["blocks"]|undefined = undefined;
    if(data) {
      DEFAULT_INITIAL_DATA = JSON.parse(data);
    }

    console.log(DEFAULT_INITIAL_DATA)
    const editor = new EditorJS({
      onReady: () => {
        refEJS.current = editor;
        if (DEFAULT_INITIAL_DATA) {
          DEFAULT_INITIAL_DATA.forEach(block => {
            editor.blocks.insert(block.type, block.data);
          });
        }
      },

      onChange: async () => {
        let content = await editor.saver.save();
        callback(JSON.stringify(content.blocks), "Контент");
      },
  
      holder: 'editorjs',
      autofocus: true,
      inlineToolbar: true,
      tools: {
        header: Header,
        quote: Quote,
        code: PrismCodeTool,
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

  useEffect(() => {
    if (refEJS.current === null) {
      initEditor();
    }

    return () => {
      refEJS.current?.destroy();
      refEJS.current = null;
    }
  }, [])
  
  function test() {
    if(refEJS.current && refEJSDiv.current) {
      const trigger = !refEJS.current.readOnly.isEnabled;

      refEJS.current.readOnly.toggle(trigger);
      (
        trigger
        ? refEJSDiv.current.classList.add("read-only")
        : refEJSDiv.current.classList.remove("read-only")
      )
      
    }
  }
  return (
    <Flex position={isFulledSize ? "absolute" : ""} h="full" w="full"  flexDir={"column"} rounded={"md"} overflowX={"hidden"} overflowY={"auto"}  flex="1" {...border} borderWidth={"2px"} borderColor={"gray.300"}>
      <Flex position={"sticky"} top="0" gap="4"  zIndex={99} justifyContent={"space-between"} bg={"gray.300"}>
        <Button
          children={"предосмотр"}
          variant={"ghost"}
          color="fg.inverted"
          _hover={{color:"bg.inverted"}}
          rounded={"none"}
          onClick={test}/>

        <Button
          children={"растянуть"}
          variant={"ghost"}
          color="fg.inverted"
          _hover={{color:"bg.inverted"}}
          rounded={"none"}
          onClick={setIsFulledSize.bind(null, !isFulledSize)}/>
      </Flex>
      
      <Box 
        ref={refEJSDiv} id="editorjs" px="2"
        className='dark' border={"none"} />
    </Flex>
  )
}


