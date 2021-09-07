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
    switch(this.file.extension) {
      case "js": this.sourceMode.cmEditor.setOption("mode", "javascript"); break;
      case "css": this.sourceMode.cmEditor.setOption("mode", "css"); break;
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
