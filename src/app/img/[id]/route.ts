import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";

export function GET(req: Request) {

	const id = req.url.split("/").at(-1);

	if (fs.statSync(path.join("./img", id as string), { throwIfNoEntry: false })?.isDirectory()) {

		const file = fs.readFileSync(path.join("img", id as string, "file"));
		const typeFile = JSON.parse(fs.readFileSync(path.join("img", id as string, "type"), { encoding: "utf-8" }));

		return new Response(file, {
			headers: {
				"Content-Type": typeFile.type,
			},
		});

	}

	notFound();

}
