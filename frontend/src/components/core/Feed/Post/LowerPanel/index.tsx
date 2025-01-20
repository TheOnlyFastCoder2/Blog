import { Flex } from "@chakra-ui/react";
import { border } from "@/libs/globalProps";
import { PropsWithChildren } from "react";

export default function LowerPanel ({children}:PropsWithChildren) {
  return (
    <Flex gap="4" alignItems={"center"} h="50px" px="4" {...border} borderX={"none"} borderTop={"none"}>
      {children}
    </Flex>
  )
}