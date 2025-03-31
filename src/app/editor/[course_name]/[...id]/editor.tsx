"use client";

import { mdit } from "@/components/markdown";
import { useRef } from "react";

export default function Editor({ initialValue }: { initialValue: string }) {

	const ref = useRef<HTMLDivElement>(null);

	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", height: "calc(100vh - 5rem - 4rem - 2px)", border: "1px solid #ccc", borderRadius: "0.5rem", overflow: "hidden" }}>

			<div style={{ height: "calc(100vh - 5rem - 4rem - 2px)", width: "100%" }}>

				<textarea
					required
					onChange={
						(e) => {

							console.log("CNG", ref);

							if (ref.current) {

								ref.current.innerHTML = mdit.render(e.target.value);

							}

						}
					}
					onKeyDown={
						(e) => {

							if (e.ctrlKey) {

								if (e.key == "C") {

									const target = e.target as HTMLTextAreaElement;

									if (target.selectionStart == target.selectionEnd) {

										e.preventDefault();

										// 一個前の改行を取得
										const before = target.value.substring(0, target.selectionStart).lastIndexOf("\n");
										// 一個後の改行を取得
										const after = target.value.substring(target.selectionEnd).indexOf("\n");

										const start = before == -1 ? 0 : before + 1;
										const end = after == -1 ? target.value.length : target.selectionEnd + after;

										// 選択範囲をコピー
										const value = target.value.substring(start, end);
										navigator.clipboard.writeText(value);

									}

								}

							}

							if (e.key == "Tab") {

								e.preventDefault();

								const target = e.target as HTMLTextAreaElement;

								const start = target.selectionStart;
								const end = target.selectionEnd;
								const value = target.value;
								const before = value.substring(0, start);
								const after = value.substring(end);
								const tab = "\t";
								target.value = before + tab + after;
								target.selectionStart = target.selectionEnd = start + tab.length;

							}

						}
					}
					style={{ width: "calc(100% - 1rem)", height: "calc(100% - 1rem)", padding: "0.5rem", border: "none", outline: "none", fontSize: "14pt", lineHeight: 1.5, resize: "none" }}
					name="content"
					defaultValue={initialValue}
				>
				</textarea>

			</div>

			<div
				ref={ref}
				style={{ overflowX: "auto", height: "calc(100vh - 5rem - 4rem)" }}
				dangerouslySetInnerHTML={{ __html: mdit.render(initialValue) }}
			>
			</div>

		</div>
	)

}