import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import type { PluginManifest } from "obsidian";
import { api } from "./Api/Api";

interface MyPluginSettings {
	API_KEY: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	API_KEY: "",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings = {
		API_KEY: "",
	};
	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
	}

	async onload() {
		await this.loadSettings();
		this.registerView(VIEW_ID, (leaf) => new MyView(leaf));
		this.addRibbonIcon("messages-square", "Recent Notes", () => {
			this.activateView();
		});

		this.addCommand({
			id: `hackmd-publish`,
			name: "Share",
			editorCallback: async (editor: Editor) => {
				// First check
				const content = editor.getDoc().getValue();
				if (this.settings.API_KEY.length == 0) {
					new Notice(`API key missing`);
					return;
				}
				if (content == "") {
					new Notice("Missing content");
					return;
				}
				const HackMd = api(this.settings.API_KEY);
				const note = await HackMd.publish(content);
				// const me = await HackMd.me();
				// if (me && note) {
				// 	const comments = await HackMd.comments(
				// 		me.userPath,
				// 		note.shortId
				// 	);
				// 	console.log(comments);
				// }
				if (note) {
					navigator.clipboard.writeText(note.publishLink);
					new Notice("Share link copied to clipboard");
				}
			},
		});

		this.addSettingTab(new MyPluginSettingTab(this.app, this));
	}
	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_ID);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_ID,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_ID)[0]
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		await this.loadSettings();
	}
}
import { ItemView, WorkspaceLeaf } from "obsidian";
import RecentlyShared from "./components/RecentlyShared.svelte";

export const VIEW_ID = "hackmd-recently-shared";

export class MyView extends ItemView {
	component: RecentlyShared;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_ID;
	}

	getDisplayText() {
		return "Recently Shared";
	}

	async onOpen() {
		this.component = new RecentlyShared({
			target: this.containerEl.children[1],
			props: {},
		});
	}

	async onClose() {
		this.component.$destroy();
	}
}

/**
 * Setting Pane
 */

class MyPluginSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Settings" });
		containerEl.createEl("p", {
			text: "To interact with your HackMD account create an access token.",
		});
		containerEl.createEl("a", {
			text: "Create access token",
			href: "https://hackmd.io/settings#api",
		});

		new Setting(containerEl)
			.setName("Access Token")
			.setDesc(
				"Free plan includes call limit of 2000. Call limit resets every 30 days."
			)
			.addText((text) =>
				text
					.setPlaceholder("Paste token here")
					.setValue(this.plugin.settings.API_KEY)
					.onChange(async (value) => {
						this.plugin.settings.API_KEY = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
