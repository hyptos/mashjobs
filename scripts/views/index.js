define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html',
    '../models/scb.js',
    '../models/sid.js',
    '../models/country.js',
    '../collections/countries'
], function($, _, Backbone, IndexTemplate, CbModel, IndeedModel, CountryModel, CountriesCollection) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $("#app"),
        template: _.template(IndexTemplate),
        events: {
            "keypress #search": "searchAction"
        },
        initialize: function() {
            // console.log("initialize view search");
            this.sid = new IndeedModel();
            this.scb = new CbModel();
            this.countries = new CountriesCollection();
            this.getCountries();
            this.listenTo(this.sid, 'all', this.render);
            this.listenTo(this.scb, 'all', this.render);
            this.render();
        },
        render: function() {
            console.log('render view search ' + this.sid.get('apiUrl'));
            var data = {
                scb: this.scb,
                sid: this.sid,
                countries: this.countries
            };
            this.$el.html(this.template(data));
        },
        searchAction: function(event) {
            if (event.keyCode === 13) {
                this.searchCBAction($('#search').val(), $("#country").val());
                this.searchInAction($('#search').val(), $("#country").val());
                console.log('done !!');
            }
        },
        searchCBAction: function(keywords, country) {
            console.log('search ' + keywords + ' at ' + country + 'on CB');
            var that = this;
            console.log(this.scb.get('apiUrl'));
            return $.ajax({
                url: this.scb.get('apiUrl'),
                dataType: 'xml',
                data: {
                    DeveloperKey: this.scb.get('api_key'),
                    CountryCode: country
                },
            }).success(function(xml) {
                $(xml).find('JobSearchResult').each(function(result) {
                    var company = $(this).find('Company').text();
                    var companydid = $(this).find('CompanyDID').text();
                    var companyDetailUrl = $(this).find('CompanyDetailUrl').text();
                    var distance = $(this).find('Distance').text();
                    var employmentType = $(this).find('EmploymentType').text();
                    var education = $(this).find('EducationRequired').text();
                    var location = $(this).find('Location').text();
                    var city = $(this).find('City').text();
                    var state = $(this).find('State').text();
                    var postedDate = $(this).find('PostedDate').text();
                    var pay = $(this).find('Pay').text();
                    var jobtitle = $(this).find('JobTitle').text();
                    var jobDetailsURL = $(this).find('JobDetailsURL').text();
                    var jobServiceURL = $(this).find('JobServiceURL').text();
                    var locationLatitude = $(this).find('LocationLatitude').text();
                    var locationLongitude = $(this).find('LocationLongitude').text();
                    that.scb.set({
                        title: jobtitle,
                        compagny: company,
                        compagnyDetailUrl: companyDetailUrl,
                        did: companydid,
                        distance: distance,
                        employmentType: employmentType,
                        jobDetailsURL: jobDetailsURL,
                        jobServiceURL: jobServiceURL,
                        locationLatitude: locationLatitude,
                        locationLongitude: locationLongitude,
                        location: location,
                        postedDate: postedDate,
                        pay: pay
                    });
                });
            });
        },
        searchInAction: function(keywords, country) {
            console.log('search ' + keywords + ' at ' + country + 'on Indeed');
            var that = this;
            console.log(this.sid.get('apiUrl'));
            return $.ajax({
                url: this.sid.get('apiUrl'),
                dataType: "jsonp",
                data: {
                    publisher: this.sid.get('api_key'),
                    q: keywords,
                    v: 2,
                    format: 'json',
                    l: country
                },
            }).success(function(response) {
                console.log('done ajax sid');
                if (response.results.length > 0) {
                    var jobtitle = response.results[0].jobtitle;
                    var company = response.results[0].company;
                    var city = response.results[0].city;
                    var state = response.results[0].state;
                    var country = response.results[0].country;
                    var formattedLocation = response.results[0].formattedLocation;
                    var source = response.results[0].source;
                    var date = response.results[0].date;
                    var snippet = response.results[0].formattedLocation;
                    var url = response.results[0].url;
                    var jobkey = response.results[0].jobkey;
                    var sponsored = response.results[0].sponsored;
                    var expired = response.results[0].expired;

                    that.sid.set({
                        jobtitle: jobtitle,
                        company: company,
                        city: city,
                        state: state,
                        country: country,
                        formattedLocation: formattedLocation,
                        source: source,
                        date: date,
                        snippet: snippet,
                        url: url,
                        jobkey: jobkey,
                        sponsored: sponsored,
                        expired: expired
                    });
                }
            });
        },
        getCountries: function() {
            var that = this;
            $.ajax({
                url: 'http://localhost:3000/pays.json',
                dataType: "json",
            }).success(function(response) {
                that.countries.add(response);
            }).complete(function() {
                that.render();
            });
        }
    });
    return indexView;
});
