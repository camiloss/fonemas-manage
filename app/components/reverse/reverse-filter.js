'use strict';

/* Filters */

angular.module('myApp')
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };

    })
    .filter('fecha', function() {
        return function(fecha) {
            var f = new Date(fecha);
            return f.toLocaleDateString("es", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        };

    })
