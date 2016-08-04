app.controller("displayController", function($scope,$http,$filter) {
	
	function init(){
		$scope.conList = [];
		$http.get("/api/").success(function(response){
			
			//console.log(response);

			response.forEach(function(v,i){
			  $scope.conList.push(JSON.parse(v))
			})
			//$scope.conList = JSON.parse(response);
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
			$scope.name = data.Name;
			$scope.number = data.Num;
			$scope.id= data.Id;
		}
	}
	$scope.deleteData = function(){
		
		var idList = [];
		angular.forEach($scope.conList, function(contact){
			if(contact.check){
				idList.push(contact.Id);
			}
		});
		var dataTo = {
				mode : "del",
				idlist : idList
		}
		
		var request = {
				 method: 'POST',
				 url: '/api/',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: JSON.stringify(dataTo)
			}
		$scope.conList = [];
		$http(request).success(function(response){
			setTimeout(function(){init()}, 500);
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
		
			for(i=0; i< $scope.conList.length; i++){
				if($scope.conList[i].Num==$scope.number){
					alert("Number already exists for " + $scope.conList[i].Name);

					return false;
				}
			}


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
			setTimeout(function(){init()}, 500);
		})
		
	}
	$scope.cancelSaveUpdate = function(){
		$scope.showList = true;
		$scope.name = '';
		$scope.number = '';
		$scope.id='';
		$scope.isDelete = false;
	}
	
	
	
})
