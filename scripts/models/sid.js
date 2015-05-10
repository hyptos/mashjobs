define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchIndeedModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.indeed.com/ads/apisearch',
            api_key: ''
        }

    });

    return jobSearchIndeedModel;
});
