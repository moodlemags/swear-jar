/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a 'New content is
                // available; please refresh.' message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  function getsize() {
    // force the responsive img height and following section's mgn top - xs
    var imgheight = document.body.clientWidth * 1365 / 2048;
    imgheight = parseInt(imgheight, 10) - 1;
    // document.getElementById('banner').setAttribute('style','margin-top:' + (imgheight/2 - 80) + 'px');
    var banner = document.getElementById('banner');
    var signup = document.getElementById('signup');
    if (document.body.clientWidth < 768) {
      // xs screens - mobile - signup shows below hero
      banner.setAttribute('style', 'margin-top:' + (imgheight - banner.offsetHeight) + 'px');
      signup.setAttribute('style', 'margin-top:20px');
    } else {
      // non mobile, signup overlays hero
      banner.setAttribute('style', 'margin-top:20px');
      signup.setAttribute('style', 'margin-top:360px');
      document.getElementById('hero').setAttribute('style', 'min-height:' + (window.innerHeight) + 'px');
    }
  }
  getsize();
  window.onresize = getsize;

  window.pledge = function() {
    var email = document.getElementById('email').value;
    console.log('email = ' + email);
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (regex.test(email)) {
      document.getElementById('emailerror').style.display = 'none';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyTuqk69p3R7v419Vhuqb8g1soBW5NrxbqkUvcU2gwB1nmlnpQ/exec');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        console.log('status ' + xhr.status + ' ' + xhr.statusText);
        console.log('response ' + xhr.responseText);
        document.getElementById('modal').setAttribute('style', 'display:flex');
        return;
      };
      // url encode form data for sending as post data
      var data = {email: email};
      var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    } else {
      document.getElementById('emailerror').style.display = 'block';
      return false;
    }
  };

  window.closemodal = function() {
    document.getElementById('modal').setAttribute('style', 'display:none');
  };
})();
