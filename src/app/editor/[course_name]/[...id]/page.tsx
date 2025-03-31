import { redirect } from "next/navigation";
import Editor from "./editor";
import prisma from "@/lib/db";

export default async function EditorPage({ params, searchParams }: {
	params: Promise<{ course_name: string, id: string[] }>,
	searchParams: Promise<{
		initialTitle: string,
		initialContent: string,
	}>
}) {

	const { course_name, id } = await params;
	const { initialTitle, initialContent } = await searchParams;

	const data = await prisma.post.findFirst({
		where: {
			courseId: course_name,
			path: id.join("/"),
		}
	});

	let hasData = !!data;
	let postId = data?.id;

	return (
		<form
			action={
				async (data) => {

					"use server";

					const password = data.get("password");

					if (password != process.env.ROOT_PASSWORD) {

						console.log("HERE");
						redirect(`/editor/${course_name}/${id.join("/")}?initialTitle=${encodeURIComponent(initialTitle)}&initialContent=${encodeURIComponent(initialContent)}`);

					}

					if (hasData) {

						const title = data.get("title");
						const content = data.get("content");

						if (typeof title !== "string" || typeof content !== "string") {

							console.log("HERE2");
							redirect(`/editor/${course_name}/${id.join("/")}?initialTitle=${encodeURIComponent(initialTitle)}&initialContent=${encodeURIComponent(initialContent)}`);

						}

						await prisma.post.update({
							where: {
								id: postId
							},
							data: {
								title,
								content
							}
						});

						redirect(`/course/${course_name}/${id.join("/")}`);

					} else {

						const title = data.get("title");
						const content = data.get("content");

						if (typeof title !== "string" || typeof content !== "string") {

							console.log("HERE3");
							redirect(`/editor/${course_name}/${id.join("/")}?initialTitle=${encodeURIComponent(initialTitle)}&initialContent=${encodeURIComponent(initialContent)}`);

						}

						await prisma.post.create({
							data: {
								courseId: course_name,
								path: id.join("/"),
								title,
								content,
							}
						});

						redirect(`/course/${course_name}/${id.join("/")}`);

					}

				}
			}
		>

			<div style={{ height: "4rem" }}>

				<input type="text" style={{
					display: "inline-block",
					margin: "1rem",
					height: "2rem",
					padding: "0 .5rem"
				}} placeholder="タイトル" name="title" defaultValue={initialTitle} />

				<input type="password" style={{
					display: "inline-block",
					margin: "1rem",
					height: "2rem",
					padding: "0 .5rem"
				}} placeholder="パスワード" name="password" />

				<div
					style={{ position: "absolute", right: 0, display: "inline-block" }}
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