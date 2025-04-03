"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginAction(data: FormData) {

	const password = data.get('password') as string;

	if (password != process.env.ROOT_PASSWORD) {

		redirect("/login?error=invalid-password");

	}

	(await cookies()).set("CK_PASSWORD", password, {
		maxAge: 60 * 60 * 24 * 365, // 1 Year
	});

	redirect("/login?success=true");

}
