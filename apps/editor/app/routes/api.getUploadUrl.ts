import { json, LoaderArgs } from "@remix-run/node";

import { createId } from "@paralleldrive/cuid2";

export const loader = async ({ request }: LoaderArgs) => {
  console.log("GET UPLOAD URL----------------------------------------");
  const formData = new FormData();
  formData.append("requireSignedURLs", "false");
  formData.append("id", `${createId()}/${createId()}`);
  const result = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "post",
      headers: {
        authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
      body: formData,
    }
  ).then((res) => res.json());
  // console.log({ result });
  return json({ test: "test" });
};
