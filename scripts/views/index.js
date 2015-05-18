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
            "keypress #location": "searchAction",
            "click #alignmentSearch": "alignmentSearchAction",
            "click .chooseCbJob": "chooseJobCbAction",
            "click .chooseInJob": "chooseJobInAction",
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
            var search = $('#search').val();
            var country = $("#country").val();
            var location = $('#location').val();
            var start = 0;
            this.colCB.reset();
            this.colIN.reset();
            if (event.keyCode === 13) {
                this.searchCBAction(search, country, location, 0);
                this.searchInAction(search, country, location, start);
                console.log('done !!');
            }
        },
        searchCBAction: function(keywords, country, location) {
            // console.log('search ' + keywords + ' at ' + country + ' on CB');
            console.log(this.scb.get('apiUrl'));
            var that = this;
            return $.ajax({
                url: this.scb.get('apiUrl'),
                dataType: 'xml',
                data: {
                    DeveloperKey: this.scb.get('api_key'),
                    CountryCode: country,
                    JobTitle: keywords,
                    EmpType: 'JTFT', // en dure a changer en tapant dans l'api
                    Location: location,
                    PerPage: 100
                },
            }).success(function(xml) {
                var totalCount = $(xml).find('TotalCount').text();
                console.log('done ajax scb from ' + 0 + ' to ' + totalCount);
                $(xml).find('JobSearchResult').each(function(result) {
                    var company = $(this).find('Company').text();
                    var companydid = $(this).find('CompanyDID').text();
                    var companyDetailUrl = $(this).find('CompanyDetailUrl').text();
                    var distance = $(this).find('Distance').text();
                    var employmentType = $(this).find('EmploymentType').text();
                    var education = $(this).find('EducationRequired').text();
                    var locatione = $(this).find('Location').text();
                    var city = $(this).find('City').text();
                    var state = $(this).find('State').text();
                    var postedDate = $(this).find('PostedDate').text();
                    var pay = $(this).find('Pay').text();
                    var jobtitle = $(this).find('JobTitle').text();
                    var jobDetailsURL = $(this).find('JobDetailsURL').text();
                    var jobServiceURL = $(this).find('JobServiceURL').text();
                    var locationLatitude = $(this).find('LocationLatitude').text();
                    var locationLongitude = $(this).find('LocationLongitude').text();

                    if (company !== 'undefined') {
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
                            location: locatione,
                            postedDate: postedDate,
                            pay: pay,
                            totalResults: totalCount
                        });
                    } else {
                        that.colCB.reset();
                    }
                });
            }).complete(function() {
                that.render();
            });
        },
        searchInAction: function(keywords, country, location, start) {
            // console.log('search ' + keywords + ' at ' + country + 'on Indeed');
            console.log(this.sid.get('apiUrl'));
            var that = this;
            start = start || 0;
            return $.ajax({
                url: this.sid.get('apiUrl'),
                dataType: "jsonp",
                data: {
                    publisher: this.sid.get('api_key'),
                    q: 'title:' + keywords,
                    v: 2,
                    format: 'json',
                    l: location,
                    co: country,
                    limit: 100,
                    latlong: 1,
                    jt: 'fulltime',
                    start: start
                },
            }).success(function(response) {
                console.log('done ajax sid from ' + start + ' to ' + response.totalResults);
                if (response.results.length > 0) {
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
                        var latitude = job.latitude;
                        var longitude = job.longitude;

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
                            expired: expired,
                            latitude: latitude,
                            longitude: longitude,
                            totalResults: response.totalResults
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
        compareToModels: function(left, right, attr) {
            if (left.get(attr) === right.get(attr)) {
                console.log(left.get(attr) + ' ==== ' + right.get(attr));
                return true;
            } else {
                // console.log(left.get(attr) + ' !=== ' + right.get(attr));
                return false;
            }

            return this.sid.get(attr) === this.scb.get(attr);
        },
        chooseJobInAction: function(e) {
            e.preventDefault();
            var that = this;
            var data = $(e.currentTarget).attr("data");
            this.sid = this.colIN.get(data);
            this.colCB.reset();
            this.searchCBAction(this.sid.get('jobtitle'), $("#country").val(), $("#location").val()).complete(function() {
                that.colCB.each(function(model) {
                    if (that.compareToModels(that.sid, model, 'jobtitle')) {
                        if (that.compareToModels(that.sid, model, 'company')) {
                            that.scb.set(model.toJSON());
                        }
                        that.animateSearch();
                    }
                });
            });
        },
        chooseJobCbAction: function(e) {
            e.preventDefault();
            var that = this;
            var data = $(e.currentTarget).attr("data");
            this.scb = this.colCB.get(data);
            this.colIN.reset();
            this.searchInAction(this.scb.get('jobtitle'), $("#country").val(), $("#location").val()).complete(function() {
                that.colIN.each(function(model) {
                    if (that.compareToModels(that.scb, model, 'jobtitle')) {
                        if (that.compareToModels(that.scb, model, 'company')) {
                            that.sid.set(model.toJSON());
                        }
                        that.animateSearch();
                    }
                });
            });
        },
        animateSearch: function() {
            $('#searchContent').fadeOut();
        }
    });
    return indexView;
});
