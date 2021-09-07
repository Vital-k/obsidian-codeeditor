import {
  App, 
  PluginSettingTab, 
  Setting,
  normalizePath
} from 'obsidian';
import type CodeViewPlugin from "./main";

export interface CodeViewSettings {
  mirrorFolderPath: string,
  mirroringEnabled: boolean,
}

export const DEFAULT_SETTINGS: ExcalidrawSettings = {
  mirrorFolderPath: 'CodeView_Mirror',
  mirroringEnabled: false,
}

export class CodeViewSettingTab extends PluginSettingTab {
  plugin: CodeViewPlugin;
  requestMirrorRefresh: boolean;

  constructor(app: App, plugin: CodeViewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async hide() {
    this.plugin.settings.mirrorFolderPath = normalizePath(this.plugin.settings.mirrorFolderPath);
    await this.plugin.saveSettings();
    if(this.requestMirrorRefresh) {
      await this.plugin.runMirror();
    }
  }

  display(): void {
    //@ts-ignore
    const configDir = this.app.vault.configDir;
    this.requestMirrorRefresh = false;
    let {containerEl} = this;
    this.containerEl.empty();

    new Setting(containerEl)
      .setName("Enable css snippet mirroring") 
      .setDesc(`If you turn this on then css snippets from ${configDir}/snippets will be copied to the mirror folder specified below.`)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.mirroringEnabled)
        .onChange(async (value) => {
          this.plugin.settings.mirroringEnabled = value;
          await this.plugin.saveSettings();
          if(value) {
            this.requestMirrorRefresh = true;
          }
        }));

    new Setting(containerEl)
    .setName("CSS snippet mirror folder") 
    .setDesc(`Folder to use as a mirror of the ${configDir}/snippets css files.`)
    .addText(text => text
      .setPlaceholder('Mirror folder path')
      .setValue(this.plugin.settings.mirrorFolderPath)
      .onChange(async (value) => {
        this.plugin.settings.mirroringEnabled = false;
        this.plugin.settings.mirrorFolderPath = value;
        await this.plugin.saveSettings();
      }));
  }
}
