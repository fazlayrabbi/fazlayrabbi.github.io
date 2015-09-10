var app= angular.module('app', []);

var something = []

app.controller('MainController', function SimpleController($scope, $http) {

	$scope.address;
	$scope.borough;
	$scope.site_type="";
	$scope.park_site_name;

	$scope.longitude;				//user lng and lat
	$scope.latitude;
	
	$scope.jsonData;				//data of all places
	$scope.list= [];
	
	$scope.getData= function(){
	
		$scope.list= [];
		console.log("Button has been presed");
		
		$scope.getPosition();
		
		$http({ url: 'https://data.cityofnewyork.us/resource/sxx4-xhzg.json', method: 'GET'}).
		success(function(data, status, headers, config){
		
			$scope.jsonData= data;
			
			var dist;
			for(var i=0; i < data.length; i++)
			{
				dist= $scope.distance(data[i].latitude, data[i].longitude, $scope.latitude, $scope.longitude);
				data[i].distance= dist;
					
				$scope.list.push(data[i]);
			}
			
			$scope.list = $scope.list.sort(function(a, b){
					if(a.distance > b.distance){
							return 1;
					}
					if(a.distance < b.distance){
						return -1;
					}
					return 0;
						
			});
			
		
			//console.log(data);
			
		}).
		error(function(data, status, headers, config){
		
		
		});
		
	
	}
	
	$scope.distance= function(lat1, lon1, lat2, lon2) {
				var radlat1 = Math.PI * lat1/180
				var radlat2 = Math.PI * lat2/180
				var radlon1 = Math.PI * lon1/180
				var radlon2 = Math.PI * lon2/180
				var theta = lon1-lon2
				var radtheta = Math.PI * theta/180
				var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				dist = Math.acos(dist)
				dist = dist * 180/Math.PI
				dist = dist * 60 * 1.1515
				return dist
	};
	$scope.googleUrl="https://maps.googleapis.com/maps/api/geocode/json?address=";//1600+Amphitheatre+Parkway,+Mountain+View,+CA
	$scope.Apikey="&key=AIzaSyDVlOqQqTU2Q5p7fhCUwPc_rYt1nEnsEB8";
	$scope.newAddr;
	
	
	$scope.spaceToPlus= function(){
		var len= $scope.address.length;
		var str= $scope.address;
		$scope.newAddr= $scope.address.split(' ').join('+');
	}
	
	
	
	
	$scope.getPosition= function(){
		$scope.spaceToPlus();
		$scope.url= $scope.googleUrl+$scope.newAddr+$scope.Apikey;
		
		$http({url: $scope.url, method: 'GET'}).
		
		success(function(data, status, headers, config){
		
			$scope.latitude=data.results[0].geometry.location.lat;
			$scope.longitude=data.results[0].geometry.location.lng;
			something.push($scope.longitude);
			something.push($scope.latitude);
			
		}).
		error(function(data, status, headers, config){
		
		
		});
	};

});
