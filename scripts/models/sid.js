define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchIndeedModel = Backbone.Model.extend({
        api: 'http://api.indeed.com/'
    });

    return jobSearchIndeedModel;
});
