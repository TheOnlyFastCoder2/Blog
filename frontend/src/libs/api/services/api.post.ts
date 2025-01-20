import { instance, config} from '../api.config';
import { AxiosResponse } from 'axios';

export default abstract class PostService  {
  static toCreatePost (data: PostDTOCreate): Promise<AxiosResponse<PostDTOSample, any>> {
      return instance.post('/posts/create', data);
  }

  static toUpdatePost (data: PostDTOUpdate): Promise<AxiosResponse<string, any>> {
    return instance.patch('/posts/patch', data);
  }

  static toGetPost (params: PostDTOGet): Promise<AxiosResponse<PostDTOSample[], any>> {
    return instance.get('/posts/get', {
      ...config,
      params,
    });
  }

  static toGetPostByID (postId: string): Promise<AxiosResponse<PostDTOSample, any>> {
    return instance.get(`/posts/${postId}`);
  }

  static toSearchPost (params: PostDTOSearch): Promise<AxiosResponse<PostDTOSample[], any>> {
    return instance.get('/posts/search', {
      ...config,
      params,
    });
  }

  static toCreateComment (data: CommentDTOCreate): Promise<AxiosResponse<CommentDTOSample, any>> {
    return instance.post('/posts/comments/', data);
  }

  static toUpdateComment (data: CommentDTOUpdate): Promise<AxiosResponse<CommentDTOSample, any>> {
    return instance.patch('/posts/comments/', data);
  }

  static toDeleteComment (params: CommentDTODelete): Promise<AxiosResponse<string, any>> {
    return instance.delete('/posts/comments/', {
      ...config,
      params,
    });
  }

  
  static toCreateLike (data: LikeDTOAction): Promise<AxiosResponse<any, any>> {
    return instance.post('/posts/likes/', data);
  }

  static toDeleteLike (params: LikeDTOAction): Promise<AxiosResponse<any, any>> {
    return instance.delete('/posts/likes/', {
      ...config,
      params,
    });
  }

  static toGetTags(): Promise<AxiosResponse<TagDTOSample[], any>>  {
    return instance.get('/posts/tags/')
  }
}

export interface TagDTOSample {
  id: number,
  name: string,
}
export interface LikeDTOAction {
  userId: number;
  postId: number;
}

export interface LikeDTOSample extends LikeDTOAction {
  id: number;
}

export interface CommentDTODelete {
  id: number;
}

export interface CommentDTOCreate {
  post_id: number;
  author_id: number;
  author_name: string;
  text: string;
}

export interface CommentDTOUpdate {
  post_id: number;
  author_id: number;
  text: string;
}

export interface CommentDTOSample {
  id: number;
  post_id: number;
  author_id: number;
  author_name: string;
  text: string;
  update_at: string;
  created_at: string;
}

export interface PostDTOCreate {
  title: string;
  content: string;
  description:string,
  author_id: number,
  tags: Array<string>,
}

export interface PostDTOUpdate {
  id: number;
  title?: string;
  content?: string;
  description?:string,
  tags: Array<string>,
}

export interface PostDTOSearch {
  limit: number,
  title: string,
}

export interface PostDTOGetOptions{
  title?: string;
  description?:string,
  content?: string;
  tags?: string,
}

export interface PostDTOGet extends PostDTOGetOptions {
  page: number;
  limit: number;
}

export interface PostDTOSample {
  id: number;
  title: string;
  content: string;
  author_id: number;
  likes: LikeDTOSample[];
  comments: CommentDTOSample[];
  description:string;
  update_at: string;
  created_at: string;
  tags: TagDTOSample[],
}
