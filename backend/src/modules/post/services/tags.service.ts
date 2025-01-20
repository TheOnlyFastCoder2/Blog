import db from "$/DBHandlers/db";

export default abstract class TagService {
  static deleteUnusedTags () {
    return db.posts.tags.deleteUnusedTags();
  }

  static getTags() {
    return db.posts.tags.getTags();
  }
}