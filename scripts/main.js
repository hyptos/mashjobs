require.config({
    paths: {
        'jquery': 'lib/jquery/dist/jquery',
        'underscore': 'lib/underscore/underscore',
        'backbone': 'lib/backbone/backbone',
        'lie': 'lib/lie/dist/lie',
        'text': '/lib/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        }
    },
    deps: ['jquery', 'underscore', 'backbone', 'lie']
});

require([
    'backbone', 'routes/index'
], function(Backbone, Router) {
    new Router();
    Backbone.history.start();
});
