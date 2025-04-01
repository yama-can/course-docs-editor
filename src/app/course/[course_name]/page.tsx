export default async function CourseTop({ params }: { params: Promise<{ course_name: string }> }) {

	const { course_name } = await params;

	return (
		<div>

			<h2>教材一覧</h2>

			<iframe src={`/course/${course_name}/milestone`} style={{ width: "100%", height: "calc(100vh - 11rem)", border: "none" }} />

		</div>
	)

}
