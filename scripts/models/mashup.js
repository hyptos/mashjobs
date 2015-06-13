define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobModel = Backbone.Model.extend({
        defaults: {
            id: '',
            title: '',
            company: '',
            date: '',
            city: '',
            state: '',
            country: '',
            distance: '',
            longitude: '',
            latitude: '',
            employmentType: '',
            pay: '',
            snippet: ''
        }
    });

    return jobModel;
});
