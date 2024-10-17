(function() {
  'use strict';

  /*
    download https://bwa.to/latest.zip
    edit bwa.js and settings.json
  */

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }


  var hostcloud = ["https://bwa-cloud.apn.monster/online.js"];
  var hostcloud_version = '?v=100924';

  var plugins = ["o.js"];
  var plugins_version = '?v=100924-11';

  var host = 'https://bwa.to';
  var framework = 'https://c73d8077.bwa.pages.dev:8443';
  var framework_standby = 'http://185.245.106.167';


  function putcloud() 
  {
    Lampa.Utils.putScriptAsync(hostcloud.map(function(u) {
      return u + hostcloud_version;
    }), function() {});
  }

  if (false && Lampa.Platform.is('android') == false && Lampa.Platform.is('browser') == false) 
  {
    putcloud();
  } 
  else 
  {
    var net = new Lampa.Reguest();
    net.timeout(2000);

    var nowork = function() {
      framework = framework_standby;
      start();
    }

    net.native(framework + '/blazor.boot.json', function(j) {
      try {
        j.resources.assembly['JinEnergy.wasm'];
        start();
      } catch (e) {
        nowork();
      }
    }, function(error) {
      nowork();
    });
  }

  function start() 
  {
    function putplugins() {
      Lampa.Utils.putScriptAsync(plugins.filter(function(u) {
        return (!window.bwajs_plugin && u == 'o.js') || (!window['plugin_sisi_pwa_ready'] && u == 's.js');
      }).map(function(u) {
        console.log('BWA', host + '/plugins/' + u + plugins_version);
        return host + '/plugins/' + u + plugins_version;
      }), function() {});
    }

    if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
      if (window.blazor_load == undefined) {
        window.blazor_load = true;
        var s = document.createElement('script');
        s.onload = function() {
          if (typeof Blazor == undefined) {
            console.log('BWA', 'Blazor undefined');
            return;
          }

          try {
            Blazor.start({
              loadBootResource: function loadBootResource(type, name, defaultUri, integrity) {
                //console.log('BWA', 'load: ' + name);
                return framework + '/' + name;
              }
            }).then(function() {
              console.log('BWA', 'load complete');
              var net = new Lampa.Reguest();
              window.httpReq = function(url, post, params) {
                return new Promise(function(resolve, reject) {
                  net["native"](url, function(result) {
                    if (_typeof(result) == 'object') resolve(JSON.stringify(result));
                    else resolve(result);
                  }, reject, post, params);
                });
              };

              var check = function check(good) {
                try {
                  DotNet.invokeMethodAsync("JinEnergy", 'initial').then(function(initial) {
                    if (initial) {
                      window.blazor_init = true;
                      putplugins();
                      console.log('BWA', 'check cors:', good);
                      var type = Lampa.Platform.is('android') ? 'apk' : good ? 'cors' : 'web';
                      var conf = host + '/settings/' + type + '.json';
                      DotNet.invokeMethodAsync("JinEnergy", 'oninit', type, conf);
                    } else {
                      console.log('BWA', 'not initial');
                    }
                  })["catch"](function(e) {
                    console.log('BWA', e);
                  });
                } catch (e) {
                  console.log('BWA', e);
                }
              };

              if (Lampa.Platform.is('android') || Lampa.Platform.is('tizen')) check(true);
              else {
                net.silent('https://github.com/', function() {
                  check(true);
                }, function() {
                  check(false);
                }, false, {
                  dataType: 'text'
                });
              }
            })["catch"](function(e) {
              console.log('BWA', e);
            });
          } catch (e) {
            console.log('BWA', e);
          }
        };

        s.setAttribute('autostart', 'false');
        s.setAttribute('src', framework + '/blazor.webassembly.js');
        document.body.appendChild(s);
      } else if (window.blazor_init) {
        putplugins();
      }
    } else {
      putcloud();
    }
  }
})();