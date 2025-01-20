import Elysia from "elysia";
import { CommentDTO } from '../post.dto';
import ServiceComment from "../services/comment.service";
import isError from "$/utils/isError";


export default (
  new Elysia({prefix: '/comments'})
  .model({
    'comment.create': CommentDTO.create,
    'comment.update': CommentDTO.update,
    'comment.delete': CommentDTO.delete,
  })
  
  .post('/', async ({body, error}) => {
    return isError(await ServiceComment.createComment(body), error);
  }, {body: 'comment.create'})

  .patch('/', async ({body, error}) => {
    return isError(await ServiceComment.updateComment(body), error);
  }, {body: 'comment.update'})

  .delete('/', async ({query, error}) => {
    return isError(ServiceComment.deleteComment(Number(query.id)), error);
  }, {query: 'comment.delete'})
)
