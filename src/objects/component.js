import { UUID } from '../utils/index.js';

class Component
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: { value: UUID( ), writable: false },
      isComponent: { value: true, writable: false }
    } );

    this.parent = null;
  }
}

export default Component;