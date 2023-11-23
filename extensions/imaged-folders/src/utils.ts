import FolderImageData from "./types/folderImageData";
import { RootlistRow, RootlistRoot, RootlistFolder } from "./types/rootlist";
import {
  storageItemPrefix,
  rootlistAPIURL,
  IdAttribute,
  folderElementSelector,
  folderIdElementSelector,
  imageContainerSelector,
  imageContainerCardSelector,
  mainImageClass,
  imageCardClass,
  imageClass,
  playlistsContainerGridSelector,
  playlistsContainerSelector,
} from "./constants";
import {
  cleanUpFolderImageContainer,
  isPlaylistsInGridView,
  createFolderIconPlaceholder,
} from "./helpers";

export function getPlaylistsContainer(): Element | null {
  return document.querySelector(
    isPlaylistsInGridView() ? playlistsContainerGridSelector : playlistsContainerSelector,
  );
}

export function getFolderElement(id: string): HTMLLIElement | null {
  return document.querySelector(folderElementSelector.replace('folder:"', `folder:${id}"`));
}

export function getFolderImageContainer(inputElement: Element): Element | null {
  return inputElement.querySelector(
    isPlaylistsInGridView() ? imageContainerCardSelector : imageContainerSelector,
  );
}

export function getFolderIdFrom(input: Element | string): string | undefined {
  if (input instanceof Element) {
    const target = input.querySelector(folderIdElementSelector);
    if (target) {
      const match = target.getAttribute(IdAttribute)?.match(/folder:(\w+)$/);
      if (match) return match[1];
    }
    return undefined;
  }

  return Spicetify.URI.from(input)?.id;
}

export function getFolderImageDataFromElement(inputElement: Element): FolderImageData | null {
  const id = getFolderIdFrom(inputElement);
  if (id) {
    const imageBase64 = localStorage.getItem(`${storageItemPrefix}:${id}`);
    if (imageBase64) {
      const imageContainer = getFolderImageContainer(inputElement);
      if (imageContainer) {
        return { imageContainer: imageContainer as HTMLElement, imageBase64 };
      }
    }
  }
  return null;
}

export function getFolderImagesData(): FolderImageData[] {
  const foldersImageData: FolderImageData[] = [];
  const folderElements = Array.from(document.querySelectorAll(folderElementSelector));

  folderElements.forEach((folderElement) => {
    const folderImageData = getFolderImageDataFromElement(folderElement);
    if (folderImageData) foldersImageData.push(folderImageData);
  });

  return foldersImageData;
}

export function addImageToFolderElement(imageContainer: Element, imageBase64: string): void {
  const image = document.createElement("img");
  image.classList.add(
    mainImageClass,
    "main-image-loaded",
    isPlaylistsInGridView() ? imageCardClass : imageClass,
  );
  image.src = imageBase64;
  cleanUpFolderImageContainer(imageContainer);
  imageContainer.prepend(image);
}

export function addPlaceholderToFolderElement(imageContainer: Element): void {
  const placeholder = createFolderIconPlaceholder();
  cleanUpFolderImageContainer(imageContainer);
  imageContainer.prepend(placeholder);
}

export async function fetchFolderIDsAsync(): Promise<string[]> {
  const IDs: string[] = [];
  const result: RootlistRoot = await Spicetify.CosmosAsync.get(rootlistAPIURL);

  function processRowsRecursive(inputRow: RootlistRow) {
    if (inputRow.type === "folder") {
      IDs.push(inputRow.id);
      (inputRow as RootlistFolder).rows?.forEach((row) => processRowsRecursive(row));
    }
  }

  result.rows?.forEach((row) => processRowsRecursive(row));
  return IDs;
}

export async function optimizeImageAsync(inputImageBase64: string): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const maxSize = 354;
      let { width, height } = image;

      if (width > height) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > width) {
        width *= maxSize / height;
        height = maxSize;
      } else {
        width = maxSize;
        height = maxSize;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0, width, height);

      const optimizedImage = canvas.toDataURL("image/jpeg");
      canvas.remove();
      resolve(optimizedImage);
    };

    image.src = inputImageBase64;
  });
}
