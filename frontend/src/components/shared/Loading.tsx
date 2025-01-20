import { Box, Flex, Text} from "@chakra-ui/react";
import { LoaderCircle } from "lucide-react";

const Loading = () => (
  <Flex 
    bg="Background" w="full" h="full"
    pos={"absolute"} zIndex={"9999"}
    gap="2" justifyContent={"center"} alignItems={"center"}>
    <Box animation={"spin"}><LoaderCircle size={30}/></Box>
    <Text textStyle={"3xl"} fontWeight={"extrabold"}> ЗАГРУЗКА </Text>
  </Flex>
)

export default Loading;