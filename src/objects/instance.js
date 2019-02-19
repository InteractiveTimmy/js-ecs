import ECSObject from './ecs-object';

class Instance extends ECSObject
{
  constructor ( )
  {
    super( );

    Object.defineProperties( this, {
      type: { value: 'Instance', writable: false },
      isInstance: { value: true, writable: false },
      webworkers: { value: [ ], writable: false },
      systems: { value: [ ], writable: false },
      entities: { value: [ ], writable: false },
      components: { value: [ ], writable: false },
      stats: { value: { }, writable: false }
    } );
  }

  load ( ...items )
  {
    items.forEach( item => {
      switch ( item.type )
      {
        case 'System':
          this.loadSystems( item );
          break;

        case 'Entity':
          this.loadEntities( item );
          break;
        
        case 'Component':
          this.loadComponents( item );
          break;

        default:
          break;
      }
    } );

    return this;
  }

  loadComponents ( entity, ...components )
  {

  }

  loadSystems ( ...systems )
  {
    systems.forEach( system => {
      if ( system.type !== system ) { break; }

      this.entities.forEach( entity => {

        entity.components.forEach( component => {

        } );
      } );
    } );
  }
}

export default Instance;