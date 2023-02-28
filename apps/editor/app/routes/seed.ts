import { seed } from "~/utils/seed.server";

export const loader = async () => {
  await seed();
  return new Response("OK");
};
