import { SyntheticEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';


export default function PhoneInput(
  { phone,
    type,
    callback
  }: {
      phone: string;
      type: string;
      callback: (type: string, phone: string) => void;
    }
): JSX.Element {

  const [phoneValid, setPhoneValid] = useState<boolean>(true);

  const finalPhoneRegex = /(\(\d{3}\)) (\d{3})-(\d{4})/;

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
    console.log(`Formatted phone: ${formatted}`);
    console.log(`Target: ${target}`);
    console.log(`Target class: ${target.getAttribute('class')}`);
    const fv = finalPhoneRegex.test(formatted);
      fv
        ? (target.className = 'form-control valid')
        : (target.className = 'form-control invalid');
      setPhoneValid(fv);
    return formatted;


    //   return formatted.trim();
    // }
    // return value;
  };

  const formatPhone = (e: SyntheticEvent ) => {
    const target = e.target as HTMLInputElement;
    const value = target.value as string;
    const phoneRegex = /(\d{3})(\d{3})(\d{4})/;
    if (value) {
      const r = value.replace(/\D/g, "");
      const formattedPhone: string = r.replace(phoneRegex, '($1) $2-$3');
      console.log(`Formatted phone: ${formattedPhone}`);
      console.log(`Target: ${target}`);
      console.log(`Target class: ${target.getAttribute('class')}`);
      const fv = finalPhoneRegex.test(formattedPhone);
      fv ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
      setPhoneValid(fv);
      return formattedPhone;
    }
    setPhoneValid(false);
    return '';
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
          console.log(`Phone changed: ${e.target.value}`);
          setMyPhone(formatPhoneNumber(e));
          callback(type, formatPhoneNumber(e));
        }}
        onBlur={(e) => {
          setMyPhone(formatPhoneNumber(e));
          callback(type, formatPhoneNumber(e));
        }}
        value={myPhone}
      />
      {!phoneValid ? <small id={`${type} phone`} className="form-text">
        Enter a valid 9-digit phone number.
      </small> : <></>}
    </>
  );
}

