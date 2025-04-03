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

							redirect(`/move/${course_name}/${id.join("/")}?error=1`);

						}

						if ((await cookies()).get("CK_PASSWORD")?.value === process.env.ROOT_PASSWORD) {

							await prisma.post.update({
								where: {
									id: postId,
								},
								data: {
									courseId: formData.get("target_course") as string,
									path: formData.get("target_path") as string,
								}
							});

							redirect(`/list?success=1`);

						} else {

							redirect(`/move/${course_name}/${id.join("/")}?error=1`);

						}

					}
				}
			>

				<input type="hidden" name="postid" value={data ? data.id : ""} />

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
