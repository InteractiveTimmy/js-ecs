import ECSObject from './ecs-object';

class Component extends ECSObject
{
  constructor ( )
  {
    Object.defineProperties( this, {
      struct: { value: 'Component', writable: false },
      type: { value: this.constructor.name.toLowerCase( ), writable: false },
      isComponent: { value: true, writable: false },
      entities: { value: [ ], writable: true }
    } );
  }
}

export default Component;