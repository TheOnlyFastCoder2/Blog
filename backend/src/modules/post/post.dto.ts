import { t } from 'elysia';

export const CommentDTO = {
  delete: t.Object({
    id: t.Number(),
  }),

  create: t.Object({
    post_id: t.Number(),
    author_id: t.Number(),
    author_name: t.String(),
    text: t.String(),
  }),
  
  update: t.Object({
    post_id: t.Number(),
    author_id: t.Number(),
    text: t.String(),
  }),

  sample: t.Object({
    id: t.Number(),
    post_id: t.Number(),
    author_id: t.Number(),
    author_name: t.String(),
    text: t.String(),
  
    update_at: t.String(),
    created_at: t.String(),
  }),
}

export const LikeDTO = {
  action: t.Object({
    userId: t.Number(),
    postId: t.Number(),
  }),

  sample: t.Object({
    id: t.Number(),   
    userId: t.Number(),
    postId: t.Number(),
  }),
}


const props = t.Object({
  title: t.Optional(t.String()),
  content: t.Optional(t.String()),
  description: t.Optional(t.String()),
  author_id: t.Optional(t.Number()),
});

export const PostDTO = {
  create: t.Object({
    title: t.String(),
    content: t.String(),
    author_id: t.Number(),   
    description: t.String(),
    tags: t.Array(t.String())
  }),

  update: t.Object({
    id: t.Number(),
    tags: t.Array(t.String()),
    ...props.properties
  }),

  delete: t.Object({
    id: t.Number(),
  }),

  getById: t.Object({
    id:t.Number(), 
  }),

  get: t.Object({
    page: t.Number(),
    limit: t.Number(),
    tags: t.Optional(t.String()),
    ...props.properties
  }),

  search: t.Object({
    limit: t.Number(),
    title: t.String(),
  }),

  sample: t.Object({
    id: t.Number(),
    title: t.String(),
    content: t.String(),
    likes: t.Array(LikeDTO.sample),
    tags: t.Array(t.String()),
    description: t.String(),
    update_at: t.Date(),
    created_at: t.Date(),
  }),
}

export type LikeDTOAction = typeof LikeDTO.action.static;
export type LikeDTOSample = typeof LikeDTO.sample.static;

export type CommentDTO = typeof CommentDTO.sample.static;
export type CommentDTOCreate = typeof CommentDTO.create.static;
export type CommentDTOUpdate = typeof CommentDTO.update.static;
export type CommentDTODelete = typeof CommentDTO.delete.static;

export type IPostProps = (typeof props.static) & {tags: Array<string>};
export type PostDTOGet = typeof PostDTO.get.static;

export type PostDTOCreate = typeof PostDTO.create.static;
export type PostDTOUpdate = typeof PostDTO.update.static;
export type PostDTOSearch = typeof PostDTO.search.static;
export type PostDTOSample = typeof PostDTO.sample.static;