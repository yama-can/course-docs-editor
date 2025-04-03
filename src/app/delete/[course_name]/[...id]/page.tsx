import WaitLogin from "@/components/wait-login";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ course_name: string, id: string[] }> }) {

	if ((await cookies()).get("CK_PASSWORD")?.value !== process.env.ROOT_PASSWORD) {

		return <WaitLogin />;

	}

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
		<div>

			<form
				action={
					async (formData) => {

						"use server";

						const postId = formData.get("postid");

						if (typeof postId !== "string" || postId === "") {

							redirect(`/delete/${course_name}/${id.join("/")}?error=1`);

						}

						if ((await cookies()).get("CK_PASSWORD")?.value === process.env.ROOT_PASSWORD) {

							await prisma.post.delete({
								where: {
									id: postId,
								},
							});

							redirect(`/list/${course_name}?success=1`);

						} else {

							redirect(`/delete/${course_name}/${id.join("/")}?error=1`);

						}

					}
				}
			>

				<input type="hidden" name="postid" value={data ? data.id : ""} />
				
				<h1>本当に削除してもよろしいですか</h1>

				<p>この操作は取り消せません。</p>

				<p>削除するデータのパス: {data.path}</p>

				<button
					type="submit"
				>
					削除
				</button>

			</form>

		</div>
	)

}
