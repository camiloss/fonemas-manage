(function(angular) {
    "use strict";

    var app = angular.module('myApp.cliente', ['ngRoute', 'firebase.utils', 'firebase']);


    /*************************CONTOLLERS*******************/
    app.controller('ClientesCtrl', ['$scope', 'clienteList', '$location', function($scope, clienteList, $location) {
        $scope.clientes = clienteList;
        $scope.nuevoCliente = function(cliente) {
            $location.path('/cliente/new');
        };
    }]);



    app.controller('ClienteCtrl', ['$scope', '$routeParams', '$firebaseObject', 'fbutil', '$location', 'clienteList',
        function($scope, $routeParams, $firebaseObject, fbutil, $location, clienteList) {
            $scope.clienteId = $routeParams.clienteId;
            $scope.nuevoCliente = ($scope.clienteId == 'new');
            $scope.horas = ['16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45'];
            $scope.profesoras = ['María', 'Rocío'];


            if ($scope.nuevoCliente) {
                $scope.cliente = {};
            } else {
                $scope.cliente = $firebaseObject(fbutil.ref('clientes', $scope.clienteId));
                $scope.cliente.$loaded().then(function() {
                    //convertir fechas a date
                    $scope.cliente.fecha_nacimiento = ($scope.cliente.fecha_nacimiento) ? new Date($scope.cliente.fecha_nacimiento) : null;
                    if ($scope.cliente.tratamiento) {
                        $scope.cliente.tratamiento.fecha_inicio = ($scope.cliente.tratamiento.fecha_inicio) ? new Date($scope.cliente.tratamiento.fecha_inicio) : null;
                        $scope.cliente.tratamiento.fecha_alta = ($scope.cliente.tratamiento.fecha_alta) ? new Date($scope.cliente.tratamiento.fecha_alta) : null;
                    }
                });
            }


            $scope.saveCliente = function() {
                // convertir dates a timestamp
                $scope.cliente.fecha_nacimiento = ($scope.cliente.fecha_nacimiento) ? $scope.cliente.fecha_nacimiento.getTime() : 0;
                if ($scope.cliente.tratamiento) {
                    $scope.cliente.tratamiento.fecha_inicio = ($scope.cliente.tratamiento.fecha_inicio) ? $scope.cliente.tratamiento.fecha_inicio.getTime() : 0;
                    $scope.cliente.tratamiento.fecha_alta = ($scope.cliente.tratamiento.fecha_alta) ? $scope.cliente.tratamiento.fecha_alta.getTime() : 0;
                }

                if ($scope.nuevoCliente) {
                    clienteList.$add($scope.cliente);
                } else {
                    $scope.cliente.$save();
                }
                $location.path('/clientes');
            };

            $scope.cancelCliente = function(cliente) {
                $location.path('/clientes');
            };


        }
    ]);

    app.controller('FacturaCtrl', ['$scope', '$routeParams', '$firebaseObject', 'fbutil', '$location', 'clienteList',
        function($scope, $routeParams, $firebaseObject, fbutil, $location, clienteList) {

            $scope.factura = {
                numero: "1231",
                fecha: "31-12-2001",
                emisor: {
                    cif: "83.202.200-B",
                    nombre: "Fonemas Logopedia S.L.",
                    direccion: "Avda. Doctor Garcia Tapia, 145",
                    direccion2: "28030 Madrid"
                },
                receptor: {
                    numero: "123",
                    nombre: "Lidia Ranz Fernández",
                    direccion: "bla bla bla",
                    nif: "123456789-R"
                },
                conceptos: {
                    linea1: {
                        concepto: "Sesiones de logopedia de Febrero 2000",
                        importe: 180
                    }
                },
                total: 180
            };

            $scope.saveFactura = function() {
                // convertir dates a timestamp
                $scope.cliente.fecha_nacimiento = ($scope.cliente.fecha_nacimiento) ? $scope.cliente.fecha_nacimiento.getTime() : 0;
                if ($scope.cliente.tratamiento) {
                    $scope.cliente.tratamiento.fecha_inicio = ($scope.cliente.tratamiento.fecha_inicio) ? $scope.cliente.tratamiento.fecha_inicio.getTime() : 0;
                    $scope.cliente.tratamiento.fecha_alta = ($scope.cliente.tratamiento.fecha_alta) ? $scope.cliente.tratamiento.fecha_alta.getTime() : 0;
                }

                if ($scope.nuevoCliente) {
                    clienteList.$add($scope.cliente);
                } else {
                    $scope.cliente.$save();
                }
                $window.history.back();
            };

            $scope.cancel = function(cliente) {
                $window.history.back();
            };


        }
    ]);

    app.controller('FacturaEditCtrl', ['$scope', '$routeParams', '$firebaseObject', 'fbutil', '$location', 'clienteList',
        function($scope, $routeParams, $firebaseObject, fbutil, $location, clienteList) {

            $scope.clientes = clienteList;
            $scope.factura = {
                emisor: {
                    cif: "83.202.200-B",
                    nombre: "Fonemas Logopedia S.L.",
                    direccion: "Avda. Doctor Garcia Tapia, 145",
                    direccion2: "28030 Madrid"
                },
                receptor: {}
            };
            var self = this;

            function querySearch(query) {
                var results = query ? $scope.clientes.filter((query)) : [];
                return results;
            }
            $scope.$watch('selectedCliente', function( newValue) {
                 $scope.factura.receptor.numero = newValue.id;
                 $scope.factura.receptor.nombre = newValue.name + " " + newValue.surname;
                 $scope.factura.receptor.direccion = newValue.address;
                 $scope.factura.receptor.nif = "123456789-R";
            });
            $scope.saveFactura = function() {};

            $scope.cancel = function(cliente) {
                $window.history.back();
            };
        }
    ]);
    /*******************SERVICES*****************************/
    app.factory('clienteList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
        var ref = fbutil.ref('clientes').limitToLast(10);
        return $firebaseArray(ref);
    }]);
    app.factory('facturas', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
        var ref = fbutil.ref('clientes').limitToLast(10);
        return $firebaseArray(ref);
    }]);
    /*******************ROUTING*****************************/
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/clientes', {
            templateUrl: 'cliente/lista_clientes.html',
            controller: 'ClientesCtrl'
        });

        $routeProvider.when('/cliente/:clienteId', {
            templateUrl: 'cliente/detalle_cliente.html',
            controller: 'ClienteCtrl'
        });

        $routeProvider.when('/factura/:facturaId', {
            templateUrl: 'cliente/factura.html',
            controller: 'FacturaCtrl'
        });
        $routeProvider.when('/factura-edit/:facturaId', {
            templateUrl: 'cliente/factura_edit.html',
            controller: 'FacturaEditCtrl'
        });

    }]);

})(angular);
