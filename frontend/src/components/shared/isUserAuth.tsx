import { useUserStore } from "@/libs/store/User/STUser";
import { Show } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { toaster } from "@/components/ui/toaster"

export interface IProps extends PropsWithChildren {
  fallback?: any
  when?: any
  redirectTo?: string,
}

export default observer(function ({fallback, when = true, children, redirectTo}:IProps) {
  const user = useUserStore();
  const navigate = useNavigate();

  if(redirectTo) {
    useEffect(() => {
      setTimeout(() => {
        if(!user.isUserAuth) {
          navigate('/');
          toaster.create({
            title: "Вы не авторизованы",
            type: "error",
          });
        }
      }, 500);
    }, [])
  }

  return (
    <Show when={when && user.isUserAuth} fallback={fallback}>
      {children}
    </Show>
  )
})