/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class CodeView extends obsidian.MarkdownView {
    constructor(leaf, ext, plugin) {
        super(leaf);
        this.ext = ext;
        console.log(ext);
        this.plugin = plugin;
        this.app.workspace.onLayoutReady(() => {
            this.contentEl.addClass("CodeView");
        });
    }
    setViewData(data, clear) {
        const _super = Object.create(null, {
            setViewData: { get: () => super.setViewData }
        });
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.file.extension) {
                case "js":
                    this.sourceMode.cmEditor.setOption("mode", "javascript");
                    break;
                case "css":
                    this.sourceMode.cmEditor.setOption("mode", "css");
                    break;
            }
            const [vaultPath, realPath] = this.plugin.getMirrorPath(this.file.name, this.file.path, this.file.extension);
            if (vaultPath) {
                try {
                    //@ts-ignore
                    data = yield this.plugin.app.vault.readRaw(vaultPath);
                }
                catch (e) {
                    console.log(e);
                }
            }
            _super.setViewData.call(this, data, clear);
        });
    }
    ;
    save(clear) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const [vaultPath, realPath] = this.plugin.getMirrorPath(this.file.name, this.file.path, this.file.extension);
            if (realPath) {
                //@ts-ignore
                yield this.plugin.app.vault.adapter.fsPromises.writeFile(realPath, this.data);
            }
            yield _super.save.call(this, clear);
        });
    }
    canAcceptExtension(extension) {
        return extension == this.ext;
    }
    getViewType() {
        return this.ext;
    }
}

const DEFAULT_SETTINGS = {
    mirrorFolderPath: 'CSS-snippets-themes',
    mirroringEnabled: false,
    fileEventHandlerEnabled: false,
};
class CodeViewSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.mirrorFolderPath = obsidian.normalizePath(this.plugin.settings.mirrorFolderPath);
            yield this.plugin.saveSettings();
            if (this.requestMirrorRefresh) {
                yield this.plugin.runMirror();
            }
        });
    }
    display() {
        //@ts-ignore
        const configDir = this.plugin.app.vault.configDir;
        this.requestMirrorRefresh = false;
        let { containerEl } = this;
        this.containerEl.empty();
        containerEl.createEl("p", null, (el) => {
            el.textContent = `While I made every effort to make CodeView simple and safe, there is always a risk. Please read the below carefully. ` +
                `It is always best to have a backup of your data, in this case a backup of your js code, your css themes and snippets.`;
        });
        let mirrorToggle;
        new obsidian.Setting(containerEl)
            .setName("Enable css snippets and themes mirroring")
            .setDesc(`If you turn this on then "${configDir}/snippets" and "${configDir}/themes" will be copied to the mirror folder specified below. The ` +
            `mirror does not actively monitor the snippets and themes folders. If you place new files in snippets or themes these will be picked up ` +
            `when you restart Obsidian, or when you run "Refresh mirror of snippets and themes" from Command Palette`)
            .addToggle(toggle => {
            mirrorToggle = toggle;
            toggle
                .setValue(this.plugin.settings.mirroringEnabled)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.mirroringEnabled = value;
                yield this.plugin.saveSettings();
                this.requestMirrorRefresh = value;
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("CSS snippet mirror folder")
            .setDesc(`Folder to use as a mirror of the "${configDir}/snippets" and "${configDir}/themes" css files.`)
            .addText(text => text
            .setPlaceholder('Mirror folder path')
            .setValue(this.plugin.settings.mirrorFolderPath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            mirrorToggle.setValue(false);
            this.plugin.settings.mirrorFolderPath = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName("Enable file event handlers for snippets and themes")
            .setDesc(`⚠⚡⚠⚡⚠⚡ Make sure you have a backup of your snippets and themes. Only turn this on if you know what you are doing. \n` +
            `If you delete a file from your mirror folder it will be deleted from "${configDir}/snippets" or "${configDir}/themes" respectively. ` +
            `Note that moving a file out of the mirror folder will also delete the snippet or theme from the "${configDir}/" folder. Moving it back will create it in the "${configDir}/" folder. ` +
            `If you rename a file in the mirror folder, the snippet or theme file will be renamed as well. ` +
            `If you rename, move, or delete the complete mirror folder, the snippet and theme files will get deleted. If you move the mirror folder back to the configured location, files will be created again in the "${configDir}/" folders.` +
            `The file event handlers will only run if both mirroring is enabled and event handlers are enabled. `)
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.fileEventHandlerEnabled)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.fileEventHandlerEnabled = value;
            yield this.plugin.saveSettings();
        })));
    }
}

class CodeViewPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new CodeViewSettingTab(this.app, this));
            const register = (ext) => {
                try {
                    this.registerView(ext, (leaf) => new CodeView(leaf, ext, this));
                    this.registerExtensions([ext], ext);
                }
                catch (e) {
                    console.log("CodeView can't register extension: " + ext);
                }
            };
            register("js");
            register("css");
            this.addFileMenuItem("javascript", "js");
            this.addFileMenuItem("css", "css");
            this.addCommand({
                id: "codeview-mirror",
                name: "Refresh mirror of snippets and themes",
                checkCallback: (checking) => {
                    if (checking) {
                        return this.settings.mirroringEnabled;
                    }
                    else {
                        this.runMirror();
                        return true;
                    }
                },
            });
            const self = this;
            this.app.workspace.onLayoutReady(() => {
                self.runMirror();
                const deleteEventHandler = (file) => __awaiter(this, void 0, void 0, function* () {
                    if (!(file instanceof obsidian.TFile))
                        return;
                    if (!(this.settings.mirroringEnabled && this.settings.fileEventHandlerEnabled))
                        return;
                    const [vaultPath, realPath] = self.getMirrorPath(file.name, file.path, file.extension);
                    if (!realPath)
                        return;
                    //@ts-ignore
                    self.app.vault.adapter.fs.rm(realPath, { force: true }, () => { });
                });
                self.registerEvent(self.app.vault.on("delete", deleteEventHandler));
                const renameEventHandler = (file, oldPath) => __awaiter(this, void 0, void 0, function* () {
                    if (!(file instanceof obsidian.TFile))
                        return;
                    if (!(this.settings.mirroringEnabled && this.settings.fileEventHandlerEnabled))
                        return;
                    const [newVaultPath, newRealPath] = self.getMirrorPath(file.name, file.path, file.extension);
                    const pathParts = this.splitPath(oldPath);
                    const [oldVaultPath, oldRealPath] = self.getMirrorPath(pathParts.filename, oldPath, pathParts.extension);
                    if (!newVaultPath && !oldVaultPath)
                        return;
                    if (newVaultPath && !oldVaultPath) {
                        //file moved into folder
                        //@ts-ignore
                        yield this.app.vault.adapter.fsPromises.writeFile(newRealPath, yield this.app.vault.read(file));
                        return;
                    }
                    if (!newRealPath && oldRealPath) {
                        //file moved out of folder
                        //@ts-ignore
                        self.app.vault.adapter.fs.rm(oldRealPath, { force: true }, () => { });
                        return;
                    }
                    //file renamed within folder
                    //@ts-ignore
                    this.app.vault.adapter.fsPromises.rename(oldRealPath, newRealPath);
                });
                self.registerEvent(self.app.vault.on("rename", renameEventHandler));
            });
        });
    }
    addFileMenuItem(cmMode, ext) {
        this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
            menu.addItem((item) => {
                item.setTitle(`Add ${ext} file`)
                    .onClick((evt) => __awaiter(this, void 0, void 0, function* () {
                    let folderpath = file.path;
                    if (file instanceof obsidian.TFile) {
                        folderpath = obsidian.normalizePath(file.path.substr(0, file.path.lastIndexOf(file.name)));
                    }
                    const fpath = this.getNewUniqueFilepath("untitled", ext, folderpath);
                    yield this.app.vault.create(fpath, "");
                    const leaf = this.app.workspace.getLeaf();
                    leaf.setViewState({ type: ext, state: { file: fpath } });
                }));
            });
        }));
    }
    getNewUniqueFilepath(basename, ext, folderpath) {
        let fpath = obsidian.normalizePath(`${folderpath}/${basename}.${ext}`);
        let i = 0;
        while (this.app.vault.getAbstractFileByPath(fpath)) {
            fpath = obsidian.normalizePath(`${folderpath}/${basename}_${i++}.${ext}`);
        }
        return fpath;
    }
    splitPath(filepath) {
        const lastSlash = filepath.lastIndexOf("/");
        const lastDot = filepath.lastIndexOf(".");
        return {
            filename: lastSlash === -1 ? filepath : filepath.substr(lastSlash + 1),
            extension: lastDot === -1 ? "" : filepath.substr(lastDot + 1),
        };
    }
    checkAndCreateFolder(folderpath) {
        return __awaiter(this, void 0, void 0, function* () {
            folderpath = obsidian.normalizePath(folderpath);
            let folder = this.app.vault.getAbstractFileByPath(folderpath);
            if (folder && folder instanceof obsidian.TFolder)
                return;
            yield this.app.vault.createFolder(folderpath);
        });
    }
    runMirror() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.settings.mirroringEnabled)
                return;
            yield this.checkAndCreateFolder(this.settings.mirrorFolderPath);
            const configDir = this.app.vault.configDir;
            const run = (type) => __awaiter(this, void 0, void 0, function* () {
                yield this.checkAndCreateFolder(`${this.settings.mirrorFolderPath}/${type}`);
                //@ts-ignore
                const path = this.app.vault.adapter.getFullRealPath(`${configDir}/${type}`);
                //@ts-ignore
                this.app.vault.adapter.fs.readdir(path, "", (e, files) => {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    files.forEach((cssFile) => __awaiter(this, void 0, void 0, function* () {
                        const snippetVaultPath = `${configDir}/${type}/${cssFile}`;
                        const snippetMirrorPath = obsidian.normalizePath(`${this.settings.mirrorFolderPath}/${type}/${cssFile}`);
                        const snippetMirrorFile = this.app.vault.getAbstractFileByPath(snippetMirrorPath);
                        //@ts-ignore
                        const snippetString = yield this.app.vault.readRaw(snippetVaultPath);
                        if (!snippetMirrorFile) {
                            this.app.vault.create(snippetMirrorPath, snippetString);
                        }
                        else {
                            this.app.vault.modify(snippetMirrorFile, snippetString);
                        }
                    }));
                });
            });
            run("snippets");
            run("themes");
        });
    }
    getMirrorPath(fileName, filePath, extension) {
        if (!(this.settings.mirroringEnabled && extension === "css"))
            return [null, null];
        const snippetMirrorPath = obsidian.normalizePath(`${this.settings.mirrorFolderPath}/snippets/${fileName}`);
        const themeMirrorPath = obsidian.normalizePath(`${this.settings.mirrorFolderPath}/themes/${fileName}`);
        let type = null;
        if (snippetMirrorPath === filePath)
            type = "snippets";
        if (themeMirrorPath === filePath)
            type = "themes";
        if (type) {
            const configDir = this.app.vault.configDir;
            const vaultPath = `${configDir}/${type}/${fileName}`;
            //@ts-ignore
            const realPath = this.app.vault.adapter.getFullRealPath(`${configDir}/${type}/${fileName}`);
            return [vaultPath, realPath];
        }
        return [null, null];
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
}

module.exports = CodeViewPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy92aWV3LnRzIiwic3JjL3NldHRpbmdzLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIk1hcmtkb3duVmlldyIsIlBsdWdpblNldHRpbmdUYWIiLCJub3JtYWxpemVQYXRoIiwiU2V0dGluZyIsIlBsdWdpbiIsIlRGaWxlIiwiVEZvbGRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW9HQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FB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
