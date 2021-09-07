import { Menu, MenuItem, normalizePath, Plugin, TAbstractFile, TFile, WorkspaceLeaf } from "obsidian";
import CodeView from "./view";
import { CodeViewSettings, DEFAULT_SETTINGS, CodeViewSettingTab } from "./settings";

export default class CodeViewPlugin extends Plugin {
  public settings: CodeViewSettings;
  
  async onload(): Promise<void> {
    await this.loadSettings();
    
    const register = (ext: string) => {
      try {
        this.registerView(ext, (leaf: WorkspaceLeaf, ext?: string)=>{return new CodeView(leaf,ext)});
        this.registerExtensions([ext], ext);
      } catch (e) {
        console.log("CodeView can't register extension: "+ext);
      }
    }
    register("js");
    register("css");
    this.addFileMenuItem("javascript","js");
    this.addFileMenuItem("css","css");
  }

  private addFileMenuItem(cmMode:string, ext: string) {
    this.registerEvent(this.app.workspace.on("file-menu", (menu: Menu, file: TFile) => {
      menu.addItem((item: MenuItem) => {
        item.setTitle(`Add ${ext} file`)
          .onClick(async (evt) => {
            let folderpath = file.path;
            if(file instanceof TFile) {
              folderpath = normalizePath(file.path.substr(0,file.path.lastIndexOf(file.name)));  
            }
            const fpath = this.getNewUniqueFilepath("untitled",ext,folderpath);
            await this.app.vault.create(fpath,"");
            const leaf = this.app.workspace.getLeaf();
            leaf.setViewState({type:ext,state: {file: fpath}});
          })
      });      
    }));  
  }

  private getNewUniqueFilepath(basename:string, ext:string, folderpath:string):string {
    let fpath = normalizePath(`${folderpath}/${basename}.${ext}`); 
    let i = 0;
    while(this.app.vault.getAbstractFileByPath(fpath)) {
      fpath = normalizePath(`${folderpath}/${basename}_${i++}.${ext}`);
    }
    return fpath;
  }
  
  public async runMirror() {
    //@ts-ignore
    const configDir = this.app.vault.configDir;
    //@ts-ignore
    this.app.vault.adapter.fs.readdir(app.vault.adapter.getFullRealPath(`${this.configDir}/snippets`),"",(e,files)=>{
      if(e) {
        console.log(e);
        return;
      }
      files.forEach(async (snippet:string)=>{
        const snippetVaultPath = `${configDir}/snippets/${snippet}`;
        const snippetMirrorPath = normalizePath(`${this.setting.mirrorFolderPath}/${snippet}`);
        const snippetMirrorFile = this.app.vault.getAbstractFileByPath(snippetMirrorPath);
        const snippetString = await this.app.vault.readRaw(snippetVaultPath);
        if(!snippetMirrorFile) {
          this.app.vault.create(snippetMirrorPath,snippetString);
        }
        else { 
          this.app.vault.modify(snippetMirrorFile,snippetString);
        }
      });
    }  
  }
  
  public async saveSettings() {
    await this.saveData(this.settings);
  }
  
  private async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }  
}
