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

export { load, unload };