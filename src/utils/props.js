
const err = msg => {
  throw new Error(err);
}

export const propChecker = (props, required) => {
  required.forEach(p=>{
    let v = props[p];
    let msg = "Missing property " + p;
    if(typeof v === 'undefined' || v === null) {
      err(msg);
    }
    if(typeof v === 'string') {
      if(v.trim().length === 0) {
        err(msg);
      }
    }
  });
}
