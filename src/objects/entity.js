import ECSObject from './ecs-object.js';

class Entity extends ECSObject
{
  constructor ( )
  {
    super( );

    Object.defineProperty( this, 'isEntity', { value: true, writable: false } );

    this.components = { };
  }

  canLoad ( ...items )
  { return ( super.canLoad( ...items ) && items.every( item => ( item.isComponent && !this.components[item.constructor.name] ) ) ); }

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
        this.components[item.constructor.name] = item;
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
        delete this.components[item.constructor.name];
      } );
    }
    else
    { console.warn( 'ERROR', 'unable to unload items' ); }

    return this;
  }
}


export default Entity;