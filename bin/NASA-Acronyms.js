const path = require("path");
const fetch = require("node-fetch");

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

fetch(
  "https://raw.githubusercontent.com/nasa/NASA-Acronyms/master/acronyms.json"
)
  .then(checkStatus)
  .then(res=>res.text())
  .then(res => {
    const resp = JSON.parse(res);
    const abbrJson = {};
    for (let el of resp) {
      if(!abbrJson.hasOwnProperty(el.abbreviation)) {
        abbrJson[el.abbreviation] = []
      }
      abbrJson[el.abbreviation].push(el);
    }
    console.log(JSON.stringify(abbrJson));
  });

