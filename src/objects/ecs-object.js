import { UUID } from '../utils/index.js';

class ECSObject
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: { value: UUID( ), writable: false },
      isECSObject: { value: true, writable: false }
    } );

    this.parent = null;
    this.children = [ ];
  }

  canLoad ( ...items )
  { return items.every( item => ( !this.children.includes( item ) ) ); }

  canUnload ( ...items )
  { return items.every( item => ( this.children.includes( item ) ) ); }

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
}

export default ECSObject;