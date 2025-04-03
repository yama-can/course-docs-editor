"use client";

import { useEffect, useState } from "react";

export default function WaitLogin() {

	const [once, setOnce] = useState(false);

	return (
		<div>

			<h1>ログインを待機しています</h1>

			<button
				onClick={
					() => {

						if (once) return;
						setOnce(true);

						let proxy = window.open("/login", undefined, "width=500,toolbar=yes,menubar=yes,scrollbars=yes");

						if (!proxy) {

							proxy = window.open("/login");

						}

						if (!proxy) {

							location.href = "/login";
							return;

						}

						setInterval(() => {

							if (proxy.closed) {

								location.reload();

							}

						}, 100);

					}
				}
			>
				ログイン
			</button>

		</div>
	);

}
