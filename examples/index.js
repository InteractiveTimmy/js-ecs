const ECS = require( '../build/ecs.module.js' );

class ComponentTemplate extends ECS.Component
{
  constructor ( x, y, z )
  {
    super( );

    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class ComponentA extends ComponentTemplate { }
class ComponentB extends ComponentTemplate { }
class ComponentC extends ComponentTemplate { }
class ComponentD extends ComponentTemplate { }
class ComponentE extends ComponentTemplate { }
class ComponentF extends ComponentTemplate { }
class ComponentG extends ComponentTemplate { }
class ComponentH extends ComponentTemplate { }
class ComponentI extends ComponentTemplate { }
class ComponentJ extends ComponentTemplate { }

function init ( )
{
  // set stats
  myStatistics.init.start = Date.now( );

  // generate entities with components
  for ( let x = 0; x < myControls.maxEntities; x++ )
  {
    myEntities.push( new ECS.Entity( ) );

    // loop through possible components
    myControls.components.forEach( component => {
      if ( Math.random( ) < myControls.componentChanceEntities )
      {
        myEntities[myEntities.length - 1].load( new component(
          Math.random( ),
          Math.random( ),
          Math.random( )
        ) );
      }
    } );
  }

  // set stats
  myStatistics.init.end = Date.now( );
  myStatistics.init.delta = myStatistics.init.end - myStatistics.init.start;
}

// controls
let myControls = {
  "maxEntities": 100000,
  "componentChanceEntities": 0.5,
  "components": [
    ComponentA,
    ComponentB,
    ComponentC,
    ComponentD,
    ComponentE,
    ComponentF,
    ComponentG,
    ComponentH,
    ComponentI,
    ComponentJ
  ]
};

// statistics
let myStatistics = {
  init: { },
  run: { }
};

// data sets
let myEntities = [ ];

init( );

console.log( 'Status', {
  stats: myStatistics,
  entities: myEntities.length,
  exampleEntity: myEntities[myEntities.length - 1]
} );