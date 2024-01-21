import FileContent from "./FileContent";
import FileType from "./FileTypes";
import Reference from "./Reference";

type DWFile = {
    id: string;
    name: string;
    slug: string;
    type: FileType;
    parentFolderId: string | null;
    references: Reference[] | null;
    contents: FileContent[] | null;
    createdAt: Date;
    createdBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
  
  export default DWFile;