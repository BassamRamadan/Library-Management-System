
import { errorHandler } from "../src/utils/errorHandler.js";

describe("errorHandler", () => {
  test("handles Sequelize validation errors", () => {
    const sequelizeError = {
      message: "Validation error",
      errors: [
        { path: "isbn", value: "123", message: "ISBN must be unique" },
        { path: "title", value: "", message: "Title is required" }
      ]
    };

    const result = errorHandler(sequelizeError);

    expect(result.error).toBe("Validation error");
    expect(result.details).toEqual([
      { field: "isbn", value: "123", message: "ISBN must be unique" },
      { field: "title", value: "", message: "Title is required" }
    ]);
  });

  test("handles express-validator errors", () => {
    const expressValidatorErrors = [
      { param: "isbn", value: "", msg: "ISBN is required" },
      { param: "title", value: "", msg: "Title is required" }
    ];

    const result = errorHandler(expressValidatorErrors);

    expect(result.error).toBe("Validation failed");
    expect(result.details).toEqual([
      { field: "isbn", value: "", message: "ISBN is required" },
      { field: "title", value: "", message: "Title is required" }
    ]);
  });

  test("handles plain Error object", () => {
    const plainError = new Error("Something went wrong");

    const result = errorHandler(plainError);

    expect(result.error).toBe("Something went wrong");
  });

  test("handles unknown error formats", () => {
    const weirdError = { something: "unexpected" };

    const result = errorHandler(weirdError);

    expect(result.error).toBe("Unknown error");
  });
});
