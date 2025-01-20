import { Button, Flex, For, Text} from "@chakra-ui/react";
import { useState } from "react";
import { X } from "lucide-react";

export default function useTags(callback?: ((tags: Array<string>) => void), data?: Array<string>) {
  const [tags, setTags] = useState<Array<string>>(data||[]);
  
  function addTag(tagName: string) {
    if(!tags.includes(tagName)) {
      setTags((prevTags) => {
        prevTags.push(tagName);
        callback && callback(prevTags);
        return [...prevTags];
      });
    }
  }

  function removeTag(tagIndex: number) {
    setTags((prevTags) => {
      prevTags.splice(tagIndex, 1);
      callback && callback(prevTags);
      return [...prevTags];
    });
  }

  return {
    addTag,
    Tags: () => (
      <Flex gap={"4"} h="60px" overflowY={"hidden"} overflowX={"auto"}>
        <For each={tags}>
          {(tag, index) => {
            return (
              <Button 
                minW="min"
                key={tag+index} gap={"2"} 
                cursor={"default"} variant={"outline"}
                justifyContent={"center"} alignItems={"center"}>
                <Text textStyle={"sm"}>{tag}</Text>
                <X cursor={"Pointer"} size={8} onClick={removeTag.bind(null, index)}/>
              </Button>
            )
          }}
        </For>
      </Flex>
    )
  }
}