import ECSObject from './ecs-object';

class Entity extends ECSObject
{
  constructor ( )
  {
    super( );

    Object.defineProperties( this, {
      type: { value: 'Entity', writable: false },
      isEntity: { value: true, writable: false },
      components: { value: [ ], writable: false },
      systems: { value: [ ], writable: false }
    } );

    this.parent = null;
    this.valid = false;
  }

  load ( ...items )
  {
    this.valid = false;
    if ( this.parent ) {
      this.parent.valid = false;
      this.parent.invalidEntites.push( this );
    }

    items.forEach( ( item ) => {
      if ( this[item.type] ) { return; }

      item.parent = this;
    } );
  }
}

export default Entity;