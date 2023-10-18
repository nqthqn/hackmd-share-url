import { Notice } from "obsidian";
import type { Note, Profile } from "Api/Types";

interface Api {
	publish: (content: string) => Promise<Note | undefined>;
	me: () => Promise<Profile | undefined>;
	// comments: (
	// 	userId: string,
	// 	shortId: string
	// ) => Promise<ReadAllComments | undefined>;
}

const endpoint = (part: string, base = "https://api.hackmd.io/v1/") =>
	viaCorsProxy(base) + encodeURIComponent(part);

const viaCorsProxy = (url: string) =>
	"https://corsproxy.io/?" + encodeURIComponent(url);

const headers = (token: string) => ({
	Authorization: `Bearer ${token}`,
	"Content-Type": "application/json",
});

export const api = (token: string): Api => ({
	publish: async (content: string): Promise<Note | undefined> => {
		const url = endpoint("notes");
		const body = JSON.stringify({
			content: content,
			readPermission: "guest",
			writePermission: "guest",
			commentPermission: "everyone",
		});

		try {
			const response = await fetch(url, {
				method: "POST",
				body: body,
				headers: headers(token),
			});
			const data = await response.json();
			const publishLink = data["publishLink"];
			new Notice(`${publishLink}`);
			return data;
		} catch (error) {
			new Notice(`API — ${error}.`);
			return undefined;
		}
	},
	me: async () => {
		const url = endpoint("me");
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers(token),
			});
			return await response.json();
		} catch (error) {
			new Notice(`API — ${error}.`);
			return undefined;
		}
	},
	// comments: async (
	// 	userPath: string,
	// 	shortId: string
	// ): Promise<ReadAllComments | undefined> => {
	// 	// const path = `@${userPath}/${shortId}/readAllComment`;
	// 	// const path = "@_mC1_D9aRTyypZIy9SJiSA/HJmHAqS-6/readAllComment";
	// 	console.log(path);
	// 	const url = endpoint(path, "https://api.hackmd.io/");
	// 	try {
	// 		const response = await fetch(url, {
	// 			method: "GET",
	// 			headers: headers(token),
	// 		});
	// 		return await response.json();
	// 	} catch (error) {
	// 		new Notice(`API — ${error}.`);
	// 		return undefined;
	// 	}
	// },
});
