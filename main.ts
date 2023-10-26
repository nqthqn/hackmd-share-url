import { App, Editor, Notice, Plugin } from "obsidian";

import type {
	MarkdownFileInfo,
	MarkdownView,
	PluginManifest,
	TFile,
} from "obsidian";
import { api, type Api } from "./Api/Api";
import { HackMdSettingsTab } from "HackMdSettingsTab";
import { HackMdPaneItemView } from "HackMdPaneItemView";
import store from "store";
export const VIEW_ID = "hackmd-view";
export const VIEW_ICON = "messages-square";
const HACKMD_PROP_NAME = "hackMdPublishLink";
interface MyPluginSettings {
	API_KEY: string;
}
const DEFAULT_SETTINGS: MyPluginSettings = {
	API_KEY: "",
};

// THE HACK MD PLUGIN

export default class HackMdPlugin extends Plugin {
	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
	}

	settings: MyPluginSettings = {
		API_KEY: "",
	};

	getHackMdPublishLink(file: TFile): string {
		const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (fm && fm[HACKMD_PROP_NAME]) {
			return fm[HACKMD_PROP_NAME];
		}
		return "";
	}

	async setHackMdPublishLink(file: TFile, link: string): Promise<void> {
		await this.app.fileManager.processFrontMatter(
			file,
			(fm) => (fm[HACKMD_PROP_NAME] = link)
		);
	}

	async onload() {
		// Setup API client from access token in settings
		const hackMdApi = await this.loadApiWithSettings();

		// Register the view
		this.registerAndActivePane(hackMdApi);

		store.plugin.set(store.init(hackMdApi));

		const file = this.app.workspace.getActiveFile();
		if (file) {
			const activeFilePublishUrl = this.getHackMdPublishLink(file);
			store.plugin.update((state) => ({
				...state,
				activeFilePublishUrl,
			}));
		}

		this.app.workspace.on("active-leaf-change", (leaf) => {
			if (leaf?.view.getViewType() != "markdown") return;

			const file = this.app.workspace.activeEditor?.file;
			let fm = undefined;

			if (file) {
				fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
			}

			if (fm && fm[HACKMD_PROP_NAME]) {
				const activeFilePublishUrl = fm[HACKMD_PROP_NAME];
				if (activeFilePublishUrl) {
					store.plugin.update((state) => ({
						...state,
						activeFilePublishUrl,
					}));
				}
			}
		});

		// Register commands
		this.addCommand({
			id: `hackmd-publish`,
			name: "Publish",
			editorCallback: async (
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			) => {
				//  Guards
				if (!ctx.file) return;

				// Check if note has already been published
				const link = this.getHackMdPublishLink(ctx.file);
				if (link) {
					navigator.clipboard.writeText(link);
					new Notice(
						"Already published, link copied from file properties."
					);
					return;
				}

				const content = editor.getDoc().getValue();
				const note = await hackMdApi.createNote(content);

				if (note) {
					this.setHackMdPublishLink(ctx.file, note.publishLink);
					await navigator.clipboard.writeText(note.publishLink);
					new Notice(note.publishLink);
				}
			},
		});

		this.addSettingTab(new HackMdSettingsTab(this.app, this));
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
		const hackMdApi = api(this.settings.API_KEY);
		store.plugin.update((state) => ({ ...state, hackMdApi }));
	}

	async loadApiWithSettings() {
		await this.loadSettings();
		this.saveSettings();
		return api(this.settings.API_KEY);
	}

	registerAndActivePane(hackMdApi: Api) {
		this.registerView(
			VIEW_ID,
			(leaf) => new HackMdPaneItemView(leaf, hackMdApi)
		);
		this.addRibbonIcon(VIEW_ICON, "HackMD", () => {
			this.activateView();
		});
	}
}
