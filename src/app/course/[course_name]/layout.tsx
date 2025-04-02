import "./layout-globals.scss";

export default async function CourseLayout({ children, params }: { children: React.ReactNode, params: Promise<{ course_name: string }> }) {

	const { course_name } = await params;

	return (
		<div style={{ minWidth: "400px", width: "55%", overflowWrap: "break-word", margin: "0 auto" }} className="course-layout">

			<div className="course-layout-header">

				<a href={`/course/${course_name}/milestone`}>
					教材一覧
				</a>

			</div>

			{children}

		</div>
	)

}
