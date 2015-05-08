define([
    'backbone'
], function(Backbone) {
    'use strict';

    var jobSearchModel = Backbone.Model.extend({
        defaults: {
            apiUrl: 'http://api.careerbuilder.com/v2/jobsearch',
            api_key: '',
            title: 'monsupertitre',
            compagny: 'Company',
            compagnyDetailUrl: 'CompanyDetailsURL',
            did: 'DID',
            distance: 'Distance',
            employmentType: 'EmploymentType',
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
