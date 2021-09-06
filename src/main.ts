import { Menu, MenuItem, normalizePath, Plugin, TAbstractFile, TFile, WorkspaceLeaf } from "obsidian";
import CodeView from "./view";

export default class CodeViewPlugin extends Plugin {
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
    this.addFileMenuItem("css","css")
  }

  addFileMenuItem(cmMode:string, ext: string) {
    this.registerEvent(this.app.workspace.on("file-menu", (menu: Menu, file: TFile) => {
      menu.addItem((item: MenuItem) => {
        item.setTitle(`Add ${ext} file`)
          .onClick(evt => {
            let folderpath = file.path;
            if(file instanceof TFile) {
              folderpath = normalizePath(file.path.substr(0,file.path.lastIndexOf(file.name)));  
            }
            this.app.vault.create(this.getNewUniqueFilepath(`untitled.${ext}`,folderpath),"/*\n```"+cmMode+"*/\n");
          })
      });      
    }));  
  }

  getNewUniqueFilepath(filename:string, folderpath:string):string {
    let fname = normalizePath(folderpath +'/'+ filename); 
    let file:TAbstractFile = this.app.vault.getAbstractFileByPath(fname);
    let i = 0;
    while(file) {
      fname = normalizePath(folderpath + '/' + filename.slice(0,filename.lastIndexOf("."))+"_"+i+filename.slice(filename.lastIndexOf(".")));
      i++;
      file = this.app.vault.getAbstractFileByPath(fname);
    }
    return fname;
  }
  
}

