(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ECS = {})));
}(this, (function (exports) { 'use strict';

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

	exports.ECSObject = ECSObject;
	exports.Entity = Entity;
	exports.Component = Component;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
