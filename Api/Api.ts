import { Notice, requestUrl } from "obsidian";
import type { Note, Profile, ReadAllComments } from "Api/Types";

export interface Api {
	createNote: (content: string) => Promise<Note | undefined>;
	getProfile: () => Promise<Profile | undefined>;
	getNotes: () => Promise<Note[]>;
	getComments: (noteShortId: string) => Promise<ReadAllComments | undefined>;
}

const endpoint = (part: string, base = "https://api.hackmd.io/v1/") =>
	base + part;

const headersWithToken = (token: string) => ({
	Authorization: `Bearer ${token}`,
	"Content-Type": "application/json",
});

export const api = (token: string): Api => {
	if (token.length === 0) {
		new Notice("Set access token in plugin settings");
		throw Error("No access token set");
	}
	return {
		createNote: async (content: string): Promise<Note | undefined> => {
			const url = endpoint("notes");
			const body = JSON.stringify({
				content: content,
				readPermission: "guest",
				writePermission: "guest",
				commentPermission: "everyone",
			});
			const method = "POST";
			const headers = headersWithToken(token);
			try {
				const data = await requestUrl({ url, body, method, headers })
					.json;
				return data;
			} catch (error) {
				new Notice(`API — ${error}.`);
				return undefined;
			}
		},
		getNotes: async (): Promise<Note[]> => {
			const url = endpoint("notes");
			const method = "GET";
			const headers = headersWithToken(token);
			try {
				const data = await requestUrl({ url, method, headers }).json;
				return data;
			} catch (error) {
				new Notice(`API — ${error}.`);
				return [];
			}
		},
		getProfile: async () => {
			const url = endpoint("me");
			const headers = headersWithToken(token);
			const method = "GET";
			try {
				return await requestUrl({ url, method, headers }).json;
			} catch (error) {
				new Notice(`API — ${error}.`);
				return undefined;
			}
		},
		getComments: async (
			noteShortId: string
		): Promise<ReadAllComments | undefined> => {
			let userPath = "";
			let url = endpoint("me");
			const headers = headersWithToken(token);
			const method = "GET";

			try {
				const data = await requestUrl({ url, method, headers }).json;
				userPath = data.userPath;
			} catch (error) {
				new Notice(`API — ${error}.`);
				return undefined;
			}

			url = endpoint(
				`@${userPath}/${noteShortId}/readAllComment`,
				"https://hackmd.io/"
			);
			try {
				return await requestUrl({ url, method, headers }).json;
			} catch (error) {
				return undefined;
			}
		},
	};
};
