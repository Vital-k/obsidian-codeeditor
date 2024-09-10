import { MarkdownView, normalizePath, WorkspaceLeaf } from "obsidian";
import type CodeViewPlugin from "./main";

export default class CodeView extends MarkdownView {
  //File extension
  private ext: string;
  private plugin: CodeViewPlugin;
  private sourceMode: any; // Add this line to define sourceMode

  constructor(leaf: WorkspaceLeaf, ext: string, plugin: CodeViewPlugin) {
    super(leaf);
    this.ext = ext;
    console.log(ext);
    this.plugin = plugin;
    this.app.workspace.onLayoutReady(() => {
      this.contentEl.addClass("CodeView")
    });
  }

  public async setViewData(data: string, clear?: boolean) {
    switch (this.file.extension) {
      case "js": this.sourceMode.cmEditor.setOption("mode", "javascript"); break;
      case "css": this.sourceMode.cmEditor.setOption("mode", "css"); break;
    }
    const [vaultPath, realPath] = this.plugin.getMirrorPath(this.file.name, this.file.path, this.file.extension);
    if (vaultPath) {
      try {
        //@ts-ignore
        data = await this.plugin.app.vault.readRaw(vaultPath);
      } catch (e) {
        console.log(e);
      }
    }
    super.setViewData(data, clear);
  };

  async save(clear?: boolean) {
    const [vaultPath, realPath] = this.plugin.getMirrorPath(this.file.name, this.file.path, this.file.extension);
    if (realPath) {
      //@ts-ignore
      await this.plugin.app.vault.adapter.fsPromises.writeFile(realPath, this.data);
    }
    await super.save(clear);
  }

  canAcceptExtension(extension: string): boolean {
    return extension == this.ext;
  }

  getViewType(): string {
    return this.ext;
  }

}
