class ApiResponse {
  constructor(success, message, data = null, errors = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

export const apiResponse = {
  success(message = "Success", data = null) {
    return new ApiResponse(true, message, data);
  },

  error(message = "Something went wrong", errors = null) {
    return new ApiResponse(false, message, null, errors);
  },
};

export default apiResponse;