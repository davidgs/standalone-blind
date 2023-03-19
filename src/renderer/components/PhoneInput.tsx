import { useEffect, useState } from 'react';
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

  const formatPhone = (e: string | undefined) => {
    const phoneRegex = /(\d{3})(\d{3})(\d{4})/;
    if (e) {
      const r = e.replace(/\D/g, "");
      const formattedPhone: string = r.replace(phoneRegex, '($1) $2-$3');
      return formattedPhone;
    }
  };

  const [myPhone, setMyPhone] = useState<string>('');

  useEffect(() => {
    setMyPhone(phone);
  }, [phone]);

  return (
    <>
      <Form.Control
        type="text"
        placeholder={`${type} Phone`}
        name={`${type} Phone`}
        onChange={(e) => {
          console.log(`Phone changed: ${e.target.value}`);
          setMyPhone(formatPhone(e.target.value));
          callback(type, formatPhone(e.target.value));
        }}
        onBlur={(e) => {
          setMyPhone(formatPhone(e.target.value));
          callback(type, formatPhone(e.target.value));
        }}
        value={myPhone}
      />
    </>
  );
}

