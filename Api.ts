import { Notice } from "obsidian";

export type ApiFn = (
	content: string,
	writePermission: "guest" | "signed_in",
	token: string
) => Promise<string>;

export async function publishAndGetLink(
	content: string,
	writePermission: "guest" | "signed_in",
	token: string
): Promise<string> {
	const url = viaCorsProxy("https://api.hackmd.io/v1/notes");
	const options = makeOptions(
		"POST",
		token,
		JSON.stringify({
			content: content,
			readPermission: "guest",
			writePermission: writePermission,
			commentPermission: "everyone",
		})
	);

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		const publishLink = data["publishLink"];
		new Notice(`${publishLink}`);
		return publishLink;
	} catch (error) {
		new Notice(`API — ${error}.`);
		return "";
	}
}

const makeOptions = (verb: "GET" | "POST", token: string, body: string) => ({
	body: body,
	method: verb,
	headers: {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	},
});

const viaCorsProxy = (url: string) =>
	"https://corsproxy.io/?" + encodeURIComponent(url);

export async function getNotes() {
	const options = makeOptions("GET", "BAD", "{}");
	const url = viaCorsProxy("https://api.hackmd.io/v1/notes");
	try {
		const response = await fetch(url, options);
		const data = await response.json();
		const publishLink = data["publishLink"];
		new Notice(`${publishLink}`);
		return publishLink;
	} catch (error) {
		new Notice(`API — ${error}.`);
		return "";
	}
}
