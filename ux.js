"use strict";

(function () {
  'use strict';

  function start() {
    var network = new Lampa.Reguest();
    function add(u, params) {
      return u + (/\?/.test(u) ? '&' : '?') + params;
    }
    function url(u) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var ln = [Lampa.Storage.field('tmdb_lang')];
      if (params.langs) ln = typeof params.langs == 'string' ? [params.langs] : ln.concat(params.langs.filter(function (n) {
        return n !== ln[0];
      }));
      u = add(u, 'api_key=' + Lampa.TMDB.key());
      u = add(u, 'language=' + ln.join(','));
      if (params.genres && u.indexOf('with_genres') == -1) u = add(u, 'with_genres=' + params.genres);
      if (params.page) u = add(u, 'page=' + params.page);
      if (params.query) u = add(u, 'query=' + params.query);
      if (params.keywords) u = add(u, 'with_keywords=' + params.keywords);
      if (params.watch_region) u = add(u, 'watch_region=' + params.watch_region);
      if (params.watch_providers) u = add(u, 'with_watch_providers=' + params.watch_providers);
      if (params.networks) u = add(u, 'with_networks=' + params.networks);
      if (params.sort_by) u = add(u, 'sort_by=' + params.sort_by);
      if (params.filter) {
        for (var i in params.filter) {
          u = add(u, i + '=' + params.filter[i]);
        }
      }
      if (params.genres && u.indexOf('discover/') !== 0) {
        u = 'discover/' + u;
      }
      return Lampa.TMDB.api(u);
    }
    function get(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var u = url(method, params);
      network.silent(u, function (json) {
        json.url = method;
        oncomplite(json);
      }, onerror);
    }
    function external_imdb_id() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      get(params.type + '/' + params.id + '/external_ids', params, function (ids) {
        oncomplite(ids.imdb_id || '');
      }, function () {
        oncomplite('');
      });
    }
    function get_manifest_plugins() {
      var plugins = [];
      var pluginsParam = [];
      var defaultPlugin;
      Lampa.Manifest.plugins.forEach(function (plugin) {
        if (plugin.type == 'video' && plugin.onContextMenu && plugin.onContextLauch) {
          if (!defaultPlugin) defaultPlugin = plugin.name;
          pluginsParam[plugin.name] = plugin.name;
          plugins[plugin.name] = {
            title: plugin.name,
            component: plugin.component,
            subtitle: plugin.subtitle || plugin.description,
            onSelect: function onSelect(data) {
              var enabled = Lampa.Controller.enabled().name;
              if (document.body.classList.contains('search--open')) Lampa.Search.close();
              if (!data.imdb_id && data.source == 'tmdb') {
                // Lampa.Loading.start(()=>{
                //     Lampa.Loading.stop()

                //     Lampa.Controller.toggle(enabled)
                // })

                external_imdb_id({
                  type: data.name ? 'tv' : 'movie',
                  id: data.id
                }, function (imdb_id) {
                  //Lampa.Loading.stop()

                  data.imdb_id = imdb_id;
                  plugin.onContextLauch(data);
                });
              } else plugin.onContextLauch(data);
            }
          };
        }
      });
      return {
        plugins: plugins,
        pluginsParam: pluginsParam,
        defaultPlugin: defaultPlugin
      };
    }
    setTimeout(function () {
      var _get_manifest_plugins = get_manifest_plugins(),
        plugins = _get_manifest_plugins.plugins,
        pluginsParam = _get_manifest_plugins.pluginsParam,
        defaultPlugin = _get_manifest_plugins.defaultPlugin;
      if (Lampa.Storage.field('lampastore_ux_default_plugin') != undefined) Lampa.Storage.set('lampastore_ux_default_plugin', defaultPlugin);
      Lampa.SettingsApi.addComponent({
        component: 'lampastore_ux',
        icon: "<svg fill=\"#fcfcfc\" height=\"800px\" width=\"800px\" version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 511 511\" xml:space=\"preserve\">\n                       <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"/>\n                       <g id=\"SVGRepo_tracerCarrier\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                       <g id=\"SVGRepo_iconCarrier\"> <g> <path d=\"M39.5,103c1.97,0,3.91-0.8,5.3-2.2c1.4-1.39,2.2-3.33,2.2-5.3s-0.8-3.91-2.2-5.3c-1.39-1.4-3.32-2.2-5.3-2.2 s-3.91,0.8-5.3,2.2c-1.4,1.39-2.2,3.33-2.2,5.3s0.8,3.91,2.2,5.3C35.59,102.2,37.53,103,39.5,103z\"/> <path d=\"M63.5,103c1.98,0,3.91-0.8,5.3-2.2c1.4-1.39,2.2-3.33,2.2-5.3s-0.8-3.91-2.2-5.3c-1.39-1.4-3.33-2.2-5.3-2.2 c-1.97,0-3.91,0.8-5.3,2.2c-1.4,1.39-2.2,3.33-2.2,5.3s0.8,3.91,2.2,5.3C59.59,102.2,61.53,103,63.5,103z\"/> <path d=\"M87.5,103c1.97,0,3.91-0.8,5.3-2.2c1.4-1.39,2.2-3.33,2.2-5.3s-0.8-3.91-2.2-5.3c-1.39-1.4-3.33-2.2-5.3-2.2 c-1.97,0-3.91,0.8-5.3,2.2c-1.4,1.39-2.2,3.33-2.2,5.3s0.8,3.91,2.2,5.3C83.59,102.2,85.53,103,87.5,103z\"/> <path d=\"M119.5,103h304c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5h-304c-4.142,0-7.5,3.358-7.5,7.5S115.358,103,119.5,103z\"/> <path d=\"M455.5,103h16c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5h-16c-4.142,0-7.5,3.358-7.5,7.5S451.358,103,455.5,103z\"/> <path d=\"M439.5,168h-144c-12.958,0-23.5,10.542-23.5,23.5v0.5h-8.5c-12.958,0-23.5,10.542-23.5,23.5V280h-17v-24.5 c0-12.958-10.542-23.5-23.5-23.5h-128C58.542,232,48,242.542,48,255.5v64c0,12.958,10.542,23.5,23.5,23.5h128 c12.958,0,23.5-10.542,23.5-23.5V295h17v64.5c0,12.958,10.542,23.5,23.5,23.5h8.5v0.5c0,12.958,10.542,23.5,23.5,23.5h144 c12.958,0,23.5-10.542,23.5-23.5v-16c0-12.958-10.542-23.5-23.5-23.5h-144c-12.958,0-23.5,10.542-23.5,23.5v0.5h-8.5 c-4.687,0-8.5-3.813-8.5-8.5V295h17v0.5c0,12.958,10.542,23.5,23.5,23.5h144c12.958,0,23.5-10.542,23.5-23.5v-16 c0-12.958-10.542-23.5-23.5-23.5h-144c-12.958,0-23.5,10.542-23.5,23.5v0.5h-17v-64.5c0-4.687,3.813-8.5,8.5-8.5h8.5v0.5 c0,12.958,10.542,23.5,23.5,23.5h144c12.958,0,23.5-10.542,23.5-23.5v-16C463,178.542,452.458,168,439.5,168z M208,319.5 c0,4.687-3.813,8.5-8.5,8.5h-128c-4.687,0-8.5-3.813-8.5-8.5v-64c0-4.687,3.813-8.5,8.5-8.5h128c4.687,0,8.5,3.813,8.5,8.5V319.5z M287,367.5c0-4.687,3.813-8.5,8.5-8.5h144c4.687,0,8.5,3.813,8.5,8.5v16c0,4.687-3.813,8.5-8.5,8.5h-144 c-4.687,0-8.5-3.813-8.5-8.5V367.5z M287,279.5c0-4.687,3.813-8.5,8.5-8.5h144c4.687,0,8.5,3.813,8.5,8.5v16 c0,4.687-3.813,8.5-8.5,8.5h-144c-4.687,0-8.5-3.813-8.5-8.5V279.5z M448,207.5c0,4.687-3.813,8.5-8.5,8.5h-144 c-4.687,0-8.5-3.813-8.5-8.5v-16c0-4.687,3.813-8.5,8.5-8.5h144c4.687,0,8.5,3.813,8.5,8.5V207.5z\"/> <path d=\"M471.5,56h-432C17.72,56,0,73.72,0,95.5v320C0,437.28,17.72,455,39.5,455h432c21.78,0,39.5-17.72,39.5-39.5v-320 C511,73.72,493.28,56,471.5,56z M39.5,71h432c13.509,0,24.5,10.991,24.5,24.5V120H15V95.5C15,81.991,25.991,71,39.5,71z M471.5,440 h-432C25.991,440,15,429.009,15,415.5V135h481v280.5C496,429.009,485.009,440,471.5,440z\"/> </g> </g>\n                       </svg>",
        name: 'UX'
      });
      Lampa.Lang.add({
        lampastore_ux_default_plugin: {
          //
          ru: 'Плагин по умолчанию',
          en: 'Default plugin',
          uk: 'Плагін за замовчанням'
        }
      });
      Lampa.SettingsApi.addParam({
        component: 'lampastore_ux',
        param: {
          name: 'lampastore_ux_default_plugin',
          type: 'select',
          values: pluginsParam,
          "default": defaultPlugin != undefined ? defaultPlugin : ''
        },
        field: {
          name: Lampa.Lang.translate('lampastore_ux_default_plugin')
        },
        onChange: function onChange() {}
      });
      Lampa.Lang.add({
        lampastore_ux_poster_plugin: {
          //
          ru: 'Открывать постеры плагином',
          en: 'Open posters by plugin',
          uk: 'Відкривати постери плагіном'
        }
      });
      Lampa.SettingsApi.addParam({
        component: 'lampastore_ux',
        param: {
          name: 'lampastore_ux_poster_plugin',
          type: 'select',
          values: {
            yes: Lampa.Lang.translate('settings_param_yes'),
            no: Lampa.Lang.translate('settings_param_no')
          },
          "default": 'yes'
        },
        field: {
          name: Lampa.Lang.translate('lampastore_ux_poster_plugin')
        },
        onChange: function onChange() {}
      });
    }, 3000);
    Lampa.Lang.add({
      lampastore_ux_default_plugin_not_loaded: {
        //
        ru: 'Плагин просмотра по умолчанию еще',
        en: 'Default video plugin is not loaded yet',
        uk: 'Плагін перегляду за замовчанням ще не завантажений'
      }
    });

    // Lampa.Listener.follow('line', (e) => {
    //     let items = e.items
    //     let params = e.params

    //     if (items) {
    //         let enabled = Lampa.Controller.enabled().name
    //         items.forEach((card) => {
    //             card.onEnter = function (target, card_data) {
    //                 if (!card_data.source) card_data.source = params.object.source;

    //                 //if(document.body.classList.contains('search--open')) Lampa.Search.close()

    //                 if (typeof card_data.gender !== 'undefined') {
    //                     Lampa.Activity.push({
    //                         url: card_data.url,
    //                         title: Lang.translate('title_person'),
    //                         component: 'actor',
    //                         id: card_data.id,
    //                         source: card_data.source || params.object.source
    //                     });
    //                 } else {
    //                     let { plugins, pluginsParam, defaultPlugin } = get_manifest_plugins()
    //                     if (plugins[Lampa.Storage.field('lampastore_ux_default_plugin')] != undefined) plugins[Lampa.Storage.field('lampastore_ux_default_plugin')].onSelect(card_data, enabled)
    //                     else Lampa.Noty.show(Lampa.Lang.translate('lampastore_ux_default_plugin_not_loaded'))  
    //                 }
    //             };
    //         })
    //     }

    // })

    Lampa.Listener.follow('full', function (e) {
      if (e.data && e.type == 'complite' && e.subtype !== 'load_buttons') {
        var _get_manifest_plugins2 = get_manifest_plugins(),
          plugins = _get_manifest_plugins2.plugins,
          pluginsParam = _get_manifest_plugins2.pluginsParam,
          defaultPlugin = _get_manifest_plugins2.defaultPlugin;
        var card_data = e.object;
        $(".button--plugin-watch").remove();
        $(".full-start-new__buttons").prepend("<div class=\"full-start__button selector button--plugin-watch\">\n                    <svg fill=\"currentColor\" version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 264.411 264.411\" xml:space=\"preserve\">\n                    <g id=\"Reproducir\">\n\t                <path d=\"M262.267,42.077c-1.359-1.14-3.148-1.62-4.901-1.311l-0.26,0.046c-15.948,2.841-32.325,2.842-48.289-0.001l-0.254-0.045\n\t\t                c-1.75-0.308-3.542,0.171-4.901,1.311c-1.359,1.141-2.145,2.823-2.145,4.598v10.527H62.896V46.675c0-1.773-0.784-3.456-2.144-4.596\n\t\t                c-1.358-1.141-3.152-1.619-4.898-1.313l-0.265,0.047c-15.95,2.84-32.324,2.842-48.292-0.002l-0.255-0.045\n\t\t                c-1.746-0.306-3.539,0.173-4.898,1.313C0.784,43.219,0,44.901,0,46.675v171.062c0,1.714,0.732,3.346,2.014,4.484\n\t\t                c1.279,1.138,2.985,1.672,4.688,1.475l8.684-1.023c10.639-1.254,21.486-1.254,32.125,0l8.683,1.023\n\t\t                c0.234,0.027,0.469,0.041,0.702,0.041c1.462,0,2.883-0.534,3.986-1.516c1.281-1.139,2.014-2.771,2.014-4.484v-15.53h138.621v15.53\n\t\t                c0,1.714,0.732,3.346,2.014,4.484c1.28,1.138,2.984,1.672,4.688,1.475l8.683-1.023c10.639-1.254,21.486-1.254,32.125,0l8.683,1.023\n\t\t                c0.234,0.027,0.469,0.041,0.702,0.041c1.462,0,2.883-0.534,3.986-1.516c1.281-1.139,2.014-2.771,2.014-4.484V46.675\n\t\t                C264.411,44.9,263.626,43.218,262.267,42.077z M50.896,210.987l-1.98-0.233c-11.566-1.363-23.367-1.363-34.934,0L12,210.987V53.677\n\t\t                c12.924,1.696,25.979,1.694,38.896,0.001v9.524v133.004V210.987z M62.896,190.206V69.202h138.621v121.004H62.896z M252.411,210.987\n\t\t                l-1.98-0.233c-11.566-1.363-23.367-1.363-34.934,0l-1.98,0.233v-14.781V63.202v-9.525c12.926,1.695,25.979,1.694,38.895,0.001\n\t\t            V210.987z\"/>\n\t                <rect x=\"22.457\" y=\"69.725\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"22.457\" y=\"93.2\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"22.457\" y=\"116.674\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"22.457\" y=\"140.149\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"22.457\" y=\"163.624\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"22.457\" y=\"187.098\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"69.725\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"93.2\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"116.674\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"140.149\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"163.624\" width=\"18\" height=\"10.48\"/>\n\t                <rect x=\"223.964\" y=\"187.098\" width=\"18\" height=\"10.48\"/>\n\t                <path d=\"M157.242,122.927l-34.62-22.944C117.218,96.4,110,100.276,110,106.76v45.889c0,6.484,7.218,10.359,12.622,6.777\n\t\t            l34.62-22.944C162.094,133.266,162.094,126.142,157.242,122.927z\"/>\n                    </g>\n                    </svg><span>".concat(Lampa.Lang.translate("title_watch"), "</span></div>"));
        $(".button--plugin-watch").on("hover:enter", function (card) {
          if (plugins[Lampa.Storage.field('lampastore_ux_default_plugin')] != undefined) plugins[Lampa.Storage.field('lampastore_ux_default_plugin')].onSelect(card_data.card);else Lampa.Noty.show(Lampa.Lang.translate('lampastore_ux_default_plugin_not_loaded'));
        });
        if (Lampa.Storage.field('lampastore_ux_poster_plugin') == 'yes') {
          if (plugins[Lampa.Storage.field('lampastore_ux_default_plugin')] != undefined) plugins[Lampa.Storage.field('lampastore_ux_default_plugin')].onSelect(card_data.card);else Lampa.Noty.show(Lampa.Lang.translate('lampastore_ux_default_plugin_not_loaded'));
        }
      }
    });
    Lampa.Listener.follow('activity', function (e) {
      if (e.type == 'start' && (e.component == 'lampac' || e.component == 'showy' || e.component == 'online_mod' || e.component == 'modss_online')) {
        if ($('.activity--active .explorer-card__head').next('.full-start-new__buttons').length == 0) {
          $('.activity--active .explorer-card__head').after('<div class="full-start-new__buttons" style="margin-bottom: 1em"></div>');
          $('.activity--active .explorer-card__head').css('margin-bottom', '1.3em');
          $('.activity--active .explorer-card__descr').css('overflow-y', 'auto');
          Lampa.Listener.send('full', {
            type: 'complite',
            subtype: 'load_buttons',
            object: {
              activity: Lampa.Activity.active().activity,
              method: Lampa.Activity.active().movie.first_air_date ? 'tv' : 'movie'
            },
            data: Lampa.Activity.active()
          });
        }
      }
    }, false);
  }
  if (window.appready) start();else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type == 'ready') {
        start();
      }
    });
  }
})();