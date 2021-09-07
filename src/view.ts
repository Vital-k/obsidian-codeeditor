import { MarkdownView, WorkspaceLeaf } from "obsidian";
import type CodeViewPlugin from "./main";

export default class CodeView extends MarkdownView  {
  //File extension
  private ext: string;
  private plugin: CodeViewPlugin; 

  constructor(leaf: WorkspaceLeaf,ext: string, plugin: CodeViewPlugin) {
    super(leaf);
    this.ext = ext;
    this.plugin = plugin;
    this.app.workspace.onLayoutReady(()=>{this.contentEl.addClass("CodeView")})
  }
  
  private getSnippetPath ():[string,string] {
    if(!(this.plugin.settings.mirroringEnabled && this.ext=="css")) return [null,null];
    const snippetMirrorPath = normalizePath(`${this.plugin.setting.mirrorFolderPath}/${this.file.name}`);
    if(snippetMirrorPath === file.path) {
      //@ts-ignore
      const configDir = this.app.vault.configDir;
      const vaultPath = `${configDir}/snippets/${this.file.name}`
      //@ts-ignore
      const realPath = this.plugin.app.vault.adapter.getFullRealPath(`${configDir}/snippets/${this.file.name}`);
      return [vaultPath,realPath];
    }
    return [null,null];
  }
  
  private async setViewData (data: string, clear?: boolean): void => {
    switch(this.file.extension) {
      case "js": this.sourceMode.cmEditor.setOption("mode", "javascript"); break;
      case "css": this.sourceMode.cmEditor.setOption("mode", "css"); break;
    }
    const [vaultPath,realPath] = this.getSnippetPath();
    if(vaultPath) {
      data = await this.plugin.app.vault.readRaw(vaultPath); 
    }
    super.setViewData(data, clear);
  };
  
  async save() {
    const [vaultPath,realPath] = this.getSnippetPath();
    if(realPath) {
      //@ts-ignore
      await this.plugin.app.vault.adapter.fsPromises.writeFile(realPath,this.data);
    }
    await super.save();
  }

  canAcceptExtension(extension: string): boolean {
    return extension == this.ext;
  }

  getViewType(): string {
    return this.ext;
  }
}
