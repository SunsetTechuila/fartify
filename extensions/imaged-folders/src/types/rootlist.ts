export interface RootlistRow {
  addTime?: number;
  groupLabel: string;
  id: string;
  link: string;
  name: string;
  rowId: string;
  type: string;
}

export interface RootlistFolder extends RootlistRow {
  folders: number;
  playlists: number;
  recursiveFolders: number;
  recursivePlaylists: number;
  rows?: RootlistRow[];
  type: "folder";
}

export interface RootlistRoot extends RootlistFolder {
  addTime: undefined;
  groupLabel: "S:R";
  id: "00000000";
  isLoadingContents: boolean;
  name: "<root>";
  rowId: "";
  unfilteredLength: number;
  unrangedLength: number;
}
