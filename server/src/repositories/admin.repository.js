import Admin from "../models/admin.model.js";
import BaseRepository from "./base.repository.js";

class AdminRepository extends BaseRepository {

  constructor() {
    super(Admin);
  }

}

export default new AdminRepository();