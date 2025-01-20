import { useEffect, useState } from "react";

interface IProps {
  isPending: boolean;
  thenLoading: React.ReactNode,
  children: React.ReactNode,
  isUserLogout: boolean,
} 

export default function ({isPending, thenLoading, children, isUserLogout}: IProps) {
  const [localPending, setLocalPending] = useState(true);


  useEffect(() => {
    if(isUserLogout) return;
    if (isPending) setLocalPending(true); 
    else {
      const timer = setTimeout(setLocalPending.bind(null, false), 0);
      return () => clearTimeout(timer);
    }
  }, [isPending, isUserLogout]);

  return (
    <>
      {localPending && thenLoading}
      {children}
    </>
  )
}