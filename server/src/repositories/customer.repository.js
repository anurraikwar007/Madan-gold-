import Customer from "../models/customer.model.js";
import BaseRepository from "./base.repository.js";

class CustomerRepository extends BaseRepository {

  constructor() {
    super(Customer);
  }

}

export default new CustomerRepository();