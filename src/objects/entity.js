import ECSObject from './ecs-object.js';

import Component from './component.js';

class Entity extends ECSObject
{
  constructor ( )
  {
    super( );
    this.loadable = [ Component ];
  }
}

export default Entity;