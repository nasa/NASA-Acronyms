import "@babel/polyfill";
import Acronyms from "./acronyms.json";

class Main {
  constructor() {
    chrome.runtime.onMessage.addListener(this.listen);
  }

  /**
   * listen to content script messages
   * */
  listen = async (request, sender, sendResponse) => {
    const ABBR = request.abbr.toUpperCase()
    const response = Acronyms.hasOwnProperty(ABBR)
      ? { [request.abbr]: Acronyms[ABBR] }
      : {};
    sendResponse({
      data: response
    });
    return true;
  };
}

const main = new Main();
