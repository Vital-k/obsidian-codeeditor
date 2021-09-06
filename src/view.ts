import { MarkdownView, WorkspaceLeaf } from "obsidian";

export default class CodeView extends MarkdownView  {
  // Current file extension
  ext: string;

  constructor(leaf: WorkspaceLeaf,ext: string) {
    super(leaf);
    this.ext = ext;
    this.app.workspace.onLayoutReady(()=>{this.contentEl.addClass("CodeView")})
  }

  setViewData = (data: string, clear?: boolean): void => {
    let header = null;
    switch(this.file.extension) {
      case "js": header = "/*\n```javascript*/\n"; break;
      case "css": header = "/*\n```css*/\n"; break;
    }
    
    if(header && !data.startsWith(header)) {
      data = header + data;
    }   
    super.setViewData(data, clear);
  };

  canAcceptExtension(extension: string): boolean {
    return extension == this.ext;
  }

  getViewType(): string {
    return this.ext;
  }
}
