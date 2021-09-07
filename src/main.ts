import { Menu, MenuItem, normalizePath, Plugin, TAbstractFile, TFile, WorkspaceLeaf } from "obsidian";
import CodeView from "./view";
import { OpenFileDialog} from "./OpenDialog";

export default class CodeViewPlugin extends Plugin {
  private openDialog: OpenFileDialog;
  
  async onload(): Promise<void> {
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
    
    this.openDialog = new OpenFileDialog(this.app, this);
    this.addCommand({
      id: "css-file-open",
      name: "Open/create css snippet",
      callback: () => {
        this.openDialog.start();
      },
    });
  }

  addFileMenuItem(cmMode:string, ext: string) {
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

  getNewUniqueFilepath(basename:string, ext:string, folderpath:string):string {
    let fpath = normalizePath(`${folderpath}/${basename}.${ext}`); 
    let i = 0;
    while(this.app.vault.getAbstractFileByPath(fpath)) {
      fpath = normalizePath(`${folderpath}/${basename}_${i}.${ext}`);
      i++;
    }
    return fpath;
  }
}
