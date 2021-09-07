import {
  App, 
  PluginSettingTab, 
  Setting,
  normalizePath,
  ToggleComponent
} from 'obsidian';
import type CodeViewPlugin from "./main";

export interface CodeViewSettings {
  mirrorFolderPath: string,
  mirroringEnabled: boolean,
  fileEventHandlerEnabled: boolean,
}

export const DEFAULT_SETTINGS: CodeViewSettings = {
  mirrorFolderPath: 'CSS-snippets-themes',
  mirroringEnabled: false,
  fileEventHandlerEnabled: false,
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
    const configDir = this.plugin.app.vault.configDir;
    this.requestMirrorRefresh = false;
    let {containerEl} = this;
    this.containerEl.empty();

    let mirrorToggle:ToggleComponent;
    new Setting(containerEl)
      .setName("Enable css snippets and themes mirroring") 
      .setDesc(`If you turn this on then ${configDir}/snippets and ${configDir}/snippets will be copied to the mirror folder specified below.`)
      .addToggle(toggle => {
        mirrorToggle = toggle;
        toggle
          .setValue(this.plugin.settings.mirroringEnabled)
          .onChange(async (value) => {
            this.plugin.settings.mirroringEnabled = value;
            await this.plugin.saveSettings();
            this.requestMirrorRefresh = value;
          })
      });

    new Setting(containerEl)
    .setName("CSS snippet mirror folder") 
    .setDesc(`Folder to use as a mirror of the ${configDir}/snippets and ${configDir}/snippets css files.`)
    .addText(text => text
      .setPlaceholder('Mirror folder path')
      .setValue(this.plugin.settings.mirrorFolderPath)
      .onChange(async (value) => {
        mirrorToggle.setValue(false);
        this.plugin.settings.mirrorFolderPath = value;
        await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Enable file event handlers for snippets and themes") 
      .setDesc(`⚠⚡⚠⚡⚠⚡ Make sure you have a backup of your snippets and themes. Only turn this on if you know what you are doing. \n` + 
               `If you delete a file from your mirror folder it will be deleted from ${configDir}/snippets or ${configDir}/snippets respectively. `+
               `Note that moving a file out of the mirror folder will also delete the snippet or theme from the ${configDir}/ . Moving it back will create it in the ${configDir}/ folder. ` +
               `If you rename a file in the mirror folder, the snippet or theme file will be renamed as well. ` + 
               `If you rename, move, or delete the complete mirror folder, the snippet and theme files will get deleted. If you move the mirror folder back to the configured location, files will be created again in the ${configDir}/ folders.` +
               `The file event handlers will only run if both mirroring is enabled and event handlers are enabled. `)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.fileEventHandlerEnabled)
        .onChange(async (value) => {
          this.plugin.settings.fileEventHandlerEnabled = value;
          await this.plugin.saveSettings();
        })
      );

  }
}
