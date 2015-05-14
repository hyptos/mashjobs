define([
    'backbone',
    '../models/sid'
], function(Backbone, searchModel) {
    'use strict';

    var searchCBCollection = Backbone.Collection.extend({
        model: searchModel
    });

    return searchCBCollection;
});
