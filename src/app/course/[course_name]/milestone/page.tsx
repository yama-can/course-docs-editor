import prisma from "@/lib/db";
import View from "./milestone";
import { notFound } from "next/navigation";

export default async function Milestone({ params, searchParams }: { params: Promise<{ course_name: string }>, searchParams: Promise<{ root_page: string }> }) {

	const { course_name } = await params;
	const { root_page } = await searchParams;

	const list = await prisma.post.findMany({
		where: {
			courseId: course_name,
		},
		omit: {
			content: true,
		},
	});

	if (list.length == 0) {

		notFound();

	}

	return (
		<View list={list} course_name={course_name} root_page={root_page} />
	)

}
