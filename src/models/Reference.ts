import ReferenceTypes from "./ReferenceTypes";

type Reference = {
    id: string;
    type: ReferenceTypes;
    link: string | null;
    innerText: string | null;
    createdAt: Date;
    createdBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
  
  export default Reference;