import { Hmac, createHmac } from 'crypto-browserify';

export default function Signer(contents: string) : string | null {

    const ts = Date.now();
    const sig_basestring = `v0:${ts}:${contents}`;
    let hm;
    if (process.env.BLIND_SECRET !== undefined) {
      hm = createHmac('sha256', process.env.BLIND_SECRET);
      hm.update(sig_basestring);
      const my_signature = hm.digest('hex');
      return my_signature;
    } else {
      return null;
    }
  };
