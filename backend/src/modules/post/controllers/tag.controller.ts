import Elysia from "elysia";
import TagService from "../services/tags.service";

export default (
  new Elysia({prefix: "/tags"})
  .get('/', () => {
    return TagService.getTags();
  })
)