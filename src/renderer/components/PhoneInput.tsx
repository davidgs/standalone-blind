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
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

export default function PhoneInput({
  phone,
  type,
  callback,
}: {
  phone: string;
  type: string;
  // eslint-disable-next-line no-shadow, no-unused-vars
  callback: (type: string, phone: string) => void;
}): React.JSX.Element {
  const [phoneValid, setPhoneValid] = useState<boolean>(true);

  /* eslint-disable no-useless-escape */
  /* regex to format a phone number */
  const finalPhoneRegex = /(\(\d{3}\)) (\d{3})-(\d{4})/;

  /*
   * formatPhoneNumber
   * @param e - SyntheticEvent
   * @returns formatted phone number
   */
  const formatPhoneNumber = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value as string;
    const cleaned = value.replace(/[^\d]/g, '');
    let formatted = '';

    if (cleaned.length <= 3) {
      formatted = cleaned;
    } else if (cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6)}`;
    }
    const fv = finalPhoneRegex.test(formatted);
    if (fv) {
      target.className = 'form-control valid';
    } else {
      target.className = 'form-control invalid';
    }
    setPhoneValid(fv);
    return formatted;
  };

  const [myPhone, setMyPhone] = useState<string>('');

  useEffect(() => {
    setMyPhone(phone);
  }, [phone]);

  return (
    <>
      <Form.Control
        type="text"
        placeholder={`${type} Phone (xxx) xxx-xxxx`}
        name={`${type} Phone`}
        onChange={(e) => {
          setMyPhone(formatPhoneNumber(e));
          callback(type, formatPhoneNumber(e));
        }}
        onBlur={(e) => {
          setMyPhone(formatPhoneNumber(e));
          callback(type, formatPhoneNumber(e));
        }}
        value={myPhone}
      />
      {!phoneValid ? (
        <small id={`${type} phone`} className="form-text">
          Enter a valid 9-digit phone number.
        </small>
      ) : null}
    </>
  );
}
