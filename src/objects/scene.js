import ECSObject from './ecs-object.js';

class Scene extends ECSObject
{
  constructor ( )
  {
    super( );

    Object.defineProperty( this, 'isScene', { value: true, writable: false } );
  }

  canLoad ( ...items )
  { return ( super.canLoad( ...items ) && items.every( item => ( item.isEntity ) ) ); }

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
      } );
    }
    else
    { console.warn( 'ERROR', 'unable to unload items' ); }

    return this;
  }

  getEntitiesByComponents ( ...components )
  {
    return this.children.filter( entity => ( 
      components.every( component => (
        ( entity.components[component.name] ) ?
        ( entity.components[component.name].constructor === component ) :
        false
      ) )
    ) );
  }
}

export default Scene;