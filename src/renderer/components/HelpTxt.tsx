import { useState, useEffect } from 'react';
import "../style.css";

export default function HelpTxt({ show, txt}: { show: boolean; txt: string; }) {
    const [showTxt, setShowTxt] = useState<boolean>(false);

    useEffect(() => {
        setShowTxt(show);
    }, [show]);

    if(showTxt) {
      return (
       <div>
        <small className="form-text small">
          {txt}
        </small>
      </div>
    );
    } else {
      return null;
    }
}
