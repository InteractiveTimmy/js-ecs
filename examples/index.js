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


// mathmatical systems
class SystemA extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentA,
      ComponentB,
      ComponentC
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      entity.components[ComponentA.name].x += entity.components[ComponentB.name].x * dt;
      entity.components[ComponentA.name].y += entity.components[ComponentC.name].y * dt;
      entity.components[ComponentA.name].z += entity.components[ComponentB.name].z * dt;
    } );
  }
}

class SystemB extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentD,
      ComponentE,
      ComponentF
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      entity.components[ComponentD.name].x += entity.components[ComponentE.name].x * dt;
      entity.components[ComponentD.name].y += entity.components[ComponentF.name].y * dt;
      entity.components[ComponentD.name].z += entity.components[ComponentE.name].z * dt;
    } );
  }
}

class SystemC extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentG,
      ComponentH,
      ComponentI
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      entity.components[ComponentG.name].x += entity.components[ComponentH.name].x * dt;
      entity.components[ComponentG.name].y += entity.components[ComponentI.name].y * dt;
      entity.components[ComponentG.name].z += entity.components[ComponentH.name].z * dt;
    } );
  }
}

// conditional system assigning
class SystemD extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentA,
      ComponentD,
      ComponentG
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      if ( entity.components[ComponentA.name].x > 10 ) { entity.components[ComponentA.name].x = 0; }
      if ( entity.components[ComponentD.name].y > 10 ) { entity.components[ComponentD.name].y = 0; }
      if ( entity.components[ComponentG.name].z > 10 ) { entity.components[ComponentG.name].z = 0; }
    } );
  }
}

// conditional system mathmatical
class SystemE extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentB,
      ComponentE,
      ComponentH
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      if ( entity.components[ComponentB.name].x > 10 ) { entity.components[ComponentB.name].x /= 2; }
      if ( entity.components[ComponentE.name].y > 10 ) { entity.components[ComponentE.name].y /= 2; }
      if ( entity.components[ComponentH.name].z > 10 ) { entity.components[ComponentH.name].z /= 2; }
    } );
  }
}

// large operation mixed
class SystemF extends ECS.System
{
  constructor ( )
  {
    super( );

    this.components = [
      ComponentC,
      ComponentF,
      ComponentI,
      ComponentJ
    ];
  }

  onUpdate ( entities, dt )
  {
    entities.forEach( entity => {
      entity.components[ComponentJ.name].x = entity.components[ComponentC.name].x * entity.components[ComponentF.name].x / entity.components[ComponentI.name].x;
      entity.components[ComponentJ.name].y = entity.components[ComponentC.name].y * entity.components[ComponentF.name].y / entity.components[ComponentI.name].y;
      entity.components[ComponentJ.name].z = entity.components[ComponentC.name].z * entity.components[ComponentF.name].z / entity.components[ComponentI.name].z;

      if ( entity.components[ComponentJ.name].x < 1 && entity.components[ComponentJ.name].x > 0 )
      { entity.components[ComponentJ.name].x = 0.5; }
      if ( entity.components[ComponentJ.name].y < 1 && entity.components[ComponentJ.name].y > 0 )
      { entity.components[ComponentJ.name].y = 0.5; }
      if ( entity.components[ComponentJ.name].z < 1 && entity.components[ComponentJ.name].z > 0 )
      { entity.components[ComponentJ.name].z = 0.5; }
    } );
  }
}

function init ( controls )
{
  // set stats
  myStatistics.init.start = Date.now( );

  // generate objects
  myInstance = new ECS.Instance( );
  myScene = new ECS.Scene( );

  // load systems into instance
  myInstance.load( ...controls.systems );

  // generate entities with components
  for ( let x = 0; x < controls.maxEntities; x++ )
  {
    myScene.load( new ECS.Entity( ) );

    // loop through possible components
    controls.components.forEach( component => {
      if ( Math.random( ) < controls.componentChanceEntities )
      {
        myScene.children[myScene.children.length - 1].load( new component(
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

function run ( controls )
{ return new Promise( ( resolve, reject ) => {
   
  // set stats
  myStatistics.run.start = Date.now( );
  myStatistics.run.ticks = 0;

  myInstance.update( myScene, 100 );

  let myLoop = ( dt ) => {
    // set stats
    myStatistics.run.dt = Date.now( );
    myStatistics.run.ticks++;

    // update the scene
    myInstance.update( myScene, dt );

    // loop conditional
    if ( Date.now( ) - myStatistics.run.start < controls.duration )
    { setTimeout( ( ) => { myLoop( Date.now( ) - myStatistics.run.dt ); }, 0 ); }
    else
    {
      myStatistics.run.frameTime = controls.duration / myStatistics.run.ticks;
      myStatistics.run.tps = 1000 / myStatistics.run.frameTime;
      resolve( controls );
    }
  };

  myLoop( 0 );

} ) }

// controls

let myControls = [
  {
    name: 'light',
    maxEntities: 1000,
    componentChanceEntities: 0.5,
    duration: 10000,
    components: [
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
    ],
    systems: [
      new SystemA( ),
      new SystemB( ),
      new SystemC( ),
      new SystemD( ),
      new SystemE( ),
      new SystemF( )
    ]
  },
  {
    name: 'medium',
    maxEntities: 2000,
    componentChanceEntities: 0.5,
    duration: 10000,
    components: [
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
    ],
    systems: [
      new SystemA( ),
      new SystemB( ),
      new SystemC( ),
      new SystemD( ),
      new SystemE( ),
      new SystemF( )
    ]
  },
  {
    name: 'heavy',
    maxEntities: 4000,
    componentChanceEntities: 0.5,
    duration: 10000,
    components: [
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
    ],
    systems: [
      new SystemA( ),
      new SystemB( ),
      new SystemC( ),
      new SystemD( ),
      new SystemE( ),
      new SystemF( )
    ]
  },
  {
    name: 'extra heavy',
    maxEntities: 8000,
    componentChanceEntities: 0.5,
    duration: 10000,
    components: [
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
    ],
    systems: [
      new SystemA( ),
      new SystemB( ),
      new SystemC( ),
      new SystemD( ),
      new SystemE( ),
      new SystemF( )
    ]
  }
];

// statistics
let myStatistics = {
  init: { },
  run: { }
};

// data sets
let myInstance;
let myScene;

function trial ( index = 0 )
{
  console.log( `starting example "${myControls[index].name}"`)
  init( myControls[index] );
  run( myControls[index] ).then( ( r ) => {
    console.log( `completed example "${myControls[index].name}"  \n` );
    console.log( `initialization time: ${myStatistics.init.delta / 1000}s` );
    console.log( `frame delta time: ${myStatistics.run.frameTime}ms` );
    console.log( `total ticks: ${myStatistics.run.ticks}` );
    console.log( `ticks per second: ${myStatistics.run.tps}` );
    console.log( `total entities: ${myScene.children.length}` );
    console.log( `total component types: ${r.components.length} `);
    console.log( '  \n' );
    console.log( 'system report' );
    r.systems.forEach( system => {
      console.log( `${system.constructor.name} ${myScene.getEntitiesByComponents( ...myInstance.systems[system.constructor.name].components ).length} entitites` );
    } );
    console.log( '  \n' );

    if ( index + 1 < myControls.length )
    { setTimeout( ( ) => { trial( index + 1 ); }, 100 ); }
    else
    { console.log( 'process finished' ); }
  } ).catch( ( e ) => { console.log( e ); } );
}

// start
trial( );