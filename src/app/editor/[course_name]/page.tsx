import { redirect } from "next/navigation";
import Editor from "./[...id]/editor";
import prisma from "@/lib/db";
import { levels_data } from "@/components/levels";
import { level as level_type } from "@prisma/client";
import { cookies } from "next/headers";
import WaitLogin from "@/components/wait-login";

export default async function EditorPage({ params, searchParams }: {
	params: Promise<{ course_name: string }>,
	searchParams: Promise<{
		initialContent: string,
	}>
}) {

	if ((await cookies()).get("CK_PASSWORD")?.value !== process.env.ROOT_PASSWORD) {

		return <WaitLogin />;

	}

	const { course_name } = await params;
	const { initialContent } = await searchParams;

	const data = await prisma.post.findFirst({
		where: {
			courseId: course_name,
			path: "",
		}
	});

	return (
		<form
			action={
				async (data) => {

					"use server";

					const password = (await cookies()).get("CK_PASSWORD")?.value || "";
					const short_name = data.get("short_name");
					const parents = data.get("parents");
					const hasData = data.get("hasData");
					const level = data.get("level");

					if (password != process.env.ROOT_PASSWORD) {

						redirect(`/editor/${course_name}?initialContent=${encodeURIComponent(initialContent)}`);

					}

					if (typeof short_name !== "string" || typeof parents !== "string" || typeof level !== "string") {

						redirect(`/editor/${course_name}?initialContent=${encodeURIComponent(initialContent)}`);

					}

					if (hasData) {

						const content = data.get("content");

						if (typeof content !== "string") {

							redirect(`/editor/${course_name}?initialContent=${encodeURIComponent(initialContent)}`);

						}

						await prisma.post.update({
							where: {
								id: "",
							},
							data: {
								content,
								short_name,
								requireing: parents.split(",").map((x) => x.trim()).filter((x) => x.length > 0),
								doc_level: level as level_type,
							}
						});

						redirect(`/course/${course_name}`);

					} else {

						const content = data.get("content");

						if (typeof content !== "string") {

							redirect(`/editor/${course_name}?initialContent=${encodeURIComponent(initialContent)}`);

						}

						await prisma.post.create({
							data: {
								courseId: course_name,
								path: "",
								content,
								short_name,
								doc_level: level as level_type,
							}
						});

						redirect(`/course/${course_name}`);

					}

				}
			}
		>

			<div style={{ height: "4rem" }}>

				<input type="hidden" value={data ? "true" : ""} name="hasData" />

				<input
					type="text"
					style={{
						display: "inline-block",
						margin: "1rem",
						height: "2rem",
						padding: "0 .5rem"
					}}
					placeholder="短い名前"
					name="short_name"
					defaultValue={(data ? data.short_name : "")}
					required
				/>

				<input
					type="text"
					style={{
						display: "inline-block",
						margin: "1rem",
						height: "2rem",
						padding: "0 .5rem",
						width: "20rem",
					}}
					placeholder="先に読むべきページID（カンマ区切り）"
					name="parents"
					defaultValue={(data ? data.requireing.join(",") : "")}
				/>

				<select
					name="level"
					defaultValue={(data ? data.doc_level : "")}
					required
				>

					<option value="">レベル</option>

					<hr />

					{
						(() => {

							const res = [];

							let i = 0;

							for (const level in levels_data) {

								const data = levels_data[level as keyof typeof levels_data];

								res.push(
									<option key={i++} value={level}>
										{data.lang_ja}
									</option>
								)

							}

							return res;

						})()
					}

				</select>


				<div
					style={{
						position: "absolute",
						right: 0,
						display: "inline-block"
					}}
				>

					<button
						style={{
							background: "blue",
							color: "white",
							border: "none",
							borderRadius: "0.5rem",
							cursor: "pointer",
							fontSize: "1rem",
							height: "2rem",
							lineHeight: "2rem",
							margin: "1rem",
						}}
						type="submit"
					>
						作成・編集
					</button>

				</div>

			</div>

			<div>

				<Editor initialValue={initialContent || (data ? data.content : "")} />

			</div>

		</form>
	)

}