import { Box, Flex, Tabs } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"

import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useState } from "react";
import { pxGlobal } from "@/libs/globalProps";


export default function PageAuth () {
  const [value, setValue] = useState<string>("signIn")
  function setSignIn() {
    setValue("signIn");
    toaster.create({
      title: "Вы успешно зарегистрированы",
      type: "success",
    })
  }

  return (
    <Flex flexGrow={1} justifyContent={"center"}  alignItems={"center"} {...pxGlobal}>
      <Box minW="min(100%, 450px)">
        <Tabs.Root 
          value={value} 
          minW="full" 
          onValueChange={(e) => setValue(e.value)} 
          variant="enclosed" maxW="md" fitted>
          <Tabs.List>
            <Tabs.Trigger value="signUp">регистрация</Tabs.Trigger>
            <Tabs.Trigger value="signIn">авторизация</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="signUp"><SignUp goToSignIn={setSignIn}/></Tabs.Content>
          <Tabs.Content value="signIn"><SignIn/></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Flex>
  )
}



