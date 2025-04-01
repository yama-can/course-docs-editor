import Markdown from "@/components/markdown";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function TopPage({ params }: { params: Promise<{ course_name: string }> }) {

	const { course_name } = await params;

	const data = await prisma.post.findFirst({
		where: {
			courseId: course_name,
			path: "",
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
