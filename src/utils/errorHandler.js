export function errorHandler(err) {
  // Sequelize validation errors usually have `errors` array
  if (err.errors && Array.isArray(err.errors)) {
    return {
      error: err.message,
      details: err.errors.map(e => ({
        field: e.path,
        value: e.value,
        message: e.message
      }))
    };
  }

  // express-validator returns an array directly
  if (Array.isArray(err)) {
    return {
      error: "Validation failed",
      details: err.map(e => ({
        field: e.param,
        value: e.value,
        message: e.msg
      }))
    };
  }

  // fallback (plain JS error or something unexpected)
  return {
    error: err.message || "Unknown error",
  };
}
