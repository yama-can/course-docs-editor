import Markdown from "@/components/markdown";
import WaitLogin from "@/components/wait-login";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export default async function ListPage() {

	const password = (await cookies()).get("CK_PASSWORD")?.value || "";

	if (password != process.env.ROOT_PASSWORD) {

		return <WaitLogin />;

	}

	const posts = await prisma.post.findMany();

	return (
		<div>
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
