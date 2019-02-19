(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ECS = {})));
}(this, (function (exports) { 'use strict';

	const arr = [ ];

	for ( let i = 0; i < 256; i++ )
	{ arr[i] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 ); }

	var UUID = ( ) =>
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
	    const uuid = UUID( );

	    Object.defineProperties( this, {
	      uuid: { value: uuid, writable: false },
	      id: { value: new TextEncoder( 'utf-8' ).encode( uuid ), writable: false }
	    } );

	    this.parent = null;
	  }
	}

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

	function canLoad ( parent, child )
	{
	  return (
	    !parent.children.includes( child ) && 
	    parent.loadable.includes( child.constructor )
	  );
	}

	function canUnload ( parent, child )
	{
	  return parent.includes( child );
	}

	function load ( parent, ...children )
	{
	  children.forEach( ( child ) => {
	    if ( canLoad( parent, child ) )
	    {
	      if ( child.parent )
	      { unload( child.parent, child ); }
	      
	      child.parent = parent;
	      parent.children.push( child );
	    }
	    else
	    { console.log( 'failed to load', { parent: parent, child: child } ); }
	  } );

	  return parent;
	}

	function unload ( parent, ...children )
	{
	  children.forEach( ( child ) => {
	    if ( canUnload( parent, child ) )
	    {
	      child.parent = null;
	      parent.children.splice( parent.children.indexOf( child ), 1 );
	    }
	    else
	    { console.log( 'failed to unload', { parent: parent, child: child } ); }
	  } );

	  return parent;
	}

	exports.ECSObject = ECSObject;
	exports.Entity = Entity;
	exports.Component = Component;
	exports.load = load;
	exports.unload = unload;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
