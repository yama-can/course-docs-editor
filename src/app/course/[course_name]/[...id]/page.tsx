import Markdown from "@/components/markdown";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

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
		<div>

			<Markdown value={data.content} />

		</div>
	)

}
