import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { domains } from "database";
import { z } from "zod";
import { Field } from "~/components/Form";
import { db } from "~/utils/drizzle.server";
import validator from "validator";
import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { createId } from "@paralleldrive/cuid2";

const schema = z.object({
  domain: z.string().refine((val) => validator.isFQDN(val)),
});

export default function SettingsDomainCreatePage() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { domain }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });
  return (
    <div>
      <Form method="post" {...form.props}>
        <Field
          name={domain.name}
          error={domain.error}
          label="Domain"
          placeholder="example.com"
        />
        <button type="submit">Add Domain</button>
      </Form>
    </div>
  );
}

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission);
  }

  await db.insert(domains).values({
    domain: submission.value.domain,
    tenantId: "skr5pte9guegsgk2u7bw92uq",
    verificationCode: `dv_${createId()}`,
  });

  return redirect(
    `/settings/domains/${encodeURIComponent(submission.value.domain)}`
  );
};
