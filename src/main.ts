import { Menu, MenuItem, normalizePath, Plugin, TAbstractFile, TFile, TFolder, WorkspaceLeaf } from "obsidian";
import CodeView from "./view";
import { CodeViewSettings, DEFAULT_SETTINGS, CodeViewSettingTab } from "./settings";

export default class CodeViewPlugin extends Plugin {
  public settings: CodeViewSettings;
  
  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new CodeViewSettingTab(this.app, this));
    const register = (ext: string) => {
      try {
        this.registerView(ext, (leaf: WorkspaceLeaf)=>{return new CodeView(leaf,ext, this)});
        this.registerExtensions([ext], ext);
      } catch (e) {
        console.log("CodeView can't register extension: "+ext);
      }
    }
    register("js");
    register("css");
    this.addFileMenuItem("javascript","js");
    this.addFileMenuItem("css","css");

    this.addCommand({
      id: "codeview-mirror",
      name: "Refresh mirror of snippets and themes",
      checkCallback: (checking: boolean) => {
        if (checking) {
          return this.settings.mirroringEnabled;
        } else {
          this.runMirror();
          return true;
        }
      },
    });

    const self = this;
    this.app.workspace.onLayoutReady(()=> {
      self.runMirror();
      const deleteEventHandler = async (file:TFile) => {
        if (!(file instanceof TFile)) return;
        if (!(this.settings.mirroringEnabled && this.settings.fileEventHandlerEnabled)) return;
        const [vaultPath,realPath] = self.getMirrorPath(file.name,file.path,file.extension);
        if(!realPath) return;
        //@ts-ignore
        self.app.vault.adapter.fs.rm(realPath,{force:true},()=>{});
      }
      self.registerEvent(
        self.app.vault.on("delete",deleteEventHandler)
      );

      const renameEventHandler = async (file:TAbstractFile,oldPath:string) => {
        if(!(file instanceof TFile)) return;
        if (!(this.settings.mirroringEnabled && this.settings.fileEventHandlerEnabled)) return;
        const [newVaultPath,newRealPath] = self.getMirrorPath(file.name,file.path,file.extension);
        const pathParts = this.splitPath(oldPath);
        const [oldVaultPath,oldRealPath] = self.getMirrorPath(pathParts.filename,oldPath,pathParts.extension);
        if(!newVaultPath && !oldVaultPath) return;
        if(newVaultPath && !oldVaultPath) {
          //file moved into folder
          //@ts-ignore
          await this.app.vault.adapter.fsPromises.writeFile(newRealPath,await this.app.vault.read(file));
          return;
        }
        if(!newRealPath && oldRealPath) { 
          //file moved out of folder
          //@ts-ignore
          self.app.vault.adapter.fs.rm(oldRealPath,{force:true},()=>{});
          return;
        }
        //file renamed within folder
        //@ts-ignore
        this.app.vault.adapter.fsPromises.rename(oldRealPath,newRealPath);
      };
      self.registerEvent(
        self.app.vault.on("rename",renameEventHandler)
      );
      
    })
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

  splitPath(filepath: string):{/*folderpath: string,*/ filename: string, extension: string} {
    const lastSlash = filepath.lastIndexOf("/");
    const lastDot = filepath.lastIndexOf(".");
    return {
      //folderpath: normalizePath(filepath.substr(0,lastSlash)), 
      filename: lastSlash==-1 ? filepath : filepath.substr(lastSlash+1),
      extension: lastDot==-1 ? "" : filepath.substr(lastDot+1),
    };
  }

  async checkAndCreateFolder(folderpath:string) {
    folderpath = normalizePath(folderpath);
    let folder = this.app.vault.getAbstractFileByPath(folderpath);
    if(folder && folder instanceof TFolder) return;
    await this.app.vault.createFolder(folderpath);
  }
  
  public async runMirror() {
    if(!this.settings.mirroringEnabled) return;
    await this.checkAndCreateFolder(this.settings.mirrorFolderPath);
    //@ts-ignore
    const configDir = this.app.vault.configDir;

    const run = async (type: string) => {
      await this.checkAndCreateFolder(`${this.settings.mirrorFolderPath}/${type}`);
      //@ts-ignore
      this.app.vault.adapter.fs.readdir(app.vault.adapter.getFullRealPath(`${configDir}/${type}`),"",(e,files) => {
        if(e) {
          console.log(e);
          return;
        }
        files.forEach(async (cssFile:string) => {
          const snippetVaultPath = `${configDir}/${type}/${cssFile}`;
          const snippetMirrorPath = normalizePath(`${this.settings.mirrorFolderPath}/${type}/${cssFile}`);
          const snippetMirrorFile = this.app.vault.getAbstractFileByPath(snippetMirrorPath);
          //@ts-ignore
          const snippetString = await this.app.vault.readRaw(snippetVaultPath);
          if(!snippetMirrorFile) {
            this.app.vault.create(snippetMirrorPath,snippetString);
          }
          else { 
            this.app.vault.modify(snippetMirrorFile as TFile,snippetString);
          }
        });
      });
    }

    run("snippets");
    run("themes");
  }
  
  public getMirrorPath (fileName:string,filePath:string,extension:string):[string,string] {
    if(!(this.settings.mirroringEnabled && extension==="css")) return [null,null];
    const snippetMirrorPath = normalizePath(`${this.settings.mirrorFolderPath}/snippets/${fileName}`);
    const themeMirrorPath   = normalizePath(`${this.settings.mirrorFolderPath}/themes/${fileName}`);
    let type = null;    
    if(snippetMirrorPath === filePath) type = "snippets";
    if(themeMirrorPath === filePath) type = "themes";
    if(type) {
      const configDir = this.app.vault.configDir;
      const vaultPath = `${configDir}/${type}/${fileName}`
      //@ts-ignore
      const realPath = this.app.vault.adapter.getFullRealPath(`${configDir}/${type}/${fileName}`);
      return [vaultPath,realPath];
    }
    return [null,null];
  }  

  public async saveSettings() {
    await this.saveData(this.settings);
  }
  
  private async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }  
}
