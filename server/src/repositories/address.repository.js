import Address from "../models/address.model.js";
import BaseRepository from "./base.repository.js";

class AddressRepository extends BaseRepository {

  constructor() {
    super(Address);
  }

}

export default new AddressRepository();