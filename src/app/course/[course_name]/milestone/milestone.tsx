"use client";

import { Post, Milestone } from "@prisma/client";
import { useEffect, useState } from "react";
import 'material-symbols';

import style from "./milestone.module.scss";
import { levels_data } from "@/components/levels";

export default function View({ list, milestones, course_name, root_page }: { list: Omit<Post, "content">[], milestones: Milestone[], course_name: string, root_page: string }) {

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
					setOffsetY(offsetY - e.deltaY);

				}

			};

	});

	const positions: { [key: string]: { x: number, y: number } } = {};
	const posts: { [key: string]: Omit<Post, "content"> } = {};

	for (const post of list) {

		posts[post.id] = post;

	}

	let depthMax = 0, colMax = 0;

	for (const milestone of milestones) {

		positions[milestone.postId] = {
			x: milestone.x * 500,
			y: milestone.y * 150,
		};

		depthMax = Math.max(depthMax, milestone.x);
		colMax = Math.max(colMax, milestone.y);

	}

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
					width: "calc(100% - 8rem)",
					height: "calc(100% - 8rem)",
					padding: "4rem",
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

						if (!positions[post.id]) {

							return null;

						}


						return post.requireing.map((child, j) => {

							if (!positions[child]) {

								return null;

							}

							return (
								<line key={`${i}-${j}`} x1={positions[child].x + 200} y1={positions[child].y + 50} x2={positions[post.id].x} y2={positions[post.id].y + 50} stroke="black" />
							)

						});

					})
				}

				{
					milestones.map((milestone, i) => {

						const level_data = levels_data[posts[milestone.postId].doc_level];

						const position = Object.assign({}, positions[milestone.postId]);

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
										{(posts[milestone.postId].short_name || "Untitled")}
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