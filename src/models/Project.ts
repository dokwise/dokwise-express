import Folder from "./Folder";

type Project = {
  id: string;
  name: string;
  slug: string;
  rootFolderId: String;
  rootFolderName: String;
  rootFolderSlug: String;
  createdAt: Date;
  createdBy: string;
  lastModifiedAt: Date;
  lastModifiedBy: string;
};

export default Project;