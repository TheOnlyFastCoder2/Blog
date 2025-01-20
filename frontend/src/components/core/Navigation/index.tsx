import IconCustom from "./IconCustom";
import IsUserAuth from "@/components/shared/isUserAuth";
import { border } from "@/libs/globalProps";
import { Box, Button, Flex, For, SimpleGrid, Show, DialogBackdrop } from "@chakra-ui/react";
import { ArrowLeftToLine, Newspaper, ListFilter, MessagesSquare, Users } from "lucide-react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

import { useUserStore } from "@/libs/store/User/STUser";
import RouteGuard from "@/components/shared/RouteGuard";
import { useEffect, useState, useTransition } from "react";
import api from "@/libs/api";

import { Checkbox } from "@/components/ui/checkbox";
import { DialogRoot } from "@/components/ui/dialog";
import { observer } from "mobx-react-lite";


export default function () {
  const {FilterTags, ...AFilter} = useFilterTags();

  return (  
    <IsUserAuth>
      <RouteGuard isValidRoutes={["/"]}>
      <DialogRoot open={AFilter.isShowed}>
        <DialogBackdrop onClick={AFilter.toClose} opacity={0.8}  zIndex={80}/>
      </DialogRoot>
        <Flex
          gap="4" h="60px" 
          w={"min(100%, 600px)"}
          pos={"relative"} bg={"fg.inverted"}
          justifyContent={"flex-end"} zIndex={90}
          alignItems={"center"} px={"4"} {...border}>

          <FilterTags />
          <IconCustom  to="/editor-post" label="Создать пост" Component={Newspaper}/>
          <IconCustom  to={`/contacts`} label="контакты" Component={MessagesSquare}/>
          <IconCustom  to={`/users-list`} label="Пользователи" Component={Users}/>
          <IconCustom label="фильтр по тегам" Component={ListFilter} onClick={AFilter.toToggle}/>
          <UserMenu/>
        </Flex>
      </RouteGuard>
    </IsUserAuth>
  )
};




const UserMenu = () => {
  const user = useUserStore();

  function toLogoutUser() {
    user.logout();
  }

  return (
    <Flex>
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="outline">{user.username}</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={toLogoutUser} cursor={"pointer"} value="exit" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }}>
            <ArrowLeftToLine/> Выйти
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Flex>
  )
}



export function useFilterTags() {
  const user = useUserStore();
  const [isShowed, setIsShowed] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if(user.tagsForFilter.length < 1) {
      startTransition(async () => {
        try {
          const { data } = await api.PostService.toGetTags();
          const tags = data.map((tag) => ({name: tag.name, isChecked: false}));
          user.setTags(tags);
        } catch (error) {
          console.error(error);
        }
      })
    }
  }, []);

  function toClose() {
    setIsShowed(false);
  }

  function toToggle() {
    setIsShowed(!isShowed);
  }
  
  return {
    isShowed,
    toClose,
    toToggle,
    FilterTags: observer(() => {
      return (
        <Show when={isShowed}>
          <Box {...border} 
            w="full" pos={"absolute"} mb={"5"}
            h={"400px"} rounded={"md"} p={"2"}
            bottom={"100%"} left={"0"} right={"0"}
            boxShadow={"2xl"} zIndex={90}
            overflowY={"auto"} bg="fg.inverted"
            >
            <Show when={!isPending && user.tagsForFilter.length > 0}>
              <SimpleGrid columns={3} gap={"2"} mx="auto">
                <For each={user.tagsForFilter}>
                    {({name, isChecked}, index) => {
                      return (
                        <Button
                          key={name+index}
                          variant={"outline"} px={"unset"} overflow={"hidden"} 
                          lineClamp={1} boxOrient={"vertical"} textOverflow={"ellipsis"}>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={({checked}) => user.toChangeStatusFromTag(
                              index, checked as boolean
                            )}
                            px={"2"} cursor={"pointer"} w={"full"}  
                            h={"full"} color={"fg.subtle"} 
                            _hover={{color:"bg.inverted"}} overflow={"hidden"}>
                            {name}
                          </Checkbox>
                        </Button>
                      )
                    }}
                </For>
              </SimpleGrid>
            </Show>
          </Box>
        </Show>
      )
    })
  }
};