import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { border } from "@/libs/globalProps";

export default function Tags({children}:PropsWithChildren) {
  return (
    <Flex 
      px="4" h={"40px"} gap="2" mt={"auto"}  borderTop={"2px"} 
      alignItems={"center"} {...border}  borderX={"none"}>
      {children}
    </Flex>
  )
}