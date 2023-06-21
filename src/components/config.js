global.XMLHttpRequest = require("xhr2");

//export const url = "http://172.16.120.19:5001";
//export const url = "http://172.16.130.244:5001";
export const url = "http://52.79.241.243:5000";
//export const url2 = "http://192.168.0.9:5001";


export function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  console.log(url.concat(theURL));
  xmlHttp.open("GET", encodeURI(url.concat(theURL)), true);
  xmlHttp.send(null);
  console.log(xmlHttp.responseText);
  return (xmlHttp.responseText);
}

