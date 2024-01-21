import DWFile from "./DWFile";
import Folder from "./Folder";
import Project from "./Project"

type Data = {
  projects: Project[];
  folders: Folder[];
  dwFiles: DWFile[];
};

export default Data;