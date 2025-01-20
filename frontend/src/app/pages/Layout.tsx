import { Outlet } from 'react-router-dom';
import api from '@/libs/api';
import { Center, Flex } from '@chakra-ui/react';
import Header from '@/components/core/Header';
import { observer } from 'mobx-react-lite';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useTransition  } from 'react';
import { useUserStore } from '@/libs/store/User/STUser';
import IsPending from '@/components/shared/IsPending';
import Loading from '@/components/shared/Loading';
import Navigation from '@/components/core/Navigation';

export default  observer(function () {
  const user = useUserStore();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if(user.isUserAuth) return
    startTransition(async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if(jwtToken) {
          const resp = await api.AuthService.authMeByJWT(jwtToken);
          
          user.setData({
            user_id: resp.data.id,
            token: resp.data.token!,
            username: resp.data.username,
            email: resp.data.email
          });
          
          localStorage.setItem("jwtToken",  resp.data.token!);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  return (
    <Center id="app">
      <IsPending isUserLogout={user.isLogout} isPending={isPending} thenLoading={<Loading/>}>
        <Toaster />
        <Header/>
        <Flex w="full" position={"relative"} h="calc(100vh - 60px)">
          <Outlet/>
        </Flex>
        <Navigation/>
      </IsPending>
    </Center>
  )
});