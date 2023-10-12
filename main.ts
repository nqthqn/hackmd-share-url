import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	SuggestModal,
} from "obsidian";

import type { PluginManifest } from "obsidian";

import { publishAndGetLink } from "./Api";
import type { ApiFn } from "./Api";

interface MyPluginSettings {
	api_key: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	api_key: "",
};

function makeCommand(
	app: App,
	commandName: string,
	apiFn: ApiFn,
	token: string
) {
	return {
		id: `My-${commandName.toLowerCase().replace(" ", "-")}`,
		name: commandName,
		editorCallback: async (editor: Editor) => {
			if (token.length == 0) {
				new Notice(`First set the API token in plugin settings.`);
				return;
			}
			// Get contents of the current markdown document
			const content = editor.getDoc().getValue();
			if (content != "") {
				// Share it to HackMD and get back a Share URL
				const shareUrl = await apiFn(content, "guest", token);
				if (shareUrl.length == 0) {
					new Notice(`Oops — No content.`);
					return;
				}
				// Paste this into your clipboard.
				navigator.clipboard.writeText(shareUrl);
			} else {
				new Notice(`Oops — Select a word first.`);
			}
		},
	};
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings = {
		api_key: "",
	};

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
	}

	// Initial plugin setup, configure all the resources needed by the plugin
	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_ID, (leaf) => new MyView(leaf));
		this.addRibbonIcon("messages-square", "Recent Notes", () => {
			this.activateView();
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand(
			makeCommand(
				this.app,
				"Publish to HackMD",
				publishAndGetLink,
				this.settings.api_key
			)
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
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
	}
}

// My View
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
			props: {
				variable: 42,
			},
		});
	}

	async onClose() {
		// Kill the svelte app
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
		containerEl.createEl("a", {
			text: "Generate HackMD API Token",
			href: "https://hackmd.io/settings#api",
		});

		new Setting(containerEl)
			.setName("API Token")
			.setDesc(
				"Free plan includes call limit of 2000. Call limit resets every 30 days."
			)
			.addText((text) =>
				text
					.setPlaceholder("3MGC...LRI")
					.setValue(this.plugin.settings.api_key)
					.onChange(async (value) => {
						this.plugin.settings.api_key = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
