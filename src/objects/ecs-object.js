import { UUID } from '../utils/index.js';

class ECSObject
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: { value: UUID( ), writable: false },
      isECSObject: { value: true, writable: false }
    } );

    this.parent = null;
    this.children = [ ];
    this.loadable = [ ];
  }
}


export default ECSObject;