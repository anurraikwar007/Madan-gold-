import Customer from "../models/customer.model.js";
import BaseRepository from "./base.repository.js";

class CustomerRepository extends BaseRepository {

  constructor() {
    super(Customer);
  }
  
  count(filter = {}) {
    return this.model.countDocuments(filter);
   }

}

export default new CustomerRepository();