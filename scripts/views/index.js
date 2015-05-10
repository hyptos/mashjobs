define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html',
    '../models/scb.js',
    '../models/sid.js'
], function($, _, Backbone, IndexTemplate, CbModel, IndeedModel) {
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
            this.listenTo(this.sid, 'all', this.render);
            this.listenTo(this.scb, 'all', this.render);
            this.render();
        },
        render: function() {
            console.log('render view search' + this.sid.get('apiUrl'));
            var data = {
                scb: this.scb,
                sid: this.sid
            };
            this.$el.html(this.template(data));
        },
        searchAction: function(event) {
            if (event.keyCode === 13) {
                this.searchCBAction($('#search').val());
                // this.searchInAction($('#search').val());
                console.log('done !!');
            }
        },
        searchCBAction: function(keywords) {
            console.log('search ' + keywords + ' on CB');
            var that = this;
            console.log(this.scb.get('apiUrl'));
            return $.ajax({
                url: 'http://proxy.antoine-martin.me/',
                data: {
                    DeveloperKey: this.scb.get('api_key'),
                    csurl: this.scb.get('apiUrl')
                },
            }).success(function(response) {
                console.log('done ajax scb');
                $(response).find('Results').each(function() {
                    console.log($(this));
                });
            });
        },
        searchInAction: function(keywords) {
            console.log('search ' + keywords + ' on Indeed');
            var that = this;
            console.log(this.sid.get('apiUrl'));
            return $.ajax({
                url: this.sid.get('apiUrl'),
                dataType: "jsonp",
                headers: {
                    'Accept': 'application/json'
                },
                data: {
                    publisher: this.sid.get('api_key'),
                    q: keywords,
                    v: 2
                },
            }).success(function(response) {
                console.log('done ajax sid');
                console.log(response.results[0]);
            });
        }
    });
    return indexView;
});
