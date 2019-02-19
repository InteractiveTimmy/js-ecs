let ECS;

try
{
  ECS = window.ECS;
  console.log( 'browser instance detected' );
}
catch
{
  ECS = require( '../build/ecs.js' );
  console.log( 'node instance detected' );
}

console.log( new ECS.ECSObject( ) );