import Wishlist from "../models/wishlist.model.js";
import BaseRepository from "./base.repository.js";

class WishlistRepository extends BaseRepository {

  constructor() {
    super(Wishlist);
  }

}

export default new WishlistRepository();