import { hasImage, createFilePicker, hasImageElement } from "./helpers";
import {
  storageItemPrefix,
  rootlistSelector,
  rootlistChildDivSelector,
  libraryViewButtonSelector,
  localeChoosePhotoString,
  localeFailNotificationString,
  localeRemovePhotoString,
} from "./constants";
import {
  fetchFolderIDsAsync,
  addImageToFolderElement,
  getFolderElement,
  getFolderImagesData,
  getFolderImageContainer,
  addPlaceholderToFolderElement,
  getFolderIdFrom,
  getPlaylistsContainer,
  optimizeImageAsync,
} from "./utils";

function setFolderImage(id: string, imageBase64: string): void {
  localStorage.setItem(`${storageItemPrefix}:${id}`, imageBase64);
  const folderElement = getFolderElement(id);
  if (folderElement) {
    const imageContainer = getFolderImageContainer(folderElement);
    if (imageContainer) addImageToFolderElement(imageContainer, imageBase64);
  }
}

function removeFolderImage(id: string): void {
  localStorage.removeItem(`${storageItemPrefix}:${id}`);
  const folderElement = getFolderElement(id);
  if (folderElement) {
    const imageContainer = getFolderImageContainer(folderElement);
    if (imageContainer) addPlaceholderToFolderElement(imageContainer);
  }
}

export async function cleanUpStorageAsync(): Promise<void> {
  const IDs = await fetchFolderIDsAsync();
  for (let i = 0, max = localStorage.length; i < max; i += 1) {
    const key = localStorage.key(i) as string;
    const regex = new RegExp(`${storageItemPrefix}:(\\w+)$`);
    const match = key.match(regex);
    if (match) {
      const id = match[1];
      const index = IDs.indexOf(id);
      if (index === -1) localStorage.removeItem(key);
    }
  }
}

export function updateFolderImages(): void {
  const foldersImageData = getFolderImagesData();
  foldersImageData.forEach((folderImageData) => {
    if (!hasImageElement(folderImageData.imageContainer))
      addImageToFolderElement(folderImageData.imageContainer, folderImageData.imageBase64);
  });
}

export function createContextMenus(): void {
  const { ContextMenu, Locale } = Spicetify;
  const { isFolder } = Spicetify.URI;
  const removePhotoText = Locale.get(localeRemovePhotoString);
  const failNotificationText = Locale.get(localeFailNotificationString);
  const choosePhotoText = Locale.get(localeChoosePhotoString);

  const [filePickerForm, filePickerInput] = createFilePicker();
  filePickerInput.onchange = () => {
    if (!filePickerInput.files?.length) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { id } = filePickerInput;
        let imageBase64 = event.target?.result as string;
        const sizeKB = (`${storageItemPrefix}:${id}${imageBase64}`.length * 2) / 1000;
        if (sizeKB > 150) imageBase64 = await optimizeImageAsync(imageBase64);
        setFolderImage(id, imageBase64);
      } catch (error) {
        Spicetify.showNotification(`${failNotificationText}\n${String(error)}`, true);
      }
    };
    reader.readAsDataURL(filePickerInput.files[0]);
  };

  new ContextMenu.Item(
    removePhotoText,
    ([uri]) => {
      const id = getFolderIdFrom(uri);
      if (id) removeFolderImage(id);
    },
    ([uri]) => isFolder(uri) && hasImage(getFolderIdFrom(uri) as string),
    "x",
  ).register();

  new ContextMenu.Item(
    choosePhotoText,
    ([uri]) => {
      const id = getFolderIdFrom(uri);
      if (id) {
        filePickerInput.id = id;
        filePickerForm.reset();
        filePickerInput.click();
      }
    },
    ([uri]) => isFolder(uri),
    "edit",
  ).register();
}

export function trackPlaylistsChanges(): void {
  let playlistsContainer = getPlaylistsContainer();
  const playlistsContainerObserver = new MutationObserver(updateFolderImages);
  const playlistsContainerObserverConfig = { childList: true };
  playlistsContainerObserver.observe(playlistsContainer as Node, playlistsContainerObserverConfig);

  function reconnectPlaylistsContainer(afterConnect: () => void): void {
    playlistsContainer = getPlaylistsContainer();
    if (!playlistsContainer) {
      setTimeout(reconnectPlaylistsContainer, 300);
      return;
    }

    afterConnect();

    playlistsContainerObserver.observe(
      playlistsContainer as Node,
      playlistsContainerObserverConfig,
    );
  }

  function onRootlistChildDivMutation(): void {
    if (!playlistsContainer?.isConnected) {
      reconnectPlaylistsContainer(updateFolderImages);
    }
  }
  const rootlistChildDiv = document.querySelector(rootlistChildDivSelector);
  const rootlistChildDivObserver = new MutationObserver(onRootlistChildDivMutation);
  rootlistChildDivObserver.observe(rootlistChildDiv as Node, { childList: true });

  let libraryViewButton: Element | null;
  const libraryViewButtonObserverConfig = { attributes: true, attributeFilter: ["aria-label"] };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const libraryViewButtonObserver = new MutationObserver(onRootlistMutation);
  function observeLibraryViewButton(): void {
    setTimeout(() => {
      libraryViewButton = document.querySelector(libraryViewButtonSelector);
      if (libraryViewButton instanceof HTMLButtonElement) {
        libraryViewButtonObserver.observe(libraryViewButton, libraryViewButtonObserverConfig);
      }
    }, 300);
  }
  observeLibraryViewButton();

  function onRootlistMutation(): void {
    reconnectPlaylistsContainer(() => {
      updateFolderImages();

      if (!libraryViewButton?.isConnected) {
        observeLibraryViewButton();
      }
    });
  }
  const rootlist = document.querySelector(rootlistSelector);
  const rootlistObserver = new MutationObserver(onRootlistMutation);
  rootlistObserver.observe(rootlist as Node, { attributes: true, attributeFilter: ["class"] });
}
