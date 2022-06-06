/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
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

const DEFAULT_SETTINGS = {
    deleteOption: '.trash',
    excludedFolders: '',
    ribbonIcon: false,
    excludeSubfolders: false
};
class OzanClearImagesSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Clear Images Settings" });
        new obsidian.Setting(containerEl)
            .setName('Ribbon Icon')
            .setDesc('Turn on if you want Ribbon Icon for clearing the images.')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.ribbonIcon)
            .onChange((value) => {
            this.plugin.settings.ribbonIcon = value;
            this.plugin.saveSettings();
            this.plugin.refreshIconRibbon();
        }));
        new obsidian.Setting(containerEl)
            .setName('Deleted Image Destination')
            .setDesc('Select where you want images to be moved once they are deleted')
            .addDropdown((dropdown) => {
            dropdown.addOption('permanent', 'Delete Permanently');
            dropdown.addOption('.trash', 'Move to Obsidian Trash');
            dropdown.addOption('system-trash', 'Move to System Trash');
            dropdown.setValue(this.plugin.settings.deleteOption);
            dropdown.onChange((option) => {
                this.plugin.settings.deleteOption = option;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Excluded Folder Full Paths')
            .setDesc(`Provide the FULL path of the folder names (Case Sensitive) divided by comma (,) to be excluded from clearing. 
					i.e. For images under Personal/Files/Zodiac -> Personal/Files/Zodiac should be used for exclusion`)
            .addTextArea((text) => text
            .setValue(this.plugin.settings.excludedFolders)
            .onChange((value) => {
            this.plugin.settings.excludedFolders = value;
            this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('Exclude Subfolders')
            .setDesc('Turn on this option if you want to also exclude all subfolders of the folder paths provided above.')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.excludeSubfolders)
            .onChange((value) => {
            this.plugin.settings.excludeSubfolders = value;
            this.plugin.saveSettings();
        }));
    }
}

class ImageUtils {
}
ImageUtils.imageRegex = /.*(jpe?g|png|gif|svg|bmp)/;
ImageUtils.imageExtensions = new Set(['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp']);
// Create the List of Unused Images
ImageUtils.getUnusedImages = (app) => {
    var all_images_in_vault = ImageUtils.getAllImagesInVault(app);
    var unused_images = [];
    var used_images_set;
    // Get Used Images in All Markdown Files
    used_images_set = ImageUtils.getImagePathSetForVault(app);
    // Compare All Images vs Used Images
    all_images_in_vault.forEach(img => {
        if (!used_images_set.has(img.path))
            unused_images.push(img);
    });
    return unused_images;
};
// Getting all available images saved in vault
ImageUtils.getAllImagesInVault = (app) => {
    let allFiles = app.vault.getFiles();
    let images = [];
    for (let i = 0; i < allFiles.length; i++) {
        if (ImageUtils.imageExtensions.has(allFiles[i].extension)) {
            images.push(allFiles[i]);
        }
    }
    return images;
};
// New Method for Getting All Used Images
ImageUtils.getImagePathSetForVault = (app) => {
    var images_set = new Set();
    var resolvedLinks = app.metadataCache.resolvedLinks;
    if (resolvedLinks) {
        for (const [md_file, links] of Object.entries(resolvedLinks)) {
            for (const [file_path, nr] of Object.entries(resolvedLinks[md_file])) {
                var image_match = file_path.match(ImageUtils.imageRegex);
                if (image_match)
                    images_set.add(image_match[0]);
            }
        }
    }
    return images_set;
};
class DeleteUtils {
}
// Clear Images From the Provided List
DeleteUtils.deleteFilesInTheList = (fileList, plugin, app) => __awaiter(void 0, void 0, void 0, function* () {
    var deleteOption = plugin.settings.deleteOption;
    var deletedImages = 0;
    for (let file of fileList) {
        if (DeleteUtils.file_is_in_excluded_folder(file, plugin)) {
            console.log('File not referenced but excluded: ' + file.path);
        }
        else {
            if (deleteOption === '.trash') {
                yield app.vault.trash(file, false);
                console.log('Moved to Obsidian Trash: ' + file.path);
            }
            else if (deleteOption === 'system-trash') {
                yield app.vault.trash(file, true);
                console.log('Moved to System Trash: ' + file.path);
            }
            else if (deleteOption === 'permanent') {
                yield app.vault.delete(file);
                console.log('Deleted: ' + file.path);
            }
            deletedImages++;
        }
    }
    return deletedImages;
});
// Check if File is Under Excluded Folders
DeleteUtils.file_is_in_excluded_folder = (file, plugin) => {
    var excludedFoldersSettings = plugin.settings.excludedFolders;
    var excludeSubfolders = plugin.settings.excludeSubfolders;
    if (excludedFoldersSettings === '') {
        return false;
    }
    else {
        // Get All Excluded Folder Paths
        var excludedFolderPaths = new Set(excludedFoldersSettings.split(",").map(folderPath => {
            return folderPath.trim();
        }));
        if (excludeSubfolders) {
            // If subfolders included, check if any provided path partially match
            for (let exludedFolderPath of excludedFolderPaths) {
                var pathRegex = new RegExp(exludedFolderPath + '.*');
                if (file.parent.path.match(pathRegex)) {
                    return true;
                }
            }
        }
        else {
            // Full path of parent should match if subfolders are not included
            if (excludedFolderPaths.has(file.parent.path)) {
                return true;
            }
        }
        return false;
    }
};

class OzanClearImages extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.ribbonIconEl = undefined;
        this.refreshIconRibbon = () => {
            var _a;
            (_a = this.ribbonIconEl) === null || _a === void 0 ? void 0 : _a.remove();
            if (this.settings.ribbonIcon) {
                this.ribbonIconEl = this.addRibbonIcon('image-file', 'Clear Unused Images', (event) => {
                    this.clearUnusedImages();
                });
            }
        };
        // Compare Used Images with all images and return unused ones
        this.clearUnusedImages = () => __awaiter(this, void 0, void 0, function* () {
            var unused_images = ImageUtils.getUnusedImages(this.app);
            var len = unused_images.length;
            if (len > 0) {
                console.log('[+] Clearing started.');
                DeleteUtils.deleteFilesInTheList(unused_images, this, this.app).then((nr) => {
                    new obsidian.Notice(nr + ' image(s) in total deleted.');
                    console.log('[+] Clearing completed.');
                });
            }
            else {
                new obsidian.Notice('All images are used. Nothing was deleted.');
            }
        });
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Loading oz-clear-unused-images plugin");
            this.addSettingTab(new OzanClearImagesSettingsTab(this.app, this));
            yield this.loadSettings();
            this.addCommand({
                id: 'clear-images-obsidian',
                name: 'Clear Unused Images in Vault',
                callback: () => this.clearUnusedImages()
            });
            this.refreshIconRibbon();
        });
    }
    onunload() {
        console.log('Unloading oz-clear-unused-images plugin');
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = OzanClearImages;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy91dGlscy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiIsIk5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1B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
