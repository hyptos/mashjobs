define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobModel = Backbone.Model.extend({
        defaults: {
            title: '',
            company: '',
            date: '',
            city: '',
            state: '',
            country: '',
            longitude: '',
            latitude: '',
            employmentType: '',
            pay: '',
            snippet: ''
        }
    });

    return jobModel;
});
