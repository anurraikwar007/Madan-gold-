import Order from "../models/order.model.js";
import BaseRepository from "./base.repository.js";

class OrderRepository extends BaseRepository {

  constructor() {
    super(Order);
  }

}

export default new OrderRepository();