export const folderSVGPath =
  "M1 4a2 2 0 0 1 2-2h5.155a3 3 0 0 1 2.598 1.5l.866 1.5H21a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm7.155 0H3v16h18V7H10.464L9.021 4.5a1 1 0 0 0-.866-.5z";

export const rootlistAPIURL = "sp://core-playlist/v1/rootlist";

export const storageItemPrefix = "folder-image";

export const rootlistSelector = ".main-yourLibraryX-libraryRootlist";
export const rootlistChildDivSelector = ".main-yourLibraryX-libraryRootlist > div";

export const libraryViewButtonSelector = ".main-yourLibraryX-librarySortWrapper > button";

export const IdAttribute = "aria-labelledby";

export const folderIdElementSelector = `div[${IdAttribute} *= "folder:"]`;
export const folderElementSelector = `li.main-useDropTarget-folder:has(${folderIdElementSelector})`;

export const imageContainerCardSelector = ".main-cardImage-imageWrapper > div";
export const imageContainerSelector = ".x-entityImage-imageContainer";

export const imagePlaceholderClass = "x-entityImage-imagePlaceholder";
export const imagePlaceholderCardClass = "main-card-imagePlaceholder";
export const imagePlaceholderSelector = 'div[class *= "imagePlaceholder"]';

export const mainImageClass = "main-image-image";
export const imageCardClass = "main-cardImage-image";
export const imageClass = "x-entityImage-image";
export const mainImageSelector = `.${mainImageClass}`;
export const imageCardSelector = `.${imageCardClass}`;
export const imageSelector = `.${imageClass}`;

export const playlistsContainerSelector = "#spicetify-playlist-list > div > div:nth-child(2)";
export const playlistsContainerGridSelector =
  "#spicetify-playlist-list .main-gridContainer-gridContainer";

export const SVGClass = "Svg-sc-ytk21e-0";
export const SVGImageClass = "Svg-img-24-icon";
export const SVGImageCardClass = "Svg-img-textSubdued-64-icon";

export const localeRemovePhotoString = "playlist.edit-details.remove-photo";
export const localeFailNotificationString = "playlist.edit-details.error.file-upload-failed";
export const localeChoosePhotoString = "choose_photo";
