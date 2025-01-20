import Elysia from "elysia";
import { LikeDTO } from '../post.dto';
import ServiceLike from "../services/like.service";
import isError from "$/utils/isError";

export default (
  new Elysia({prefix: '/likes'})
  .model({
    'like.action': LikeDTO.action,
  })
  .post('/', async ({body, error}) => {
    return isError(await ServiceLike.createLike(body), error);
  }, {body: 'like.action'})

  .delete('/', async ({query, error}) => {
    return isError(await ServiceLike.deleteLike(query), error);
  }, {query: 'like.action'})
)
