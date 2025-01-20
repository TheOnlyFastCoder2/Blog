export default function isError(errorOrData:[Error, number]|any, cbError: (code:number, text:string) => any) {  
  if(Array.isArray(errorOrData) && errorOrData[0] instanceof Error) {
    return cbError(errorOrData[1], errorOrData[0].message)
  }

  return errorOrData;
}