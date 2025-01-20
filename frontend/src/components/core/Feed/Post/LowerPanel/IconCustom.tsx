import { LucideProps } from "lucide-react"

export interface IPropsIcon extends Omit<LucideProps, "ref"> , React.DetailedHTMLProps<React.HTMLAttributes<SVGSVGElement>, any> {
  Component: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export default function IconCustom({Component, ...props}: IPropsIcon) {
  return (
    <Component size={"16px"} cursor={"Pointer"} {...props}/>
  ) 
}