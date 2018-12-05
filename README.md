# js-ecs

# Description

JS-ECS is a javascript Entity Component System designed around relational references. This project was influenced by a number of previous ECS projects that were too far out of scope, and poorly planned. After some work, it was decided that the best way to approach making a larger, more complete project was to seperate this into it's own repository.

## Installation

Since JS-ECS is prebuilt, you can simply download [/build/ecs.js](https://github.com/InteractiveTimmy/js-ecs/blob/development/build/ecs.js) and import it via CommonJS or ES6 syntax. Alternatively, if you would like to rebuild the bundled files, you will need to install the dev-dependencies via npm using the command `npm install`.

## Building

To build the project, simply run the following command: `npm run build`. This will build a **ecs.js** *UMD* file as well as a **ecs.module.js** *ES6* file.

If you would like to actively modify and rebuild on `/src/**` change, run the following command: `npm run watch`. This will build the same two files mentioned above.

## Usage

### Examples

JS-ECS examples can be initialized in two ways. Either run the command `npm start` from the root directory. This will run the application in NodeJS. If you wish to run the example via a browser, simply load the [/examples/index.html](https://github.com/InteractiveTimmy/js-ecs/blob/development/examples/index.html) file into your favorite browser. The example output will be displayed in the developer's console.

### API

JS-ECS has the following constructors:
 * ECSObject - This is the base JS-ECS Object
 * * `.Load( ...items ) {this}` - Used to append children
 * * `.unload( ...items ) {this}` - Used to unappend children
 * * `.canLoad( ...items ) {bool}` - Used to confirm an item can be loaded
 * * `.canUnload( ...items ) {bool}` - Used to confirm an item can be unloaded
 * Entity - Entities contain instances of Components
 * * **Extends ECSObject**
 * * `.entities {object}` - Contains a keyed list of entities based on their constructor name.
 * Component - Components store data to be manipulated by Systems
 * * **Contains no methods**
 * System - Systems manipulate the data of Entity Components
 * * `.update( entities {array}, dt {float} ) {null}` - Called by an Instance. Should not be changed
 * * `.onUpdate( entities {array}, dt {float} ) {null}` - Called after `.update( )`. This is where system functionality should be placed.
 * Instance - Manages Systems, giving them a list of entities to handle on update
 * * **Extends ECSObject**
 * * `.update( scene {Scene}, dt ) {null}` - Filters the entities of a scene and distributes them to the appropriate systems for operation.
 * Scene - Contains a collection of Entities, is passed into an `Instance.update( )` method
 * * **Extends ECSObject**
 * * `.getEntitiesByComponents( ...Components ) {array}` - Used by Instances to get a list of entities based on a collection of components.