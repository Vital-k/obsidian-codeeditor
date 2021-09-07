import { 
  App, 
  FuzzySuggestModal, 
  TFile 
} from "obsidian";
import CodeViewPlugin from './main';

const EMPTY = "no matching file";

export class OpenFileDialog extends FuzzySuggestModal<TFile> {
  public app: App;
  private plugin: CodeViewPlugin;
  private addText: Function;
  private filePath: string;
  private files: string[];
  private configDir: string;

  constructor(app: App, plugin: CodeViewPlugin) {
    super(app);
    this.app = app;
    this.plugin = plugin;
    //@ts-ignore
    this.configDir = this.app.vault.configDir
  
    this.inputEl.onkeyup = (e) => {
      if(e.key!="Enter") return;
      if(!this.containerEl.innerText.includes(EMPTY)) return;
      const snippetFolder = this.configDir+"/snippets";
      //@ts-ignore
      this.app.vault.adapter.fs.exists(this.app.vault.adapter.getFullRealPath(snippetFolder),async (e) => {
        if(!e) await this.app.vault.createFolder(snippetFolder);
        const snippetPath = this.app.vault.adapter.getFullRealPath(configDir+"/snippets/"+this.inputEl.value+".css");
        await this.app.vault.adapter.fsPromises.writeFile(snippetPath,"");
        this.onChooseItem(this.inputEl.value+".css");
        this.close();
      });
    };
  }
  
  getItems(): string[] {
    return this.files;
  }

  getItemText(item: string): string {
    return this.configDir+"/snippets/"+item; 
  }

  onChooseItem(item: string, _evt?: MouseEvent | KeyboardEvent): void {
    const leaf = this.plugin.app.workspace.getLeaf();
    leaf.setViewState({type:"css",state: {file: this.configDir+"/snippets/"+item}});
  }

  public start(): void {
    this.setInstructions([{
      command: "Select css snippet to edit",
      purpose: "",
    }]);
    this.emptyStateText = EMPTY;
    this.setPlaceholder("select a css snippet to edit");
    //@ts-ignore
    this.app.vault.adapter.fs.readdir(app.vault.adapter.getFullRealPath(`${this.configDir}/snippets`),"",(e,f)=>{
      this.files = f;
      this.open();
    })
  }
}
