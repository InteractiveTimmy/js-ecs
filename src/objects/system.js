import ECSObject from './ecs-object';

import Entity from './entity';

class System extends ECSObject
{
  constructor ( )
  {
    Object.defineProperties( this, {
      type: { value: 'System', writable: false },
      isSystem: { value: true, writable: false },
      components: { value: [ ], writable: false },
      entities: { value: [ ], writable: false }
    } );
  }

  load ( ...items )
  {
    
  }
}

export default System;