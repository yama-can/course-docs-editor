import prisma from "@/lib/db";
import View from "./milestone";
import { notFound } from "next/navigation";

export default async function Milestone({ params }: { params: Promise<{ course_name: string }> }) {

	const { course_name } = await params;

	const list = await prisma.post.findMany({
		where: {
			courseId: course_name,
		},
	});

	if (list.length == 0) {

		notFound();

	}

	return (
		<View list={list} course_name={course_name} />
	)

}
