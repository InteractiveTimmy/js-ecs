onmessage = ( e ) => {
  const myInstance = e.data;

  console.log( 'ww received', myInstance );

  postMessage( myInstance, [ myInstance.myData.buffer ] );
}