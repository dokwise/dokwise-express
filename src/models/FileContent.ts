import FileContentTypes from "./FileContentTypes";

type FileContent = {
    id: string;
    type: FileContentTypes;
    isComponent: boolean;
    content: string;
    createdAt: Date;
    createdBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
  
  export default FileContent;