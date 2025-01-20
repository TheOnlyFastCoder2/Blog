import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export const items = {
  "Textarea":Textarea,
  "Input": Input,
} as const;

export type TPolymorphicItems = keyof typeof items;
interface IProps extends React.RefAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
  type: TPolymorphicItems;
  isOnChange?: boolean;
  value?:string;
  callback:  (value: string, type: string) => void
}

export default function PolymorphicInput ({value, type, callback, placeholder, label, isOnChange = false}:IProps) {
  const Component = items[type];
  const refComponent = useRef<any>(null); 

  function onChange(e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      callback(e.currentTarget.value, label);
      e.currentTarget.value = ""; 
    }
  }

  useEffect(() => {
    if(refComponent.current && value) {
        const domEl = refComponent.current as HTMLTextAreaElement|HTMLInputElement;
        domEl.value = value;
    }
  }, [])
  
  return (
    <Field label={label} color="gray.500">
        <Component 
          ref={refComponent}
          fontWeight={"bold"}
          autoComplete="off"
          placeholder={placeholder}
          onKeyDown = {(isOnChange ? onChange : undefined)}
          onInput = {(!isOnChange ? (e) => callback(e.currentTarget.value, label) : undefined)}
        />
    </Field>
  )
}