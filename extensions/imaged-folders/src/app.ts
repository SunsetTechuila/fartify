import {
  cleanUpStorageAsync,
  createContextMenus,
  updateFolderImages,
  trackPlaylistsChanges,
} from "./modules";
import { getPlaylistsContainer } from "./utils";

export default function main() {
  if (
    !Spicetify?.Locale ||
    !Spicetify?.URI ||
    !Spicetify?.ContextMenu ||
    !Spicetify?.CosmosAsync ||
    !getPlaylistsContainer()
  ) {
    setTimeout(main, 300);
    return;
  }

  updateFolderImages();
  trackPlaylistsChanges();
  createContextMenus();
  cleanUpStorageAsync();
}
