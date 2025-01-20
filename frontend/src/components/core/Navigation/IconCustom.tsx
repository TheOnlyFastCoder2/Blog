import { LucideProps } from 'lucide-react';
import { Icon } from '@chakra-ui/react';


import {
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';


export interface IPropsIcon extends Omit<LucideProps, "ref"> , React.DetailedHTMLProps<React.HTMLAttributes<SVGSVGElement>, any> {
  Component: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  label: string,
  to?: string,
}

export default function IconCustom({label, Component, to, ...props}: IPropsIcon) {
  const refDomEl= useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  
  function handleOnClick() {
    navigate(to!);
  }

  useEffect(() => {
    if(to && refDomEl.current) {
      refDomEl.current.addEventListener('click', handleOnClick);
    }
    return () => {
      refDomEl.current?.removeEventListener('click', handleOnClick);
    }
  }, [to]);

  return (
    <HoverCardRoot>
    <HoverCardTrigger>
      <Icon 
          ref={refDomEl}
          size={"md"} 
          color={"fg.subtle"}
          transition={"0.2s"}
          _hover={{
            scale: "1.1",
            color:"bg.inverted"
          }}
        >
        <Component 
          cursor={"Pointer"} 
          {...props}/>
      </Icon>
    </HoverCardTrigger>
    <HoverCardContent py="2" bg="fg.info" color="fg.inverted" fontWeight={600}>
      {label}
    </HoverCardContent>
  </HoverCardRoot>

  ) 
}