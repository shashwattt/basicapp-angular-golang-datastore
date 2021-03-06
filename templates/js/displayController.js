app.controller("displayController", function($scope,$http,$filter) {
	
	function init(){
		$http.get("/api/").success(function(response){
			$scope.conList = [];
			console.log(response);

			response.forEach(function(v,i){
			  $scope.conList.push(JSON.parse(v))
			})
			$scope.conList = JSON.parse(response);
			$scope.cancelSaveUpdate();
		})
	
	}
	init();
	$scope.isDelete = false;
	$scope.showList = true;
	$scope.checkBoxChange = function(bool){
		$scope.isDelete = false;
		for(i=0; i<$scope.conList.length; i++){
			if($scope.conList[i].check){
				$scope.isDelete = true;
				break;
			}
		}
	}
	
	$scope.addNew = function(data){
		$scope.showList = false;
		if(data){
			$scope.name = data.name;
			$scope.number = data.num;
			$scope.id= data.id;
		}
	}
	$scope.deleteData = function(){
		
		var idList = [];
		angular.forEach($scope.conList, function(contact){
			if(contact.check){
				idList.push(contact.id);
			}
		});
		var dataTo = {
				mode : "del",
				list : idList
		}
		
		var request = {
				 method: 'POST',
				 url: '/api/',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: JSON.stringify(dataTo)
			}
		$http(request).success(function(response){
			init();
		})
		
	}
	$scope.callSave = function(){
	
		if($scope.name =='' || $scope.name==undefined){
			alert("Please provide a name.");
			return;
		}else if($scope.number =='' || $scope.number==undefined || isNaN($scope.number)){
			alert("Please input a valid number.");
			$scope.number = '';
			return;
		}else{
			//check duplicate number
			angular.forEach($scope.conList, function(contact){
				if(contact.num==$scope.number){
					alert("Number already exists as " + contact.name);
					return;
				}
			})
		}
		var data = {
			mode : "save",
			data : {
				id : $scope.id,
				name : $scope.name,
				num : $scope.number
			}
		}
		var request = {
				 method: 'POST',
				 url: '/api/',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: JSON.stringify(data)
			}
		$http(request).success(function(response){
			init();
		})
		
	}
	$scope.cancelSaveUpdate = function(){
		$scope.showList = true;
		$scope.name = '';
		$scope.number = '';
		$scope.id='';
	}
	
	
	
})
