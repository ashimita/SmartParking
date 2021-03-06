(function() {
    'use strict';

    angular.module('SmartParkingApp', ['angular-websocket'])
        .factory('ParkingTimer', function($interval) {
            return function(delay) {
                var initialMs = (new Date()).getTime();
                var result = {
                    totalMilliseconds: 0
                };
                $interval(function() {
                    var millisec = (new Date()).getTime() - initialMs;
                    result.totalMilliseconds = getYoutubeLikeDisplay(millisec);
                }, delay);
                return result;
            };
        })
        .controller('SmartParkingController', SmartParkingController)

    SmartParkingController.$inject = ['$scope', '$websocket', 'ParkingTimer'];

    function SmartParkingController($scope, $websocket, ParkingTimer) {

        var nTables = 3;
        var nCols = 10;

      $scope.createParkingLot = createParkingLot(nTables, nCols);

       // var ws = $websocket('ws://192.168.100.158:8181/SmartParkingHome/websocket');
        var ws = $websocket('ws://istuaryiot.azurewebsites.net/SmartParkingHome/websocket');

        ws.onMessage(function(event) {
                var data = JSON.parse(event.data);
                Object.keys(data).forEach(function(k) {
                    var hightlightNumber = data[k][0];

                    var array = $scope.createParkingLot;
                    var tableArray = array[getTableNumber(hightlightNumber, nCols)];
                    var i = getRowNumber(hightlightNumber);
                    var j =  getColumNumber(hightlightNumber, nCols);
                    if (k === "slot") {
                        tableArray[i][j].color = "btn btn-danger istuary-btn-custom";
                        tableArray[i][j].timer = ParkingTimer(1000);
                    } else if (k === "empty") {
                        tableArray[i][j].color = "btn btn-success istuary-btn-custom";
                        tableArray[i][j].timer = ""
                    }
                });
            }

        );
    }

    function getTableNumber(slotNumber, nCols) {
      var tableSize = nCols * 2;
      var tableNum = 0;
      while (slotNumber > tableSize) {
        slotNumber -= tableSize;
        tableNum++;
      }
      return tableNum;
    }

    function getRowNumber(slotNumber) {
      return ((slotNumber % 2 === 0) ? 1 : 0);
    }

    function getColumNumber(slotNumber, nCols) {
      slotNumber = (slotNumber - 1 ) % (2 * nCols);
      return Math.floor(slotNumber / 2);
    }

    function getYoutubeLikeDisplay(millisec) {
        var seconds = (millisec / 1000).toFixed(0);
        var minutes = Math.floor(seconds / 60);
        var hours = "";
        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = (hours >= 10) ? hours : "0" + hours;
            minutes = minutes - (hours * 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
        }

        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        if (hours != "") {
            return hours + ":" + minutes + ":" + seconds;
        }
        return minutes + ":" + seconds;
    }

    function createParkingLot(nTables, nCols) {
      var tempLabel = 1;
      var arr = [];
      for(var i=0; i< nTables; i++) {
        tempLabel = 1+ (i * 2 * nCols);
        arr[i] = (matrix(2, nCols, tempLabel));
      }
      return arr;
    }

    function matrix(rows, cols, tempLabel) {
        var arr = [];

          for (var i = 0; i < rows; i++) {
            // Creates an empty line
            arr.push([]);
            arr[i].push(new Array(cols));
          }
        // Creates all lines:
        for (var i = 0; i < cols; i++) {
          for (var j = 0; j < rows; j++) {
                arr[j][i] = {
                    "label": tempLabel,
                    "color": "btn btn-success istuary-btn-custom"
                }
                tempLabel++;
            }

        }
        return arr;
    }

})();
