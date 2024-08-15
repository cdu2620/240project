const request = require("supertest");
const app = require("./app");


jest.setTimeout(60000);
describe("routes working", () => {

    test("post /results works properly", async () => {
        let data = { 
            search: "captain america"

        };
        await request(app).post("/results").send(data).expect(200);

    });
    
    test("post /submitted works properly", async () => {
        let data = { 
            id: "Captain America::https://google.com::a summary::5.2"

        };
        await request(app).post("/submitted").send(data).expect(200);
        let data2 = { 
            id: ["Captain America::https://google.com::a summary::5.2", "Parasite::https://google.com::anti capitalist::600"]

        };
        await request(app).post("/submitted").send(data2).expect(200);
    });

    test("get routes work properly", async () => {
        await request(app).get("/").expect(200);
        await request(app).get("/watchlist").expect(200);
    });
});