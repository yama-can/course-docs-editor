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

							await prisma.post.delete({
								where: {
									id: data.id,
								},
							});

							redirect(`/list/${course_name}?success=1`);

						} else {

							redirect(`/delete/${course_name}/${id.join("/")}?error=1`);

						}

					}
				}
			>

				<input type="password" name="password" placeholder="パスワード" />

				<button
					type="submit"
				>
					削除
				</button>

			</form>

		</div>
	)

}
