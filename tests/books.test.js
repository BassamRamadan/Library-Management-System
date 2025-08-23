import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import booksRouter from "../src/routes/books.js";
import { Book } from "../src/models/index.js";



// Mock Sequelize methods
jest.mock("../src/models/index.js");

const app = express();
app.use(express.json());
app.use("/books", booksRouter);

// Replace static methods with mocks
Book.findByPk = jest.fn();
Book.findAll = jest.fn();
Book.create = jest.fn();
Book.update = jest.fn();
Book.destroy = jest.fn();

describe("Books API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /books", () => {
    it("should create a new book", async () => {
      const mockBook = { id: 1, title: "Test Book", author: "John", isbn: "123", quantity: 5 };
      Book.create.mockResolvedValue(mockBook);

      const res = await request(app)
        .post("/books")
        .send({ title: "Test Book", author: "John", isbn: "123", quantity: 5 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockBook);
      expect(Book.create).toHaveBeenCalledWith({ title: "Test Book", author: "John", isbn: "123", quantity: 5 });
    });

    it("should return 400 for validation errors", async () => {
      const res = await request(app)
        .post("/books")
        .send({ title: "", author: "", isbn: "", quantity: -1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.details.length).toBeGreaterThan(0);
    });
  });

  describe("GET /books", () => {
    it("should return a list of books", async () => {
      const mockBooks = [{ id: 1, title: "Test", author: "A", isbn: "111", quantity: 3 }];
      Book.findAll.mockResolvedValue(mockBooks);

      const res = await request(app).get("/books");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBooks);
      expect(Book.findAll).toHaveBeenCalled();
    });
  });

  describe("GET /books/search", () => {
    it("should return filtered books", async () => {
      const mockBooks = [{ id: 1, title: "Test", author: "A", isbn: "111", quantity: 3 }];
      Book.findAll.mockResolvedValue(mockBooks);

      const res = await request(app).get("/books/search?title=Test");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBooks);
      expect(Book.findAll).toHaveBeenCalledWith({
        where: { title: expect.any(Object) }
      });
    });

    it("should reject unknown query params", async () => {
      const res = await request(app).get("/books/search?unknown=abc");
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid query params/);
    });
  });

  describe("PUT /books/:id", () => {
    it("should update a book", async () => {
      const mockBook = { id: 1, title: "Old", update: jest.fn().mockResolvedValue(true) };
      Book.findByPk.mockResolvedValue(mockBook);

      const res = await request(app)
        .put("/books/1")
        .send({ title: "New" });

      expect(res.status).toBe(200);
      expect(mockBook.update).toHaveBeenCalledWith({ title: "New" });
    });

    it("should return 404 if book not found", async () => {
      Book.findByPk.mockResolvedValue(null);

      const res = await request(app).put("/books/999").send({ title: "New" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Book not found");
    });
  });

  describe("DELETE /books/:id", () => {
    it("should delete a book", async () => {
      const mockBook = { destroy: jest.fn().mockResolvedValue(true) };
      Book.findByPk.mockResolvedValue(mockBook);

      const res = await request(app).delete("/books/1");

      expect(res.status).toBe(204);
      expect(mockBook.destroy).toHaveBeenCalled();
    });

    it("should return 404 if book not found", async () => {
      Book.findByPk.mockResolvedValue(null);

      const res = await request(app).delete("/books/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Book not found");
    });
  });

});
