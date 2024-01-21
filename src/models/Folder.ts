import DWFile from "./DWFile";

type Folder = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    createdAt: Date;
    createdBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
  
  export default Folder;