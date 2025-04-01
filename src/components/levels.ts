import { level } from "@prisma/client";

export const levels_data = {
	[level.overview]: {
		lang_ja: "概要",
		bgcolor: "#FFFFFF",
		color: "#000000",
	},
	[level.beginner]: {
		lang_ja: "基礎",
		bgcolor: "#DAE8FC",
		color: "#000000",
	},
	[level.beginner_intermediate]: {
		lang_ja: "初中級",
		bgcolor: "#D5E8D4",
		color: "#000000",
	},
	[level.intermediate]: {
		lang_ja: "中級",
		bgcolor: "#FFF2CC",
		color: "#000000",
	},
	[level.intermediate_advanced]: {
		lang_ja: "中上級",
		bgcolor: "#F0BF8F",
		color: "#000000",
	},
	[level.advanced]: {
		lang_ja: "上級",
		bgcolor: "#F8CECC",
		color: "#000000",
	},
	[level.advanced_expert]: {
		lang_ja: "達人入門",
		bgcolor: "#E1D5E7",
		color: "#000000",
	},
	[level.expert]: {
		lang_ja: "達人",
		bgcolor: "#B5739D",
		color: "#FFFFFF",
	},
	[level.expert_master]: {
		lang_ja: "名匠入門",
		bgcolor: "#66FF66",
		color: "#000000",
	},
	[level.master]: {
		lang_ja: "名匠",
		bgcolor: "#FFD966",
		color: "#FFFFFF",
	},
	[level.master_grandmaster]: {
		lang_ja: "巨匠",
		bgcolor: "#FFCC00",
		color: "#000000",
	},
	[level.grandmaster]: {
		lang_ja: "大賢",
		bgcolor: "#FF9900",
		color: "#000000",
	},
	[level.grandmaster_legend]: {
		lang_ja: "超人",
		bgcolor: "#99CCFF",
		color: "#000000",
	},
	[level.legend]: {
		lang_ja: "伝説",
		bgcolor: "#3333FF",
		color: "#000000",
	},
	[level.legend_immortal]: {
		lang_ja: "神話",
		bgcolor: "#000099",
		color: "#FFFFFF",
	},
	[level.immortal]: {
		lang_ja: "不死",
		bgcolor: "#660033",
		color: "#FFFFFF",
	},
}