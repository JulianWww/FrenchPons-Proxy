(function (window) {
  var last = +new Date();
  var delay = 0; // default delay

  // Manage event queue
  var stack = [];

  function callback() {
      var now = +new Date();
      if (now - last > delay) {
          for (var i = 0; i < stack.length; i++) {
              stack[i]();
          }
          last = now;
      }
  }

  // Public interface
  var onDomChange = function (fn, newdelay) {
      if (newdelay) delay = newdelay;
      stack.push(fn);
  };

  // Naive approach for compatibility
  function naive() {

      var last = document.getElementsByTagName('*');
      var lastlen = last.length;
      var timer = setTimeout(function check() {

          // get current state of the document
          var current = document.getElementsByTagName('*');
          var len = current.length;

          // if the length is different
          // it's fairly obvious
          if (len != lastlen) {
              // just make sure the loop finishes early
              last = [];
          }

          // go check every element in order
          for (var i = 0; i < len; i++) {
              if (current[i] !== last[i]) {
                  callback();
                  last = current;
                  lastlen = len;
                  break;
              }
          }

          // over, and over, and over again
          setTimeout(check, delay);

      }, delay);
  }

  //
  //  Check for mutation events support
  //

  var support = {};

  var el = document.documentElement;
  var remain = 3;

  // callback for the tests
  function decide() {
      if (support.DOMNodeInserted) {
          window.addEventListener("DOMContentLoaded", function () {
              if (support.DOMSubtreeModified) { // for FF 3+, Chrome
                  el.addEventListener('DOMSubtreeModified', callback, false);
              } else { // for FF 2, Safari, Opera 9.6+
                  el.addEventListener('DOMNodeInserted', callback, false);
                  el.addEventListener('DOMNodeRemoved', callback, false);
              }
          }, false);
      } else if (document.onpropertychange) { // for IE 5.5+
          document.onpropertychange = callback;
      } else { // fallback
          naive();
      }
  }

  // checks a particular event
  function test(event) {
      el.addEventListener(event, function fn() {
          support[event] = true;
          el.removeEventListener(event, fn, false);
          if (--remain === 0) decide();
      }, false);
  }

  // attach test events
  if (window.addEventListener) {
      test('DOMSubtreeModified');
      test('DOMNodeInserted');
      test('DOMNodeRemoved');
  } else {
      decide();
  }

  // do the dummy test
  var dummy = document.createElement("div");
  el.appendChild(dummy);
  el.removeChild(dummy);

  // expose
  window.onDomChange = onDomChange;
})(window);

var running = false;
var haschanges = false

function updateDOM(){ 
    haschanges = true
    if (running){ return }
    haschanges = false
    running = true;

    tags = document.getElementsByTagName("a");
    for (val of tags) {
        if (val.href != window.location && val.id != "custom_search_button") {
            val.href = window.location
        }
    }

    tags = document.getElementsByTagName("form");
    for (tag of tags) {
        if (tag.action != window.location) {
            tag.action=window.location
        }
    }

    search = document.getElementById("searchForm");
    if (search != null) {
        search.replaceWith(createSearchForm());
    }
    //document.getElementById("search_button").href = location.protocol + location.port + '//' + location.host + location.pathname + "?q=" + encodeURIComponent(document.getElementById("q").value);

    running = false;

    if (haschanges) {
        updateDOM()
    }
}

function createSearchForm() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(decodeURIComponent(urlParams.get('q')));
    return createElementFromHTML('\
        <from id="customSearchForm" class="form-inline search" action="." method="get">\
            <div class="containerSearch">\
                <input id="word" class="pons-search-input" name="world" type="text" placeholder="Search" data-pons-redirect-input="true" value="' + decodeURIComponent(urlParams.get('q')) + '" data-pons-autofocus="true" autocomplete="off"/>\
                <span class="clearInput camoflage headerbutton mobileOnly ">\
                    <svg id="input-clear" class="cross-svg" viewBox="0 0 24 24">\
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>\
                    <path fill="none" d="M0 0h24v24H0z"></path>\
                    </svg>\
                </span>\
            </div>\
            <span class="input-append-btn">\
                <a id="custom_search_button" class="btn btn-primary submit" title="PONS Online - Begin search" href="#" onmousedown="customSearch()">\
                    <i class="desktopOnly icon-search"></i>\
                    <svg class="search-svg mobileOnly" viewBox="0 0 24 24">\
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>\
                    <path fill="none" d="M0 0h24v24H0z"></path>\
                    </svg>\
                </a>\
            </span>\
        </form>\
    ');
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

onDomChange(updateDOM);

function customSearch(){
    var searchBar = document.getElementById("word");
    var searchButton = document.getElementById("custom_search_button")

    var url = location.protocol + "//" + location.host + location.pathname;

    if (searchBar.value != "") {
        url = url + "?q=" + encodeURIComponent(searchBar.value);
    }
    console.log(url)

    searchButton.href = url;
}
