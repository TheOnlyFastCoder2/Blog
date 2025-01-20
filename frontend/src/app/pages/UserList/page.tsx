import { useState } from "react";
import { Flex, Box, Tabs, Show } from "@chakra-ui/react";

import Subscribers from "./Subscribers";
import Strangers from "./Stranger";

type TTags = 'FRIENDS'|'STRANGERS'|'SUBSCRIBERS';

export default function UserList () {
  const [value, setValue] = useState<TTags>("FRIENDS");

  return (
      <Flex w={"min(100%, 600px)"} mx="auto">
        <Tabs.Root 
          value={value} 
          minW="full" 
          onValueChange={(e) => setValue(e.value as TTags)} 
          variant="enclosed" maxW="md" fitted>
          <Tabs.List>
            <Tabs.Trigger value="FRIENDS">друзья</Tabs.Trigger>
            <Tabs.Trigger value="SUBSCRIBERS">подписки</Tabs.Trigger>
            <Tabs.Trigger value="STRANGERS">незнакомцы</Tabs.Trigger>
          </Tabs.List>
          <Box>
            <Show when={'FRIENDS' === value}>
              <Tabs.Content value="FRIENDS"><Subscribers confirm_status={true}/></Tabs.Content>
            </Show>
            <Show when={'SUBSCRIBERS' === value}>
              <Tabs.Content value="SUBSCRIBERS"><Subscribers confirm_status={false}/></Tabs.Content>
            </Show>
            <Show when={'STRANGERS' === value}>
              <Tabs.Content value="STRANGERS"><Strangers/></Tabs.Content>
            </Show>           
          </Box>
        </Tabs.Root>
      </Flex>
  )
}






