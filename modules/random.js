let s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";//`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?";

function main(l = 32){
  let r = "";
  while(r.length<l)
    r+=s[~~(Math.random()*s.length)];
  return r;
}
module.exports = main;