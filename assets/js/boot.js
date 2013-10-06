/**
 * Created by Alex on 06.10.13.
 */
require.config({
  paths: {

    jQuery: 'components/jquery/jquery',
    Underscore: 'components/underscore/underscore',
    Backbone: 'components/backbone/backbone',
    Semantic: 'components/semantic/build/packaged/js/semantic.js',

    // Application
    App: 'js/SimpleTrackApp'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'App': ['Backbone']
  }
});

require(['App'], function(App) {
  App.initialize();
});