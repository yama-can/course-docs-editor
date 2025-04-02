"use client";

import { Post, Milestone } from "@prisma/client";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import 'material-symbols';

import style from "./milestone.module.scss";
import { levels_data } from "@/components/levels";

enum DragType {
	None,
	PageMove,
	ItemMove,
}

export default function View({ list, milestones, course_name, root_page }: { list: Omit<Post, "content">[], milestones: Milestone[], course_name: string, root_page: string }) {

	const [drag, setDrag] = useState(DragType.None);
	const [draggingPost, setDraggingPost] = useState<string | null>(null);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [zoom, setZoom] = useState(1);

	const positions: { [key: string]: [{ x: number, y: number }, Dispatch<SetStateAction<{ x: number, y: number }>>] } = {};
	const posts: { [key: string]: Omit<Post, "content"> } = {};
	const ref: { [key: string]: RefObject<SVGGElement | null> } = {};

	useEffect(() => {

		document.onmousedown =
			(e) => {

				if (e.button === 0) {

					setStartX(e.clientX);
					setStartY(e.clientY);

					for (const postId in ref) {

						const el = ref[postId].current;

						if (!el) {

							continue;

						}

						if (el.getBoundingClientRect().left <= e.clientX && el.getBoundingClientRect().right >= e.clientX && el.getBoundingClientRect().top <= e.clientY && el.getBoundingClientRect().bottom >= e.clientY) {

							setDrag(DragType.ItemMove);
							setDraggingPost(postId);
							return;

						}

						setDrag(DragType.PageMove);

					}

				}

			};

		document.onmouseup =
			(e) => {

				if (e.button === 0) {

					setDrag(DragType.None);

				}

			};

		document.onmousemove =
			(e) => {

				if (drag === DragType.PageMove) {

					const newOffsetX = offsetX + (e.clientX - startX);
					const newOffsetY = offsetY + (e.clientY - startY);
					setOffsetX(newOffsetX);
					setOffsetY(newOffsetY);
					setStartX(e.clientX);
					setStartY(e.clientY);

				} else if (drag === DragType.ItemMove && draggingPost) {

					const el = ref[draggingPost].current;

					if (!el) {

						return;

					}

					const newX = positions[draggingPost][0].x + (e.clientX - startX);
					const newY = positions[draggingPost][0].y + (e.clientY - startY);

					positions[draggingPost][1]({ x: newX, y: newY });
					
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

	for (const post of list) {

		posts[post.id] = post;

	}

	let depthMax = 0, colMax = 0;

	for (const milestone of milestones) {

		positions[milestone.postId] = useState({
			x: milestone.x * 500,
			y: milestone.y * 150,
		});

		depthMax = Math.max(depthMax, milestone.x);
		colMax = Math.max(colMax, milestone.y);
		ref[milestone.postId] = useRef<SVGGElement | null>(null);

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
								<line key={`${i}-${j}`} x1={positions[child][0].x + 200} y1={positions[child][0].y + 50} x2={positions[post.id][0].x} y2={positions[post.id][0].y + 50} stroke="black" />
							)

						});

					})
				}

				{
					milestones.map((milestone, i) => {

						const level_data = levels_data[posts[milestone.postId].doc_level];

						const position = Object.assign({}, positions[milestone.postId]);

						return (
							<g key={i} ref={ref[milestone.postId]} style={{ userSelect: "none", cursor: "pointer" }}>
								<rect x={position[0].x} y={position[0].y} width="200" height="100" fill={level_data.bgcolor} stroke={level_data.bgcolor == "#FFFFFF" ? "#000000" : "none"} />
								<text x={position[0].x + 100} y={position[0].y + 100 / 3} textAnchor="middle" dominantBaseline="middle" fill={level_data.color} fontSize="20">
									{(posts[milestone.postId].short_name || "Untitled")}
								</text>
								<text x={position[0].x + 100} y={position[0].y + 200 / 3} textAnchor="middle" dominantBaseline="middle" fill={level_data.color} fontSize="20">
									{level_data.lang_ja}
								</text>
							</g>
						)

					})
				}

			</svg>
		</div >
	)

}