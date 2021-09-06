import { Plugin, WorkspaceLeaf } from "obsidian";
import CodeView from "./view";

export default class CodeViewPlugin extends Plugin {
  async onload(): Promise<void> {
    const register = (ext: string) => {
      this.registerView(ext, (leaf: WorkspaceLeaf, ext?: string)=>{return new CodeView(leaf,ext)});
      this.registerExtensions([ext], ext);
    }
    register("js");
    register("css");
  }
}
