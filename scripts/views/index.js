define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html',
    '../models/scb.js',
    '../models/sid.js',
    '../models/mashup.js',
    '../models/country.js',
    '../collections/countries',
    '../collections/searchCB',
    '../collections/searchIn',
], function($, _, Backbone, IndexTemplate, CbModel, IndeedModel, MashupModel, CountryModel, CountriesCollection, CBCollection, INCollection) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $("#app"),
        template: _.template(IndexTemplate),
        events: {
            "keypress #search": "psearchAction",
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
            this.mashup = new MashupModel();
            this.countries = new CountriesCollection();
            this.getCountriesAction();
            this.listenTo(this.sid, 'all', this.render);
            this.listenTo(this.scb, 'all', this.render);
            this.listenTo(this.mashup, 'all', this.render);
            this.nb = 0;
            this.render();
        },
        render: function() {
            // console.log('render view search ' + this.sid.get('apiUrl'));
            var data = {
                scb: this.scb,
                sid: this.sid,
                colCB: this.colCB,
                colIN: this.colIN,
                mashup: this.mashup,
                countries: this.countries
            };
            this.$el.html(this.template(data));
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
        alignmentSearchAction: function(e) {
            e.preventDefault();
            this.mashup.set({
                title: this.scb.get('jobtitle'),
                company: this.scb.get('company'),
                date: this.sid.get('date'),
                city: this.sid.get('city'),
                state: this.sid.get('state'),
                country: this.sid.get('country'),
                longitude: this.scb.get('locationLongitude'),
                latitude: this.scb.get('locationLatitude'),
                employmentType: this.scb.get('employmentType'),
                pay: this.scb.get('pay'),
                snippet: this.sid.get('snippet')
            });
        },
        compareToModels: function(cb, indeed, attr) {
            if (cb.get(attr) === indeed.get(attr)) {
                console.log(cb.get(attr) + ' ==== ' + indeed.get(attr));
                return true;
            } else {
                // console.log(cb.get(attr) + ' !=== ' + indeed.get(attr));
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

            var search = this.sid.get('jobtitle');
            var country = $("#country").val();
            var location = $('#location').val();

            this.pSearchCBActionRes(search, country, location).then(function() {
                that.colCB.each(function(model) {
                    if (that.compareToModels(that.sid, model, 'jobtitle')) {
                        if (that.compareToModels(that.sid, model, 'company')) {
                            that.scb.set(model.toJSON());
                            // that.animateSearch();
                        } else {
                            console.log('pas la meme company');
                        }
                    }
                });
            }).catch(function(err) {
                console.log(err);
            });
        },
        chooseJobCbAction: function(e) {
            e.preventDefault();
            var that = this;
            var data = $(e.currentTarget).attr("data");
            this.scb = this.colCB.get(data);
            this.colIN.reset();

            var search = this.scb.get('jobtitle');
            var country = $("#country").val();
            var location = $('#location').val();

            this.pSearchINActionRes(search, country, location, 0).then(function() {
                that.colIN.each(function(model) {
                    if (that.compareToModels(that.scb, model, 'jobtitle')) {
                        if (that.compareToModels(that.scb, model, 'company')) {
                            that.sid.set(model.toJSON());
                        }
                        // that.animateSearch();
                    }
                });
            }).catch(function(err) {
                console.log(err);
            });
        },
        animateSearch: function() {
            $('#searchContent').fadeOut();
        },
        psearchCBAction: function(keywords, country, location) {
            // console.log('search ' + keywords + ' at ' + country + ' on CB');
            console.log(this.scb.get('apiUrl'));
            var self = this;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: self.scb.get('apiUrl'),
                    dataType: 'xml',
                    data: {
                        DeveloperKey: self.scb.get('api_key'),
                        CountryCode: country,
                        JobTitle: keywords,
                        EmpType: 'JTFT', // en dure a changer en tapant dans l'api
                        Location: location,
                        PerPage: 100
                    },
                }).success(function(xml) {
                    resolve(xml);
                });
            });
        },
        pSearchCBActionRes: function(search, country, location) {
            var self = this;
            return this.psearchCBAction(search, country, location, 0).then(function(xml) {
                var totalCount = $(xml).find('TotalCount').text();
                console.log('done ajax scb from ' + 0 + ' to ' + totalCount);
                $(xml).find('JobSearchResult').each(function(result) {
                    var company = $(this).find('Company').text();
                    if (company !== 'undefined') {
                        self.colCB.add({
                            jobtitle: $(this).find('JobTitle').text(),
                            company: company,
                            city: $(this).find('City').text(),
                            state: $(this).find('State').text(),
                            compagnyDetailUrl: $(this).find('CompanyDetailUrl').text(),
                            did: $(this).find('CompanyDID').text(),
                            distance: $(this).find('Distance').text(),
                            employmentType: $(this).find('EmploymentType').text(),
                            education: $(this).find('EducationRequired').text(),
                            jobDetailsURL: $(this).find('JobDetailsURL').text(),
                            jobServiceURL: $(this).find('JobServiceURL').text(),
                            locationLatitude: $(this).find('LocationLatitude').text(),
                            locationLongitude: $(this).find('LocationLongitude').text(),
                            location: $(this).find('Location').text(),
                            postedDate: $(this).find('PostedDate').text(),
                            pay: $(this).find('Pay').text(),
                            totalResults: totalCount
                        });
                    } else {
                        self.colCB.reset();
                    }
                });
            }).then(function() {
                self.render();
            }).catch(function(err) {
                console.log(err);
            });
        },
        psearchINAction: function(keywords, country, location, start) {
            console.log(this.sid.get('apiUrl'));
            var self = this;
            start = start || 0;
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: self.sid.get('apiUrl'),
                    dataType: "jsonp",
                    data: {
                        publisher: self.sid.get('api_key'),
                        q: 'title:' + keywords,
                        v: 2,
                        format: 'json',
                        l: location,
                        co: country,
                        limit: 25,
                        latlong: 1,
                        jt: 'fulltime',
                        start: start
                    },
                }).success(function(response) {
                    resolve(response);
                });
            });
        },
        pSearchINActionRes: function(search, country, location, start) {
            var self = this;
            return this.psearchINAction(search, country, location, start).then(function(response) {
                console.log('done ajax sid from ' + start + ' to ' + response.totalResults);
                // if we got results
                if (response.results.length > 0) {
                    _.each(response.results, function(job) {
                        // add to collection every jobs
                        self.colIN.add({
                            jobtitle: job.jobtitle,
                            company: job.company,
                            city: job.city,
                            state: job.state,
                            country: job.country,
                            formattedLocation: job.formattedLocation,
                            source: job.source,
                            date: job.date,
                            snippet: job.snippet,
                            url: job.url,
                            jobkey: job.jobkey,
                            sponsored: job.sponsored,
                            expired: job.expired,
                            latitude: job.latitude,
                            longitude: job.longitude,
                            totalResults: response.totalResults
                        });
                    });
                    // else we clear the collection
                } else {
                    console.log("pas de résultats");
                    self.colIN.reset();
                }
            }).then(function() {
                self.render();
            }).then(function(){
                var search = $('#search').val();
                var country = $("#country").val();
                var location = $('#location').val();
                setTimeout(function(){
                    var limit = parseInt($('#totalIndeedResults').text());
                    if(self.nb < limit){
                        console.log(self.nb<limit);
                        self.pSearchINActionRes(search, country, location, self.nb);
                    }
                    self.nb += 25;
                }, 250);

            }).catch(function(err) {
                console.log(err);
            });
        },
        psearchAction: function() {
            var search = $('#search').val();
            var country = $("#country").val();
            var location = $('#location').val();
            this.colCB.reset();
            this.colIN.reset();
            if (event.keyCode === 13) {
                this.pSearchCBActionRes(search, country, location);
                this.pSearchINActionRes(search, country, location, 0);
            }
        }
    });
    return indexView;
});
