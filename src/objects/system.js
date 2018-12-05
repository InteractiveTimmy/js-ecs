import { UUID } from '../utils/index.js';

class System
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: { value: UUID( ), writable: false },
      isSystem: { value: true, writable: false }
    } );

    this.parent = null;
    this.components = [ ];
  }

  update ( entities, dt )
  {
    this.onUpdate( entities, dt );
  }

  onUpdate ( entities, dt )
  {

  }
}

export default System;