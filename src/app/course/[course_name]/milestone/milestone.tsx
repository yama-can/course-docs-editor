"use client";

import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import 'material-symbols';

import style from "./milestone.module.scss";
import { levels_data } from "@/components/levels";

export default function View({ list, course_name }: { list: Post[], course_name: string }) {

	const checked = Array(list.length).fill(false);
	const depth = Array(list.length).fill(0);

	// 深さを DFS
	function dfs(i: number) {

		const post = list[i];

		let maxima = -1;

		for (const child of post.requireing) {

			const childIndex = list.findIndex((post) => post.id === child);

			if (checked[childIndex]) {

				maxima = Math.max(depth[childIndex], maxima);
				continue;

			}

			checked[childIndex] = true;

			maxima = Math.max(dfs(childIndex), maxima);

		}

		return depth[i] = maxima + 1 + post.milestone_delay;

	}

	for (let i = 0; i < list.length; i++) {

		if (checked[i]) {

			continue;

		}

		checked[i] = true;

		dfs(i);

	}

	const positions = Array(list.length).fill({ x: 0, y: 0 });

	const depthCount = Array(list.length).fill(0);
	let depthMax = 0;
	let colMax = 0;

	for (let i = 0; i < list.length; i++) {

		positions[i] = { x: depth[i] * 500, y: depthCount[depth[i]] * 150 };
		depthCount[depth[i]]++;

		depthMax = Math.max(depthMax, depth[i]);
		colMax = Math.max(colMax, depthCount[depth[i]]);

	}

	const [dragging, setDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [zoom, setZoom] = useState(1);

	useEffect(() => {

		document.onmousedown =
			(e) => {

				if (e.button === 0) {

					setDragging(true);
					setStartX(e.clientX);
					setStartY(e.clientY);

				}

			};

		document.onmouseup =
			(e) => {

				if (e.button === 0) {

					setDragging(false);

				}

			};

		document.onmousemove =
			(e) => {

				if (dragging) {

					const newOffsetX = offsetX + (e.clientX - startX);
					const newOffsetY = offsetY + (e.clientY - startY);
					setOffsetX(newOffsetX);
					setOffsetY(newOffsetY);
					setStartX(e.clientX);
					setStartY(e.clientY);

				}

			};

		document.onwheel =
			(e) => {

				if (e.ctrlKey) {

					e.preventDefault();
					e.stopPropagation();

					console.log("zoom");

					setZoom(Math.max(0.1, Math.min(10, zoom + (e.deltaY > 0 ? -0.1 : 0.1))));

				} else {

					e.preventDefault();
					e.stopPropagation();

					setOffsetX(offsetX + e.deltaX);
					setOffsetY(offsetY + e.deltaY);

				}

			};

	});

	return (
		<div>
			<div className={style["button-list"]}>
				<span className="material-symbols-outlined" style={{ top: "-9rem" }} onClick={() => { setZoom(zoom * 1.1); }}>zoom_in</span>
				<span className="material-symbols-outlined" style={{ top: "-6rem" }} onClick={() => { setZoom(zoom * 0.9); }}>zoom_out</span>
				<span className="material-symbols-outlined" style={{ top: "-3rem" }} onClick={() => { setOffsetX(0); setOffsetY(0); setZoom(1); }}>center_focus_strong</span>
				<span className="material-symbols-outlined" style={{ top: "-0rem" }} onClick={() => { window.open(`/course/${course_name}/milestone`, "_new") }}>fullscreen</span>
			</div>
			<svg
				style={{
					width: "100%",
					height: "calc(100vh - 6rem)",
					position: "absolute",
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
				}}
				viewBox={`0 0 ${(depthMax + 1) * 500 - 300} ${colMax * 150 - 50}`}
				preserveAspectRatio="xMidYMid meet"
				xmlns="http://www.w3.org/2000/svg"
				className="no-nav no-padding no-scrollbar"
			>

				{
					list.map((post, i) => {

						return post.requireing.map((child, j) => {

							const childIndex = list.findIndex((post) => post.id === child);

							if (childIndex === -1) {

								return null;

							}

							return (
								<line key={`${i}-${j}`} x1={positions[i].x} y1={positions[i].y + 50} x2={positions[childIndex].x + 200} y2={positions[childIndex].y + 50} stroke="black" />
							)

						});

					})
				}

				{
					positions.map((position, i) => {

						const level_data = levels_data[list[i].doc_level];

						return (
							<g key={i}>
								<a
									href={`/course/${course_name}/${list[i].path}`}
									target="_blank"
									rel="noopener noreferrer"
									style={{ userSelect: "none" }}
								>
									<rect x={position.x} y={position.y} width="200" height="100" fill={level_data.bgcolor} stroke={level_data.bgcolor == "#FFFFFF" ? "#000000" : "none"} />
									<text x={position.x + 100} y={position.y + 100 / 3} textAnchor="middle" dominantBaseline="middle" fill={level_data.color} fontSize="20">
										{(list[i].short_name || "Untitled")}
									</text>
									<text x={position.x + 100} y={position.y + 200 / 3} textAnchor="middle" dominantBaseline="middle" fill={level_data.color} fontSize="20">
										{level_data.lang_ja}
									</text>
								</a>
							</g>
						)

					})
				}

			</svg>
		</div>
	)

}