import { Flex, Text } from "@chakra-ui/react";
import { Tag } from "lucide-react";
import { PropsWithChildren } from "react";


export default function ({children}: PropsWithChildren) {
  return (
    <Flex 
      pr="2" gap="2" alignItems={"center"}
      borderRight={"1px"} borderStyle="solid" 
      borderColor = "gray.800">
      <Tag size={"10px"}/>
      <Text color={"fg.subtle"} textStyle={"sm"}>{children}</Text>
    </Flex>
  ) 
}