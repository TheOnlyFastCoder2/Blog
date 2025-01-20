import { border } from "@/libs/globalProps";
import { Flex, Button, Text } from "@chakra-ui/react";

interface IPropsUser {
  callback: () => void,
  textButton: string,
  username: string,
  userId: number,
  created_at: string,
}

export default function User({ textButton, callback, userId, username, created_at }: IPropsUser) {
  const dateMessage = new Date(created_at);
  const formattedDate = dateMessage.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Flex 
      justifyContent={"space-between"} 
      w="full" alignItems={"center"} 
      px="4" py="2"
      rounded={"md"} {...border}>
     <Flex flexDir={"column"} gap="4">
      <Text
          textStyle={"md"}
          color={"fg.subtle"}
          cursor={"pointer"}
          _hover={{color: "fg.muted"}}
          children={`${userId}#${username}`}
        />
        <Text
          textStyle={"sm"}
          color={"fg.muted"}
          children={`аккаунт: ${formattedDate}`}
        />
     </Flex>

      <Button
        outline={"solid"}
        onClick={callback}
        children={textButton}
      />
    </Flex>
  )
}

