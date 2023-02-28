import { ActionArgs, LoaderArgs } from "@remix-run/node";

export const action = async ({ request }: ActionArgs) => {
  const post = await request.text();
  console.log(post);
  return new Response("OK");
};
