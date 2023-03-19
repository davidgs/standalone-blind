export interface IDriver {
  address: string;
  cellphone: string;
  city: string;
  email: string;
  homephone: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  notes: string;
  state: string;
  zip: string;
  _id: string;
  riders: IRider[];
}

export interface IRider {
  address: string;
  cellphone: string;
  city: string;
  email: string;
  homephone: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  notes: string;
  state: string;
  zip: string;
  _id: string;
  driver: IDriver;
}

export interface Iplace {
  info: string;
  content: HTMLDivElement;
  location: {
    lat: number;
    lng: number;
  };
  icon: string;
}

export interface IDriver {
  address: string;
  cellphone: string;
  city: string;
  email: string;
  homephone: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  notes: string;
  state: string;
  zip: string;
  _id: string;
}
