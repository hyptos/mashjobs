define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html',
    '../models/scb.js',
    '../models/sid.js',
    '../models/country.js',
    '../collections/countries',
    '../collections/searchCB',
    '../collections/searchIn',
], function($, _, Backbone, IndexTemplate, CbModel, IndeedModel, CountryModel, CountriesCollection, CBCollection, INCollection) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $("#app"),
        template: _.template(IndexTemplate),
        events: {
            "keypress #search": "searchAction",
            "click #alignmentSearch": "alignmentSearchAction"
        },
        initialize: function() {
            // console.log("initialize view search");
            this.sid = new IndeedModel();
            this.scb = new CbModel();
            this.colIN = new INCollection();
            this.colCB = new CBCollection();
            this.countries = new CountriesCollection();
            this.getCountriesAction();
            this.listenTo(this.sid, 'all', this.render);
            this.listenTo(this.scb, 'all', this.render);
            this.render();
        },
        render: function() {
            // console.log('render view search ' + this.sid.get('apiUrl'));
            var data = {
                scb: this.scb,
                sid: this.sid,
                colCB: this.colCB,
                colIN: this.colIN,
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
            // console.log('search ' + keywords + ' at ' + country + ' on CB');
            var that = this;
            console.log(this.scb.get('apiUrl'));
            return $.ajax({
                url: this.scb.get('apiUrl'),
                dataType: 'xml',
                data: {
                    DeveloperKey: this.scb.get('api_key'),
                    CountryCode: country.toLowerCase()
                },
            }).success(function(xml) {
                that.colCB.reset();
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
                    if (company !== 'undefined' && company !== '') {
                        that.colCB.add({
                            jobtitle: jobtitle,
                            company: company,
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
                    } else {
                        that.colCB.reset();
                    }
                });
            }).complete(function() {
                that.render();
            });
        },
        searchInAction: function(keywords, country) {
            // console.log('search ' + keywords + ' at ' + country + 'on Indeed');
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
                    l: country,
                    limit: 20
                },
            }).success(function(response) {
                console.log('done ajax sid');
                if (response.results.length > 0) {

                    that.colIN.reset();

                    for (var res in response.results) {
                        var job = response.results[res];
                        var jobtitle = job.jobtitle;
                        var company = job.company;
                        var city = job.city;
                        var state = job.state;
                        var country = job.country;
                        var formattedLocation = job.formattedLocation;
                        var source = job.source;
                        var date = job.date;
                        var snippet = job.formattedLocation;
                        var url = job.url;
                        var jobkey = job.jobkey;
                        var sponsored = job.sponsored;
                        var expired = job.expired;
                        that.colIN.add({
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
                } else {
                    console.log("pas de résultats");
                    that.colIN.reset();
                }
            }).complete(function() {
                that.render();
            });
        },
        getCountriesAction: function() {
            var that = this;
            $.ajax({
                url: 'http://localhost:3000/pays.json',
                dataType: "json",
            }).success(function(response) {
                that.countries.add(response);
            }).complete(function() {
                that.render();
            });
        },
        alignmentSearchAction: function() {
            console.log('comparaison des résultats de chaque api');
            console.log('comparaison de la raison social');
            this.compareToModels('company');

        },
        compareToModels: function(attr) {
            if (this.sid.get(attr) === this.scb.get(attr)) {
                console.log(this.sid.get(attr) + ' ==== ' + this.scb.get(attr));
                return true;
            } else {
                console.log(this.sid.get(attr) + ' !=== ' + this.scb.get(attr));
                return false;
            }

            return this.sid.get(attr) === this.scb.get(attr);
        }
    });
    return indexView;
});
