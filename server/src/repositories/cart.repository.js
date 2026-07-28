import Cart from "../models/cart.model.js";
import BaseRepository from "./base.repository.js";

class CartRepository extends BaseRepository {

  constructor() {
    super(Cart);
  }

}

export default new CartRepository();