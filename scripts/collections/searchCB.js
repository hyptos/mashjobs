define([
    'backbone',
    '../models/scb'
], function(Backbone, searchModel) {
    'use strict';

    var searchCBCollection = Backbone.Collection.extend({
        model: searchModel
    });

    return searchCBCollection;
});
