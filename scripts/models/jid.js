define([
    'backbone',
    'sid'
], function(Backbone, SearchModel) {
    'use strict';

    var jobModel = Backbone.Model.extend({
        apiUrl: 'http://api.indeed.com/ads/apigetjobs',
        api_key: '25562770003550',
        model: new SearchModel()
    });

    return jobModel;
});
