import { Elysia } from "elysia";
import { PostDTO } from './post.dto';
import ServicePost from "./post.service";
import commentController from "./controllers/comment.controller";
import likeController from "./controllers/like.controller";
import isError from "$/utils/isError";
import tagController from "./controllers/tag.controller";

export default (
  new Elysia({prefix: "/posts"})
  .use(commentController)
  .use(likeController)
  .use(tagController)
  .model({
    'post.create': PostDTO.create,
    'post.update': PostDTO.update,
    'post.get': PostDTO.get,
    'post.getById': PostDTO.getById,
    'post.search': PostDTO.search,
    'post.delete': PostDTO.delete,
  })

  .get('/get', async ({query}) => {
    return await ServicePost.getPosts(query);
  }, {query: "post.get"})

  .get('/:id', async ({params, error}) => {
    return isError(await ServicePost.getPostById(params.id), error);
  },{params:"post.getById"})

  .get('/search', async ({query}) => {
    return await ServicePost.searchPost(query);
  }, {query: "post.search"})

  .post('/create', ({body}) => {
    return ServicePost.createPost(body);
  }, {body: 'post.create'})

  .patch('/patch', async ({ body, error }) => {
    return isError(ServicePost.updatePost(body), error);
  }, {body: "post.update"})

  .delete('/:id', ({ error, query: { id } }) => {
    return isError(ServicePost.deletePost(Number(id)), error);
  }, {query: "post.delete"})
)