import Markdown from "@/components/markdown";
import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ course_name: string, id: string[] }> }) {

	const { course_name, id } = await params;

	const data = await prisma.post.findFirst({
		where: {
			courseId: course_name,
			path: id.join("/"),
		},
	});

	if (!data) {

		notFound();

	}

	return (
		<div style={{ minWidth: "400px", width: "55%", overflowWrap: "break-word", margin: "0 auto" }}>

			<form
				action={
					async (formData) => {

						"use server";

						if (formData.get("password") === process.env.ROOT_PASSWORD) {

							await prisma.post.update({
								where: {
									id: data.id,
								},
								data: {
									courseId: formData.get("target_course") as string,
									path: formData.get("target_path") as string,
								}
							});

							redirect(`/list/${course_name}?success=1`);

						} else {

							redirect(`/move/${course_name}/${id.join("/")}?error=1`);

						}

					}
				}
			>

				<input type="password" name="password" placeholder="パスワード" />
				<input type="text" name="target_course" placeholder="移動先コース" defaultValue={data.courseId} />
				<input type="text" name="target_path" placeholder="移動先パス" defaultValue={data.path} />

				<button
					type="submit"
				>
					移動
				</button>

			</form>

		</div>
	)

}
