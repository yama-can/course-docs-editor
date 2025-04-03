"use client";

import React, { useEffect } from "react";
import LoginAction from "./action";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {

	const { error, success } = React.use(searchParams);

	if (success == "true") {

		useEffect(() => {

			window.close();

		});

		return (
			<div>
				<h1>Login Successful</h1>
				<p>
					You can now close this window.
				</p>
			</div>
		)

	}

	return (
		<form
			action={LoginAction}
		>

			<h1>Login</h1>

			{
				error == "invalid-password" && (
					<>
						<div className="error">
							Invalid Password
						</div>
						<br />
					</>
				)
			}

			<input type="text" name="username" placeholder="Username" readOnly defaultValue="root" autoComplete="username" />
			<br />
			<input type="password" name="password" placeholder="Password" autoComplete="current-password" />
			<br />
			<button type="submit">Login</button>

		</form>
	)

}
