let arr = [ 0, 1, 2, 3, 4, 5 ];

arr.forEach( item => {
  if ( item < 2 ) { return; }
  console.log( 'did not break', item );
} )