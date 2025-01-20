import { Box, Flex, Textarea, Button } from "@chakra-ui/react";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { border } from "@/libs/globalProps";

interface IProps {
  cb: (comment: string) => void;
  isPending?: boolean;
  value?: string;
  isMessage?: boolean,
  cbCancel?: () => void
}

export default function SenderMessage({cb, cbCancel, value="", isPending=false, isMessage=false}:IProps) {
  const [inputValue, setInputValue] = useState(value);
   
  function handleOnInput(ev: React.FormEvent<HTMLTextAreaElement>) {
    setInputValue(ev.currentTarget.value);
  }

  function handleOnClickSave() {
    cb(inputValue);
    setInputValue('');
  }

  if(cbCancel) {
    return (
      <Box py="2" w="full" {...border} borderX="none" borderTop={"none"} border={isMessage ? "none" : undefined}  h={"min-content"}>
        <Textarea
          appearance={"none"} fontWeight={"600"} color="fg.subtle"
          minH="80px" maxH="200px" placeholder="написать комментарий" 
          outline={"none"} value={inputValue} onInput={handleOnInput} 
          disabled={isPending}/>

        <Flex mt={2} justifyContent={"flex-end"} gap="2">
          <Button size="sm" outline={"solid"} onClick={cbCancel}>отмена</Button>
          <Button size="sm" outline={"solid"} onClick={handleOnClickSave} disabled={isPending}>Сохранить</Button>
        </Flex>
      </Box>  
    )
  }

  return (
    <Flex gap="2" px="2" py="2" w="full" {...border} borderX="none" borderTop={"none"} h={"min-content"}>
      <Textarea
        appearance={"none"}
        minH="80px" maxH="200px" placeholder="написать комментарий" 
        outline={"none"} value={inputValue} onInput={handleOnInput} 
        disabled={isPending}/>
      <Button 
        disabled={isPending}
        variant={"ghost"} color="fg.subtle" 
        onClick={handleOnClickSave}>
          <SendHorizontal/>
      </Button>
    </Flex>  
  )
}