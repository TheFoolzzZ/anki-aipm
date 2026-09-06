import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
export function sha256(value:string){ return createHash('sha256').update(value).digest('hex'); }
function secret(){ const s=process.env.APM_SESSION_SECRET; if(!s||s.length<32)throw new Error('SESSION_NOT_CONFIGURED');return s; }
export function sign(payload:object,purpose:string,key=secret()){
 const body=Buffer.from(JSON.stringify(payload)).toString('base64url');
 return `${body}.${createHmac('sha256',key).update(`${purpose}:${body}`).digest('base64url')}`;
}
export function verify<T extends {expires:number}>(token:string,purpose:string,key=secret()):T|null{
 try {
  if(token.length>24000)return null;
  const [body,signature,...extra]=token.split('.'); if(!body||!signature||extra.length)return null;
  const expected=createHmac('sha256',key).update(`${purpose}:${body}`).digest();
  const actual=Buffer.from(signature,'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
  const value=JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
  return typeof value.expires==='number'&&value.expires>Date.now()?value:null;
 }catch{return null;}
}
