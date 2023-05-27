/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface IPerson {
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
}

export interface IPlace {
  info: string;
  content: HTMLDivElement;
  location: {
    lat: number;
    lng: number;
  };
  icon: string;
}

export interface ICarpool {
  driver: IPerson;
  riders: IPerson[];
}

export interface EmailOptions {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmail {
  directions: string;
  map: string;
  info: ICarpool | null;
}

export const ChurchPlace: IPerson = {
  name: 'RLC Church',
  address: '100 W. Lochmere Drive',
  homephone: '',
  cellphone: '',
  email: '',
  city: 'Cary',
  state: 'NC',
  zip: '27511',
  notes: '',
  _id: '1234',
  location: { lat: 35.729791155667876, lng: -78.77843266992282 },
};

/* Sort people by name */
export const SortPeople = (people: IPerson[]) => {
  const sorted = people.sort((a, b) => (a.name > b.name ? 1 : -1));
  return sorted;
};
