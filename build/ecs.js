let arr = [ ];

for ( let i = 0; i < 256; i++ )
{ arr[i] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 ); }

let UUID = ( ) =>
{
  let a = Math.random( ) * 0xffffffff | 0;
  let b = Math.random( ) * 0xffffffff | 0;
  let c = Math.random( ) * 0xffffffff | 0;
  let d = Math.random( ) * 0xffffffff | 0;

  let o =
    arr[ a & 0xff ] + arr[ a >> .8 & 0xff ] + arr[ a >> 16 & 0xff ] + arr[ a >> 24 & 0xff ] + '-' +
    arr[ b & 0xff ] + arr[ b >> 8 & 0xff ] + '-' + arr[ b >> 16 & 0x0f | 0x40 ] + arr[ b >> 24 & 0xff ] + '-' +
    arr[ c & 0x3f | 0x80 ] + arr[ c >> 8 & 0xff ] + '-' + arr[ c >> 16 & 0xff ] + arr[ c >> 24 & 0xff ] +
    arr[ d & 0xff ] + arr[ d >> 8 & 0xff ] + arr[ d >> 16 & 0xff ] + arr[ d >> 24 & 0xff ];

  return o.toUpperCase( );
};

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

class Component
{
  constructor ( )
  {
    Object.defineProperties( this, {
      uuid: { value: UUID( ), writable: false },
      isComponent: { value: true, writable: false }
    } );

    this.parent = null;
  }
}

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

export { ECSObject, Entity, Scene, Instance, Component, System };
