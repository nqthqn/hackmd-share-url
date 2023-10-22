import { App, PluginSettingTab, Setting } from "obsidian";
import HackMdPlugin from "main";

/**
 * Setting Pane
 */
export class HackMdSettingsTab extends PluginSettingTab {
	plugin: HackMdPlugin;

	constructor(app: App, plugin: HackMdPlugin) {
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
