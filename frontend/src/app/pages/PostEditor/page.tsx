import Editor from '@/components/module/Editor';
import api from '@/libs/api';
import { PostDTOSample } from '@/libs/api/services/api.post';
import { Show } from '@chakra-ui/react';
import { useState, useTransition, useEffect } from 'react';
import { useParams } from 'react-router';

type IPost = Omit<PostDTOSample, 'tags'> & {
  tags: Array<string>;
};

export default function EditorPage() {
  const params = useParams();
  const [post , setPost] = useState<IPost>();
  const [isPending , startTransition] = useTransition();

  useEffect(() => {
    if(!params.id)  return;
    startTransition(async () => {
      if(!params.id) return;
      try {
        const resp = await api.PostService.toGetPostByID(params.id);
        const post:IPost = Object.assign(resp.data, {
          tags: resp.data.tags.map(({name}) => name)
        });
        setPost(post)
      } catch (error) {
        console.error(error);
      }
    })
  }, [params.id]);

  if(params.id) {
    return (
      <Show when={!isPending && post}>
        <Editor 
          id={post?.id}
          title={post?.title}
          description={post?.description}
          content={post?.content}
          tags={post?.tags}/>
      </Show>
    )
  }

  return (
    <Editor/>
  )
} 