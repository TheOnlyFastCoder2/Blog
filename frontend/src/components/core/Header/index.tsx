import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeftToLine } from 'lucide-react';
import { Flex } from '@chakra-ui/react';

import IsUserAuth from '@/components/shared/isUserAuth';
import RouteGuard from '@/components/shared/RouteGuard';
import { pxGlobal } from '@/libs/globalProps';

export default function Header() {
  return (
    <IsUserAuth fallback={<Component/>}>
      <RouteGuard isInverted={true} isValidRoutes={["/"]}>
        <Component/>
      </RouteGuard>
    </IsUserAuth>
  )
}

function Component () {
  return (
    <Flex
      gap="4" h="60px" 
      w={"full"}
      pos={"relative"} bg="fg.inverted"
      justifyContent={"flex-end"} 
      alignItems={"center"} {...pxGlobal}>

      <IsUserAuth 
        fallback={
          <>
            <RouteGuard isValidRoutes={['/']}>
              <Link to="/auth">
                <Button size={"sm"}>войти</Button>
              </Link>
            </RouteGuard>
          </>
        }/>

      <RouteGuard isInverted={true} isValidRoutes={['/']}>
        <Link to="/">
          <Button size={"sm"}>
            <ArrowLeftToLine/>
            вернуться
          </Button>
        </Link>
      </RouteGuard>
    </Flex>
  )
}





