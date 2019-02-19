import { UUID } from '../utils/index';

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


export default ECSObject;