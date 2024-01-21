// lowdb.d.ts
import { Low } from 'lowdb';
import lodash from 'lodash';
import { Data } from './models/Data';

declare module 'lowdb' {
  interface Low<T> {
    chain: lodash.ExpChain<this['data']>;
  }
}
