(function(angular) {
    "use strict";

    var app = angular.module('myApp.cliente', ['ngRoute',  'firebase']);


    /*************************CONTOLLERS*******************/
    app.controller('ClientesCtrl', ['$scope', 'clienteList', '$location', function($scope, clienteList, $location) {
        $scope.clientes = clienteList;
        $scope.nuevoCliente = function(cliente) {
            $location.path('/cliente/new');
        };
    }]);



    app.controller('ClienteCtrl', ['$scope', '$routeParams', '$firebaseObject',  '$location', 'clienteList',
        function($scope, $routeParams, $firebaseObject,  $location, clienteList) {
            $scope.clienteId = $routeParams.clienteId;
            $scope.nuevoCliente = ($scope.clienteId == 'new');
            $scope.horas = ['16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45'];
            $scope.profesoras = ['María', 'Rocío'];


            if ($scope.nuevoCliente) {
                $scope.cliente = {};
            } else {
                var ref = firebase.database().ref('clientes/'+ $scope.clienteId);
                $scope.cliente = $firebaseObject(ref);
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

 app.controller('FacturasCtrl', ['$scope', 'facturaList', '$location', function($scope, facturaList, $location) {
        $scope.facturas = facturaList;
        $scope.nuevaFactura = function(cliente) {
            $location.path('/factura-edit/new');
        };
    }]);


    app.controller('FacturaViewCtrl', ['$scope', '$routeParams', '$firebaseObject',  '$window',
        function($scope, $routeParams, $firebaseObject, $window) {
            $scope.facturaId = $routeParams.facturaId;
            var ref = firebase.database().ref('facturas/'+ $scope.facturaId);
            $scope.factura = $firebaseObject(ref);
           
            $scope.printFactura = function() {
               $window.print();
               
            };

            $scope.cancel = function(cliente) {
                $window.history.back();
            };


        }
    ]);

    app.controller('FacturaEditCtrl', ['$scope', '$routeParams', '$firebaseObject', '$location','$window', 'clienteList','facturaList',
        function($scope, $routeParams, $firebaseObject,  $location, $window,clienteList,facturaList) {
            $scope.facturaId = $routeParams.facturaId;
            $scope.nuevaFactura = ($scope.facturaId == 'new');

            if ($scope.nuevaFactura) {
                $scope.factura = {
                    emisor: {
                        cif: "83.202.200-B",
                        nombre: "Fonemas Logopedia S.L.",
                        direccion: "Avda. Doctor Garcia Tapia, 145",
                        direccion2: "28030 Madrid"
                    },
                    receptor: {},
                    conceptos: {
                        linea1: {},
                        linea2: {},
                        linea3: {},
                        linea4: {},
                    },
                    total: 0
                };
            } else {
                var ref = firebase.database().ref('facturas/'+ $scope.facturaId);
                $scope.factura = $firebaseObject(ref);
               
                $scope.factura.$loaded().then(function() {
                    //convertir fechas a date
                    $scope.factura.fecha = ($scope.factura.fecha) ? new Date($scope.factura.fecha) : null;
                  
                });
            }

            $scope.clientes = clienteList;
            

            function querySearch(query) {
                var results = query ? $scope.clientes.filter((query)) : [];
                return results;
            }

            $scope.$watch('selectedCliente', function(newValue) {
                if (newValue == null) {
                    return;
                }
                $scope.factura.receptor.numero = newValue.id;
                $scope.factura.receptor.nombre = newValue.name + " " + newValue.surname;
                $scope.factura.receptor.direccion = newValue.address;
                $scope.factura.receptor.nif = "123456789-R";
            });
            $scope.$watch('factura.conceptos', function(newValue) {
                if (newValue == null) {
                    return;
                }
                var total = 0;
                total += (newValue.linea1 && newValue.linea1.importe) ? newValue.linea1.importe : 0;
                total += (newValue.linea2 && newValue.linea2.importe) ? newValue.linea2.importe : 0;
                total += (newValue.linea3 && newValue.linea3.importe) ? newValue.linea3.importe : 0;
                total += (newValue.linea4 && newValue.linea4.importe) ? newValue.linea4.importe : 0;
                $scope.factura.total = total;

            }, true);
            $scope.saveFactura = function() {
                $scope.factura.fecha = ($scope.factura.fecha) ? $scope.factura.fecha.getTime() : 0;
                if ($scope.nuevaFactura) {
                    facturaList.$add($scope.factura);
                } else {
                    $scope.factura.$save();
                }
                $scope.nuevaFactura=false;
                $scope.factura.fecha = ($scope.factura.fecha) ? new Date($scope.factura.fecha) : null;
                $window.history.back();

            };

            $scope.cancel = function(cliente) {
                $window.history.back();
            };
        }
    ]);
    /*******************SERVICES*****************************/
    app.factory('clienteList', [ '$firebaseArray', function( $firebaseArray) {


        var ref = firebase.database().ref().child("clientes");
        return $firebaseArray(ref);
    }]);


    app.factory('facturaList', [ '$firebaseArray', function( $firebaseArray) {
        var ref = firebase.database().ref().child("facturas");
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
          $routeProvider.when('/facturas', {
            templateUrl: 'cliente/facturas.html',
            controller: 'FacturasCtrl'
        });
        $routeProvider.when('/factura/:facturaId', {
            templateUrl: 'cliente/factura.html',
            controller: 'FacturaViewCtrl'
        });
        $routeProvider.when('/factura-edit/:facturaId', {
            templateUrl: 'cliente/factura_edit.html',
            controller: 'FacturaEditCtrl'
        });

    }]);

})(angular);
