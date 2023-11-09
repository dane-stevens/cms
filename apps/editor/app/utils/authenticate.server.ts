import { json } from "@remix-run/node";
import { client } from "./redis.server";

const API_KEY_PREFIX = {
  public: "pk_",
  secret: "sk_",
};

export async function authenticateApiKey(
  request: Request,
  type: "public" | "secret"
) {
  const authorizationHeader = request.headers?.get("authorization");
  const apiKey =
    authorizationHeader?.includes("Bearer ") &&
    authorizationHeader?.includes(API_KEY_PREFIX[type])
      ? authorizationHeader.replace("Bearer ", "")
      : null;
  if (!apiKey)
    return json("UNAUTHORIZED", {
      status: 401,
    });

  const tenent = await client.get(`apiKey:${apiKey}`);

  if (!tenent)
    return json("API KEY NOT FOUND", {
      status: 404,
    });

  return tenent;
}
