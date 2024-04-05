export interface Boletos {
  idboleto: number;
  precio: number;
  descuento: number;
  preciototal: number;
  fecharegistro: Date;
  asiento: Asiento;
  vuelo: Vuelo;
  cliente: Cliente;
}

export interface Asiento {
  idasiento: number;
  posicion: number;
  disponibilidad: boolean;
  fecharegistro: Date;
  avion: Avion;
  categoria: Categoria;
}

export interface Avion {
  idavion: string;
  nombre: string;
  modelo: string;
  fabricante: string;
  velocidadpromedio: number;
  cantidadpasajeros: number;
  cantidadcarga: number;
  fecharegistro: Date;
  aereolinea: Aereolinea;
}

export interface Aereolinea {
  idaereolinea: number;
  nombre: string;
  codigoiata: string;
  codigoicao: string;
  fecharegistro: Date;
}

export interface Categoria {
  idcategoria: number;
  nombre: string;
  descripcion: string;
  estadocategoria: boolean;
  tarifa: number;
  fecharegistro: Date;
  comercial: boolean;
}

export interface Cliente {
  numerodocumento: string;
  tipodocumento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;
  fecharegistro: Date;
}

export interface Vuelo {
  idvuelo: number;
  preciovuelo: number;
  tarifatemporada: number;
  descuento: number;
  distanciarecorrida: number;
  fechayhorallegada: Date;
  cupo: boolean;
  fecharegistro: Date;
  fechayhoradesalida: Date;
  avion: Avion;
  aeropuerto_Despegue: AeropuertoDES;
  aeropuerto_Destino: AeropuertoDES;
  estado: Estado;
}

export interface AeropuertoDES {
  idaereopuerto: number;
  nombre: string;
  fecharegistro: Date;
  ciudad: Ciudad;
  coordenadas: Coordenadas;
}

export interface Ciudad {
  idciudad: number;
  nombre: string;
  fecharegistro: Date;
  imagen: string;
  region: Region;
}

export interface Region {
  idregion: number;
  nombre: string;
  fecharegistro: Date;
  pais: Pais;
}

export interface Pais {
  idpais: number;
  nombre: string;
  fecharegistro: Date;
}

export interface Coordenadas {
  idcoordenada: number;
  latitud: number;
  longitud: number;
  fecharegistro: Date;
}

export interface Estado {
  idestado: number;
  nombre: string;
  descripcion: string;
  fecharegistro: Date;
  detencion: boolean;
}
