define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.careerbuilder.com/v2/jobsearch',
            employeeTypeApi: 'http://api.careerbuilder.com/v1/employeetypes',
            api_key: 'WDHS42Z6NVCBC17NTKWY',
            title: '',
            company: '',
            compagnyDetailUrl: '',
            did: '',
            distance: '',
            employmentType: '',
            jobDetailsURL: '',
            jobServiceURL: '',
            locationLatitude: '',
            locationLongitude: '',
            location: '',
            postedDate: '',
            pay: '',
        }
    });

    return jobSearchModel;
});
