import jQuery from "jquery";
import "qtip2";

const $ = jQuery;

const getMessage = (request) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request,(response) => {
      resolve(response);
    });
  });
}

// places meaning(s) below selected acronym in a qtip tooltip
const renderTooltip = () => {
  $("body").mouseup(event => {
    setTimeout(async () => {
      var inner, range, rect, x, y, h, w;
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        // invoke when text is selected
        inner = selection.anchorNode.innerHTML;
        if (inner) {
          // check if selection is in an input tag
          if (inner.includes("input") || inner.includes("textarea")) {
            // verify selection is in an input tag
            x = event.clientX;
            y = event.clientY + 10; // place qtip slightly below the mouse
            h = 1;
            w = 1;
          }
        } else {
          // for text that a user didn't type
          range = selection.getRangeAt(0);
          rect = range.getBoundingClientRect();
          x = rect.left;
          y = rect.top;
          h = rect.height;
          w = rect.width;
        }
      }
      var selText = selection
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\./g, "");
      var meanings,myMap= {};
      if(selText && selText !== "") {
        const message = await getMessage({abbr: selText});
        console.log({message});
        myMap = message.data;
      }
      if (myMap[selText]) {
        var meanings = new Array();
        for (var i = 0; i < myMap[selText].length; i++) {
          meanings.push(myMap[selText][i]["expansion"]);
        }
      }
      $("#nasa_tooltip").remove();
      if (selText.length > 1 && meanings) {
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.style.height = h + "px";
        div.style.width = w + "px";
        var meaning = "";
        for (var i = 0; i < meanings.length; i++)
          meaning += "\u2022  " + meanings[i] + "<br>";
        meaning = meaning.trim();
        div.setAttribute("title", meaning);
        div.setAttribute("id", "nasa_tooltip");
        document.body.appendChild(div);

        $.fn.qtip.zindex = 999999;
        $("#nasa_tooltip").qtip({
          hide: {
            event: "unfocus"
          }, // hides qtip on mousedown
          content: meaning,
          prerender: true,
          show: {
            ready: true
          }, // prerendering and showing qtip immediately when ready fixes bug where selecting and quickly moving mouse away wouldn't get a qtip
          position: {
            my: "top center",
            at: "bottom center",
            viewport: true,
            adjust: {
              method: "shift none",
              scroll: false
            }
          },
          style: {
            classes: "qtip-tipsy"
          }
        });
      }
    }, 10);
  });
};

renderTooltip();
