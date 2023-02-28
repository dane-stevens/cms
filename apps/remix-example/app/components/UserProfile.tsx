import { z } from "zod";

export default function UserProfile({ initials, image }: UserProfileProps) {
  return (
    <div className="rounded-full h-12 w-12">
      {initials}
      <div>
        <img src={image} />
      </div>
    </div>
  );
}

export const UserProfileProps = z.object({
  initials: z.string().length(2).default("AB"),
  image: z.string().url(),
});
export type UserProfileProps = z.infer<typeof UserProfileProps>;
