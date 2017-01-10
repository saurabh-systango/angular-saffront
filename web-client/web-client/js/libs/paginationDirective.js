var app = angular.module('pagination', ['ui.bootstrap']);

app.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

app.controller('PageCtrl', ['$scope', 'filterFilter', function ($scope, filterFilter) {
	$scope.items = [{
		"name": "name 1",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 2",
			"category": [{
			"category": "engineering"
		}],
			"branch": "West"
	}, {
		"name": "name 3",
			"category": [{
			"category": "management"
		}, {
			"category": "engineering"
		}],
			"branch": "West"
	}, {
		"name": "name 4",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 5",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "name 6",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "name 7",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "name 8",
			"category": [{
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 9",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "name 10",
			"category": [{
			"category": "management"
		}],
			"branch": "East"
	}, {
		"name": "name 11",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "name 12",
			"category": [{
			"category": "engineering"
		}],
			"branch": "West"
	}, {
		"name": "name 13",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 14",
			"category": [{
			"category": "engineering"
		}],
			"branch": "East"
	}, {
		"name": "name 15",
			"category": [{
			"category": "management"
		}, {
			"category": "engineering"
		}],
			"branch": "East"
	}, {
		"name": "name 16",
			"category": [{
			"category": "management"
		}],
			"branch": "West"
	}, {
		"name": "name 17",
			"category": [{
			"category": "management"
		}],
			"branch": "East"
	}, {
		"name": "name 18",
			"category": [{
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 19",
			"category": [{
			"category": "business"
		}],
			"branch": "West"
	}, {
		"name": "name 20",
			"category": [{
			"category": "engineering"
		}],
			"branch": "East"
	}, {
		"name": "Peter",
			"category": [{
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "Frank",
			"category": [{
			"category": "management"
		}],
			"branch": "East"
	}, {
		"name": "Joe",
			"category": [{
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "Ralph",
			"category": [{
			"category": "management"
		}, {
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "Gina",
			"category": [{
			"category": "business"
		}],
			"branch": "East"
	}, {
		"name": "Sam",
			"category": [{
			"category": "management"
		}, {
			"category": "engineering"
		}],
			"branch": "East"
	}, {
		"name": "Britney",
			"category": [{
			"category": "business"
		}],
			"branch": "West"
	}];

	// create empty search model (object) to trigger $watch on update
	$scope.search = {};

	$scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};

	// pagination controls
	$scope.currentPage = 1;
	$scope.totalItems = $scope.items.length;
	$scope.entryLimit = 8; // items per page
	$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

	// $watch search to update pagination
	$scope.$watch('search', function (newVal, oldVal) {
		$scope.filtered = filterFilter($scope.items, newVal);
		$scope.totalItems = $scope.filtered.length;
		$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		$scope.currentPage = 1;
	}, true);
}]);