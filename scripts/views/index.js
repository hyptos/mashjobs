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
            // console.log('render view search');
            var data = {
                scb: this.scb,
                sid: this.sid
            };
            this.$el.html(this.template(data));
        },
        searchAction: function(event) {
            if (event.keyCode === 13) {
                this.searchCBAction($('#search').val());
            }
        },
        searchCBAction: function(keywords) {
            console.log('search ' + keywords + ' on CB');
            var that = this;
            console.log(this.scb.get('apiUrl'));
            $.ajax({
                url: this.scb.get('apiUrl'),
                dataType: "jsonp text",
                data: {
                    DeveloperKey: this.scb.get('api_key'),
                },
            }).success(function(response) {
                console.log('done ajax scb');
                console.log(response);
            });
        }
    });
    return indexView;
});
