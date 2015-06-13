define([
    'backbone',
    '../models/country'
], function(Backbone, countryModel) {
    'use strict';

    var countries = Backbone.Collection.extend({
        model: countryModel
    });

    return countries;
});
