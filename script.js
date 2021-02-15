//Joel Malissa & Logan Stafman

//maps from acronym to meaning
var myMap = {};

$.getJSON('https://raw.githubusercontent.com/nasa/NASA-Acronyms/master/lists/acronyms.json', function getAcronymsJson(data) {
    for(var i = 0; i < data.length; i++) {
        var abbrev = data[i]['abbreviation'].toLowerCase();
        if(!myMap[abbrev])
            myMap[abbrev] = new Array();
        myMap[abbrev].push(data[i]);
    }
});

// places meaning(s) below selected acronym in a qtip tooltip
$(function renderTooltip() {
    $('body').mouseup(function mouseUp(event) {
        setTimeout(function setTimeout() {
            var inner, range, rect, x, y, h, w;
            var selection = window.getSelection();
            if(selection.rangeCount > 0) // invoke when text is selected
            {
                inner = selection.anchorNode.innerHTML;
                if(inner) // check if selection is in an input tag
                {
                    if(inner.includes('input') || inner.includes('textarea')) // verify selection is in an input tag
                    {
                        x = event.clientX;
                        y = event.clientY + 10; // place qtip slightly below the mouse
                        h = 1;
                        w = 1;
                    }
                } else { // for text that a user didn't type
                    range = selection.getRangeAt(0);
                    rect = range.getBoundingClientRect();
                    x = rect.left;
                    y = rect.top;
                    h = rect.height;
                    w = rect.width;
                }
            }
            selection = selection.toString().trim();
            var selText = selection.toLowerCase().replace(/\./g,'');
            var meanings;
            if(myMap[selText]) {
                var meanings = new Array();
                for(var i = 0; i < myMap[selText].length; i++) {
                    meanings.push(myMap[selText][i]['expansion']);
                }
            }

            $('.qtip').remove(); // Does this line fix the top left corner duplicate qtip bug?
            $('#nasa_tooltip').remove(); // removes the div created to anchor the first qtip
            
            // Create tooltip with number of results displayed
            if (selText.length > 1 && meanings) {
                // Sort meanings here
                // meanings.sort();  // i.e. sort alphabetically
                // console.log('alphabetical order: ' + meanings);
                // meanings.sort(function(a, b){return a.length - b.length}); // i.e. shortest first
                // console.log('shortest first: ' + meanings);
                // meanings.sort(function(a, b){return b.length - a.length}); // i.e. longest first
                // console.log('longest first: ' + meanings);
                meanings.sort(function(a, b){ // sort by appearances on page
                    var regA = new RegExp(a, 'gi');
                    var regB = new RegExp(b, 'gi');
                    return (document.body.innerText.match(regB) || []).length - (document.body.innerText.match(regA) || []).length;
                })

                if (meanings.length == 1) { // 1 result
                  var out = meanings.length + ' acronym found for ' + selection + ':<br>';
                } else { // >1 result
                  var out = meanings.length + ' acronyms found for ' + selection + ':<br>';
                }
                for(var i = 0; i < meanings.length; i++) out += '\u2022  ' + meanings[i] + '<br>';
                out = out.trim();

                var div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                div.style.height = h + 'px';
                div.style.width = w + 'px';
                div.setAttribute('id', 'nasa_tooltip');
                document.body.appendChild(div);
   
                $.fn.qtip.zindex = 999999;
                $('#nasa_tooltip').qtip({
                    hide: {
                        event: 'unfocus'
                    }, // hides qtip on mousedown
                    content: out,
                    prerender: true,
                    show: {
                        ready: true
                    }, // prerendering and showing qtip immediately when ready fixes bug where selecting and quickly moving mouse away wouldn't get a qtip
                    position: {
                        my: 'top center',
                        at: 'bottom center',
                        viewport: true,
                        adjust: {
                        	method: 'shift none',
                        	scroll: false
                        }
                    },
                    style: {
                        classes: 'qtip-tipsy'
                    }
                });
            }
        }, 10);
    });
});
