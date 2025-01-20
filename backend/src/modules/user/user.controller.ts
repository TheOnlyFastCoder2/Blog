import Elysia from "elysia";
import ServiceUser from "./user.service";
import { FriendDTO, UserDTO } from "./user.dto";
import isError from "$/utils/isError";

export default (
  new Elysia({prefix: "/user"})
  .model({
    'friend.getAllSubscribes': FriendDTO.getSubscribes,
    'stranger.getAllStrangers': FriendDTO.getStrangers,
    'user.subscribe': UserDTO.subscribe,
    'user.unsubscribe': UserDTO.unsubscribe,
    'user.confirm': FriendDTO.toConfirmStatus,
  })
  .get("/friends", async ({ query, error }) => {
    return isError(await ServiceUser.getFriends(query.user_id, query.confirm_status), error);
  }, {query: 'friend.getAllSubscribes'})

  .get("/not-friends", async ({ query, error }) => {
    return isError(await ServiceUser.getNotFriends(query.user_id), error);
  },{query: 'stranger.getAllStrangers'})

  .post('/subscribe', async ({ body, error }) => {
    return isError(await ServiceUser.toSubscribe(body), error)
  }, {body: 'user.subscribe'})

  .patch('/confirm-friend', async ({body, error}) => {
    return isError(await ServiceUser.toConfirmSubscribe(body), error);
  }, {body: 'user.confirm'})

  .delete('/unsubscribe', async ({ query, error }) => {
    return isError(await ServiceUser.toUnsubscribe(query), error)
  }, {query: 'user.unsubscribe'})
)