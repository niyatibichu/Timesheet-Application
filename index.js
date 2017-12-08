(function () {
    'use strict';
    var app = angular.module('myapp', ['ui.bootstrap']);

    app.controller('TableController', ['$scope', '$http', '$log', function ($scope, $http, $filter, $q, $log) {

        console.log("in controller...");
        $scope.newUser = {};
        $scope.info = "";
         $scope.temp={};
        //get already existing rows in json
        $scope.users = [];
        $http({
            method: 'GET',
            url: '/show'
        }).then(function successCallback(response) {
            $scope.users = response.data;
            //console.log($scope.users[0]);
        }, function errorCallback(response) {

        });


        //Datepicker

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };


        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = 'MM/dd/yyyy';
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }


        //timepicker for fromtime
        $scope.from = $scope.dt;

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update1 = function () {
            var d1 = $scope.dt;
            d1.setHours(14);
            d1.setMinutes(0);
            $scope.from = d1;
        };

        $scope.changed1 = function () {
            $log.log('Time changed to: ' + $scope.from);
        };

        $scope.clear = function () {
            $scope.from = null;
        };

        //timepicker for totime
        $scope.to = $scope.dt;

        $scope.update2 = function () {
            var d2 = $scope.dt;
            d2.setHours(14);
            d2.setMinutes(0);
            $scope.to = d2;
        };

        $scope.changed2 = function () {
            $log.log('Time changed to: ' + $scope.to);
        };

        $scope.clear = function () {
            $scope.to = null;
        };

        //crud

        $scope.selectUser = function (user) {
            $scope.clickedUser = user;
        };

        //save a user
        $scope.saveUser = function () {
            console.log("Saving...");
            //$scope.users.push($scope.newUser);
            $http({
                method: 'POST',
                url: '/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "name": $scope.newUser.name,
                    "dt": $scope.newUser.dt,
                    "from": $scope.newUser.from,
                    "to": $scope.newUser.to,
                    "comments": $scope.newUser.comments
                }
            }).then(function successCallback(response) {
                //console.log("Row added to backend array as well!"+JSON.stringify(response));
               
                for(var i=0;i<response.length;i++){
                    scope.temp.name=JSON.stringify(response[i].name);
                    scope.temp.dt=JSON.stringify(response[i].dt);
                    scope.temp.from=JSON.stringify(response[i].from);
                    scope.temp.to=JSON.stringify(response[i].to);
                    scope.temp.comments=JSON.stringify(response[i].comments);
                    $scope.users.push($scope.temp);
                }
                console.log("users object looks like this"+JSON.stringify($scope.users));
                
            }, function errorCallback(response) {
                console.log("ERROR"+response);
            });
            $scope.info = "New User Added Successfully!";
            //alert($scope.info);
            //$scope.users.push($scope.newUser);
            //console.log($scope.users);
            //console.log($scope.info);
            $scope.newUser = {};
        };


        //delete a user
        $scope.deleteUser = function () {
            console.log($scope.clickedUser);
             $http({
                method: 'POST',
                url: '/remove',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "name": $scope.clickedUser.name,
                    "dt": $scope.clickedUser.dt,
                    "from": $scope.clickedUser.from,
                    "to": $scope.clickedUser.to,
                    "comments": $scope.clickedUser.comments
                }
            }).then(function successCallback(response) {
                console.log("Row added to backend array as well!"+JSON.stringify(response));
               
                
            }, function errorCallback(response) {
                console.log("ERROR"+response);
            });
            $scope.users.splice($scope.users.indexOf($scope.clickedUser), 1);
            $scope.info = "User Deleted Successfully!";
           
        };

        $scope.clearInfo = function () {
            $scope.info = "";
        };


    }]);

})();

