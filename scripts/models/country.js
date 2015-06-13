define([
    'backbone'
], function(Backbone) {
    'use strict';

    var countryModel = Backbone.Model.extend({
        defaults: {
            name: '',
            code: ''
        }
    });

    return countryModel;
});
