define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchIndeedModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.indeed.com/ads/apisearch',
            api_key: '25562770003550',
            jobtitle: '',
            company: '',
            city: '',
            state: '',
            country: '',
            formattedLocation: '',
            source: '',
            date: '',
            snippet: '',
            url: '',
            jobkey: '',
            sponsored: '',
            expired: '',
            latitude: '',
            longitude: '',
            totalResults: ''
        }
    });

    return jobSearchIndeedModel;
});
