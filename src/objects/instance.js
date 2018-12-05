import ECSObject from './ecs-object.js';

class Instance extends ECSObject
{
  constructor ( )
  {
    super( );

    Object.defineProperty( this, 'isInstance', { value: true, writable: false } );

    this.systems = { };
  }

  canLoad ( ...items )
  { return ( super.canLoad( ...items ) && items.every( item => ( item.isSystem && !this.systems[item.constructor.name] ) ) ); }

  canUnload ( ...items )
  { return ( super.canUnload( ...items ) ); }

  load ( ...items )
  {
    if ( this.canLoad( ...items ) )
    {
      items.forEach( item => {
        if ( item.parent )
        { item.parent.unload( item ); }

        item.parent = this;
        this.children.push( item );
        this.systems[item.constructor.name] = item;
      } );
    }
    else
    { console.warn( 'ERROR', 'unable to load items' ); }

    return this;
  }

  unload ( ...items )
  {
    if ( this.canUnload( ...items ) )
    {
      items.forEach( item => {
        item.parent = null;
        this.children.splice( this.children.indexOf( item ), 1 );
        delete this.systems[item.constructor.name];
      } );
    }
    else
    { console.warn( 'ERROR', 'unable to unload items' ); }

    return this;
  }

  update ( scene, dt )
  {
    this.children.forEach( system => {
      system.update( scene.getEntitiesByComponents( ...system.components ), dt );
    } );
  }
}

export default Instance;