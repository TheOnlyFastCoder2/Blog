import api from "@/libs/api";
import { PostDTOSample } from "@/libs/api/services/api.post";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import IconCustom from "./IconCustom";
import { Icon } from "@chakra-ui/react";
import { useUserStore } from "@/libs/store/User/STUser";

interface IPropsLike {
  likes: PostDTOSample["likes"],
  postId: PostDTOSample["id"],
  userId: number
}

export default function IconLike ({likes, postId, userId}:IPropsLike) {
  const [isLiked , setIsLike] = useState(false);
  const user = useUserStore();

  useEffect(() => {
    if(!user.isUserAuth) setIsLike(false);
    for(const item of likes) {
      if(item.postId === postId && item.userId === userId) {
        setIsLike(true);
        break;
      }
    }
  },[user.isUserAuth]);

  async function toggleLike(value: boolean) {
    try {
      const action = (
        !value 
        ? api.PostService.toCreateLike 
        : api.PostService.toDeleteLike
      ); 

      await action({
        postId,
        userId,
      });

      setIsLike(!value);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Icon 
      fill={isLiked ? "fg.error" : ""} 
      color={isLiked ? "fg.error" : ""}  
      _hover={{color: "fg.error", fill:"fg.inverted"}}>
      <IconCustom Component={Heart}  onClick={toggleLike.bind(null, isLiked)}/>
    </Icon>
  )
}