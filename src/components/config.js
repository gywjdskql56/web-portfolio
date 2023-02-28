global.XMLHttpRequest = require("xhr2");

export const url = "http://172.16.120.19:5000";
//const url = "http://43.200.170.131:5000";

export function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  console.log(url.concat(theURL));
  xmlHttp.open("GET", encodeURI(url.concat(theURL)), true);
  xmlHttp.send(null);
  console.log(xmlHttp.responseText);
  return (xmlHttp.responseText);
}

