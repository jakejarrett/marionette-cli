"use strict";
var Object = Marionette.Object.extend({
    initialize: function(options) {
        console.log('initialize')
    },
    home: function() {
        console.log('home route');
    }
});