import WaitLogin from "@/components/wait-login";
import { randomUUID } from "crypto";
import fs from "fs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import path from "path";

export default async function UploadPage() {

	if ((await cookies()).get("CK_PASSWORD")?.value !== process.env.ROOT_PASSWORD) {

		return <WaitLogin />;

	}

	return (
		<form
			action={
				async (data) => {

					"use server";

					const password = (await cookies()).get("CK_PASSWORD")?.value || "";

					if (password !== process.env.ROOT_PASSWORD) {

						redirect("/img/upload?error=1");

					}

					const file = data.get("file") as File;

					if (!file.type.startsWith("image/")) {

						redirect("/img/upload?error=2");

					}

					const uuid = randomUUID();

					fs.mkdirSync(path.join("./img", uuid), { recursive: true });
					fs.writeFileSync(path.join("./img", uuid, "file"), Buffer.from(await file.arrayBuffer()));
					fs.writeFileSync(path.join("./img", uuid, "type"), JSON.stringify({ type: file.type }));

					redirect(`/img/${uuid}`);

				}
			}

		>
			<input type="file" name="file" accept="image/png, image/jpeg, image/jpg" />
			<button type="submit">Upload</button>
		</form>
	)

}
