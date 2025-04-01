"use client";

import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import 'material-symbols';

import style from "./milestone.module.scss";
import { levels_data } from "@/components/levels";

export default function View({ list, course_name, root_page }: { list: Omit<Post, "content">[], course_name: string, root_page: string }) {

	const reversed_graph: { [key: string]: string[] } = {};

	for (let i = 0; i < list.length; i++) {

		for (const child of list[i].requireing) {

			reversed_graph[child] = reversed_graph[child] || [];

			reversed_graph[child].push(list[i].id);

		}

	}

	const depth: { [key: string]: number } = {};
	const height: { [key: string]: number } = {};
	const seen: { [key: string]: boolean } = {};

	// 戻り値は高さ
	function dfs(i: string, now_depth: number, parent_height: number) {

		if (depth[i] || depth[i] >= now_depth) {

			return height[i];

		}

		seen[i] = true;

		let now_height = height[i] = parent_height;

		depth[i] = now_depth;

		if (!reversed_graph[i]) {

			return now_height;

		}

		for (const child of reversed_graph[i]) {

			now_height = dfs(child, now_depth + 1, now_height);

			now_height++;

		}

		return now_height;

	}

	dfs(root_page, 0, 0);

	const positions = Array(list.length).fill({ x: 0, y: 0 });

	let depthMax = 0;
	let colMax = 0;

	for (let i = 0; i < list.length; i++) {

		positions[i] = { x: depth[list[i].id] * 500, y: height[list[i].id] * 150 };

		depthMax = Math.max(depthMax, depth[list[i].id]);
		colMax = Math.max(colMax, height[list[i].id]);

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
				<span className="material-symbols-outlined" style={{ top: "-0rem" }} onClick={() => { window.open(`/course/${course_name}/milestone?root_page=${root_page}`, "_new") }}>fullscreen</span>
			</div>
			<svg
				style={{
					width: "100%",
					height: "calc(100vh - 6rem)",
					position: "absolute",
					transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
				}}
				viewBox={`0 0 ${(depthMax + 1) * 500 - 300} ${(colMax + 1) * 150 - 50}`}
				preserveAspectRatio="xMidYMid meet"
				xmlns="http://www.w3.org/2000/svg"
				className="no-nav no-padding no-scrollbar"
			>

				{
					list.map((post, i) => {

						if (!seen[post.id]) {

							return null;

						}

						if (!reversed_graph[post.id]) {

							return null;

						}

						return reversed_graph[post.id].map((child, j) => {

							const childIndex = list.findIndex((post) => post.id === child);

							if (childIndex === -1) {

								return null;

							}

							return (
								<line key={`${i}-${j}`} x1={positions[childIndex].x} y1={positions[childIndex].y + 50} x2={positions[i].x + 200} y2={positions[i].y + 50} stroke="black" />
							)

						});

					})
				}

				{
					positions.map((position, i) => {

						if (!seen[list[i].id]) {

							return null;

						}

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