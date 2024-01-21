import { JSONFilePreset } from 'lowdb/node';
import lodash from 'lodash';
import DWFile from '../models/DWFile';
import Data from '../models/Data';

const defaultData: Data = { projects: [], folders: [], dwFiles: [] };
const db = await JSONFilePreset<Data>('db.json', defaultData);

// Extend db with Lodash chaining
db.chain = lodash.chain(db.data);

export default db;
