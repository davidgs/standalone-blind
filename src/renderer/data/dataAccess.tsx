import {useEffect, useState} from "react";
import axios from "axios";
import { IDriver, IRider } from "renderer/types";

export function GetAll(type: string, callback: (value: IDriver[] | IRider[] | null) => void) {
  console.log("GetAll");
  const [people, setPeople] = useState<IDriver[] | IRider[] | null>(null);
    axios
      .get(`https://davidgs.com:3001/api/${type}`)
      .then((res) => {
        const data = res.data as IDriver[] | IRider[];
        callback(data);
      })
      .catch((err) => {
        console.log(err);
        callback(null);
      });
};

export async function AddPerson(person: IDriver | IRider, type: string): Promise<boolean> {
  console.log("AddPerson");
  try {
    const res = await axios
      .post(`https://davidgs.com:3001/api/${type}`, JSON.stringify(person));
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function UpdatePerson(person: IDriver | IRider, type: string, callback: (value: boolean) => void) {
  console.log("UpdatePerson");
  axios
    .post(`https://davidgs.com:3001/api/update/${type}/${person._id}`, person)
    .then((res) => {
      callback(true);
    })
    .catch((err) => {
      console.log(err);
      callback(false);
    });
}

export function DeletePerson(person: IDriver | IRider, type: string, callback: (value: boolean) => void) {
  console.log("DeletePerson");
  axios
    .post(`https://davidgs.com:3001/api/delete/${type}/${person._id}`)
    .then((res) => {
      callback(true);
    })
    .catch((err) => {
      console.log(err);
      callback(false);
    });
}
