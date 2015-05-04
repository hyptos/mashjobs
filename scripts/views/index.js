define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html'
], function($, _, Backbone, IndexTemplate) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $("#app"),
        template: _.template(IndexTemplate),
        events: {},
        initialize: function() {
            // console.log("initialize view search");
            this.render();
        },
        render: function() {
            // console.log('render view search');
            var data = {};
            this.$el.html(this.template(data));
        }
    });
    return indexView;
});
