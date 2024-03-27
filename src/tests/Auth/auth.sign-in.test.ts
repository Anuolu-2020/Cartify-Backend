//import { test, describe, expect, beforeAll } from "vitest";
// import supertest, { Test } from "supertest";
// import { app } from "../../app";
// import { mockData } from "../mockData";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import TestAgent from "supertest/lib/agent";
// //import { Response } from "express";
//
// let request: TestAgent<Test>;
//
// describe("Test Authentication: Sign-in", () => {
//   beforeAll(async () => {
//     request = supertest.agent(app.listen(8000));
//   });
//
//   test("Should POST Sign-in User", async () => {
//     const response = await request
//       .post("/api/v1/auth/sign-in")
//       .send(JSON.stringify(mockData))
//       .expect(302);
//
//     //const redirectResponse = request.get(
//     //response.headers["location"].replace("http://localhost:8080", ""),
//     //);
//
//     expect(response.status).toBe(200);
//     expect(response.headers["content-type"]).toBe(
//       "application/json; charset=utf-8",
//     );
//     expect(response.body.success).toBe(true);
//   });
//
//   //afterAll(async () => {
//   // await request.close();
//   //});
// });
