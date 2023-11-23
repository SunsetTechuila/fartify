import {
  storageItemPrefix,
  playlistsContainerGridSelector,
  imagePlaceholderClass,
  imagePlaceholderCardClass,
  imagePlaceholderSelector,
  mainImageSelector,
  imageCardSelector,
  imageSelector,
  folderSVGPath,
  SVGClass,
  SVGImageClass,
  SVGImageCardClass,
} from "./constants";

export function isPlaylistsInGridView(): boolean {
  return Boolean(document.querySelector(playlistsContainerGridSelector));
}

export function hasImage(id: string): boolean {
  return Boolean(localStorage.getItem(`${storageItemPrefix}:${id}`));
}

export function hasImageElement(inputElement: Element): boolean {
  return Boolean(
    inputElement.querySelector(isPlaylistsInGridView() ? imageCardSelector : imageSelector),
  );
}

export function cleanUpFolderImageContainer(container: Element): void {
  container.querySelector(mainImageSelector)?.remove();
  container.querySelector(imagePlaceholderSelector)?.remove();
}

export function createFolderIconPlaceholder(): HTMLDivElement {
  const placeholder = document.createElement("div");
  const placeholderSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const placeholderSVGPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

  const isGridView = isPlaylistsInGridView();
  const size = isGridView ? "64" : "24";
  placeholder.classList.add(isGridView ? imagePlaceholderCardClass : imagePlaceholderClass);
  placeholderSVG.classList.add(SVGClass, isGridView ? SVGImageCardClass : SVGImageClass);
  placeholderSVG.setAttribute("height", `${size}px`);
  placeholderSVG.setAttribute("width", `${size}px`);
  placeholderSVG.setAttribute("viewBox", "0 0 24 24");
  placeholderSVG.setAttribute("aria-hidden", "true");
  placeholderSVG.setAttribute("role", "img");
  placeholderSVGPath.setAttribute("d", folderSVGPath);

  placeholderSVG.appendChild(placeholderSVGPath);
  placeholder.appendChild(placeholderSVG);

  return placeholder;
}

export function createFilePicker(): [HTMLFormElement, HTMLInputElement] {
  const filePickerForm = document.createElement("form");
  filePickerForm.setAttribute("aria-hidden", "true");

  const filePickerInput = document.createElement("input");
  filePickerInput.classList.add("hidden-visually");
  filePickerInput.setAttribute("type", "file");
  filePickerInput.accept = ["image/jpeg", "image/avif", "image/png", "image/webp"].join(",");
  filePickerForm.appendChild(filePickerInput);

  return [filePickerForm, filePickerInput];
}
