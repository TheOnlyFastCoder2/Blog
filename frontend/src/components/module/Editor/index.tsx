import { Flex } from "@chakra-ui/react";

import PolymorphicInput from "./PolymorphicInput";
import EditorJS from "./JSEditor";
import LowerPanel from "./LowerPenel";
import { useRef } from "react";
import { PostDTOCreate } from "@/libs/api/services/api.post";
import useTags from "./useTags";


interface IProps {
  id?:null | number,
  title?: string,
  description?: string,
  content?: string,
  tags?: Array<string>,
}

export default function (props: IProps) {
  const refData = useRef<PostDTOCreate & {id:number|null}>({
    id: props?.id || null,
    title: props?.title || '',
    description: props?.description || '',
    content: props?.content || '',
    tags: props?.tags || [],
  });

  const {Tags, addTag} = useTags(changeTags, refData.current.tags);

  function changeTags(tags: PostDTOCreate["tags"]) {
    refData.current.tags = tags;
  }

  function setData (value: string, label: string) {
    switch(label) {
      case "Заголовок": return refData.current.title = value;
      case "Описание": return refData.current.description = value;
      case "Контент": return refData.current.content = value
      case "Теги": {
        !!value && addTag(value);
        break;
      }
    }
  }

  return (
    <Flex pos={"relative"}  w="min(100%, 1200px)" h="full" border={"2px"}  borderStyle={"solid"} borderColor={"gray.900"}  pt="2" px="4" mx="auto">
        <Flex pos={"relative"} w="full"  flexDirection={"column"} gap={"6"} overflowY={"auto"}> 
          <PolymorphicInput callback={setData} placeholder="Добавь описание" label="Заголовок" type="Input" value={refData.current.title}/>
          <PolymorphicInput callback={setData} placeholder="Напиши описание" label="Описание" type="Textarea" value={refData.current.description}/>
          <PolymorphicInput isOnChange={true} placeholder="Напиши тег" callback={setData} label="Теги" type="Input"/>
          <Tags/>
          <EditorJS callback={setData} data={refData.current.content}/>
        </Flex>
      <LowerPanel data={refData}/>
    </Flex>
  )
}

