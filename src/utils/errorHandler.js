

export function errorHandler(err) {
  return {
    error: err.message || "Internal Server Error",
    details: err.errors
      ? err.errors.map(e => ({
          field: e.path,
          value: e.value,
          message: e.message
        }))
      : []
  };
}
