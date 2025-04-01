import Markdown from "@/components/markdown";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ListPage({ params }: { params: Promise<{ password: string }> }) {

	const { password } = await params;

	if (password != process.env.ROOT_PASSWORD) {

		notFound();

	}

	const posts = await prisma.post.findMany();

	return (
		<div style={{ minWidth: "400px", width: "55%", overflowWrap: "break-word", margin: "0 auto" }}>
			<Markdown value={`
# ページ一覧

${posts.length}件のページがあります。

| ID | パス | ページ名 | 短い名前 | 操作 |
| -- | --- | --- | --- | --- |
${posts.map((post) => `| ${post.id} | \`/course/${post.courseId}/${post.path}\` | ${(post.content.match(/^# (.*)/) || ["", "Untitled"])![1]} | ${post.short_name} | [表示](/course/${post.courseId}/${post.path}) [編集](/editor/${post.courseId}/${post.path}) [移動](/move/${post.courseId}/${post.path}) [削除](/delete/${post.courseId}/${post.path}) |`).join("\n")}
`} />
		</div>
	)

}
