import { MessageCircle } from "lucide-react";
import { Box } from "@chakra-ui/react";
import IconCustom from "./IconCustom";

interface IIconComments {
  qtyComments: number;
  cb: () => void;
}

export default function IconComments({qtyComments, cb}:IIconComments) {
  return (
    <Box 
      pos="relative"
      _hover={{color: "fg.info"}}
      _before={{
        content: `"${qtyComments}"`,
        pos: "absolute",
        bottom: "70%",
        left: "100%",
        fontSize:"8px",
        color:"fg.info",
        fontWeight: "700"
      }}>
      <IconCustom
        Component={MessageCircle} 
        onClick={cb}/>
    </Box>
  )
}
