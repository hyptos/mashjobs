define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchIndeedModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.indeed.com/ads/apisearch',
            api_key: '25562770003550',
            jobtitle: 'jobtitle',
            company: 'company',
            city: 'city',
            state: 'state',
            country: 'country',
            formattedLocation: 'formattedLocation',
            source: 'source',
            date: 'date',
            snippet: 'snippet',
            url: 'url',
            jobkey: 'jobkey',
            sponsored: 'sponsored',
            expired: 'expired'
        }

    });

    return jobSearchIndeedModel;
});
