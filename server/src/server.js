import { decodeBase64 } from "./base64.js";
import { generateJSONs } from "./mock.js";

const port = process.env.PORT || 5000;

const DEFAULT_ERROR_OBJECT = Object.freeze({
  status: 500,
  message: "Something Went Wrong",
});

Bun.serve({
  async fetch(req) {
    try {
      const url = new URL(req.url);
      const query = url.searchParams.get("q");
      if (!query) return Response.json(DEFAULT_ERROR_OBJECT, { status: 500 });
      const result = await generateJSONs(JSON.parse(decodeBase64(query)));
      return Response.json(result);
    } catch {
      return Response.json(DEFAULT_ERROR_OBJECT, { status: 500 });
    }
  },
  port,
});

console.info(`Server is running on port ${port}`);
