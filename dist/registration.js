(function() {
  var module;

  module = angular.module('sportily-registration', ['sportily-registration-templates']);

  module.directive('sportilyRegistration', function() {
    return {
      restrict: 'E',
      controller: 'SportilyRegistrationCtrl',
      templateUrl: 'templates/registration.html',
      scope: {
        successFn: '&success'
      }
    };
  });

  module.controller('SportilyRegistrationCtrl', function($scope) {
    var saveMember, savePerson, saveRoles, saveUser;
    $scope.user = {};
    $scope.person = {};
    $scope.roles = [
      {
        type: null
      }
    ];
    $scope.types = {
      player: 'Player',
      manager: 'Manager',
      official: 'Official'
    };
    $scope.organisations = [
      {
        id: 1,
        name: 'BIPHA South'
      }, {
        id: 2,
        name: 'BIPHA Central'
      }
    ];
    $scope.teams = [
      {
        id: 1,
        organisation_id: 1,
        name: 'Crusaders',
        age_group_id: 1
      }, {
        id: 2,
        organisation_id: 1,
        name: 'Valley Commandoes',
        age_group_id: 1
      }, {
        id: 3,
        organisation_id: 1,
        name: 'Farnborough Arrows',
        age_group_id: 2
      }, {
        id: 4,
        organisation_id: 1,
        name: 'Farnborough Arrows',
        age_group_id: 3
      }, {
        id: 5,
        organisation_id: 2,
        name: 'Khaos',
        age_group_id: 1
      }, {
        id: 6,
        organisation_id: 2,
        name: 'Hallamshire Cyclones',
        age_group_id: 1
      }, {
        id: 7,
        organisation_id: 2,
        name: 'Norton Cyclones',
        age_group_id: 2
      }, {
        id: 8,
        organisation_id: 2,
        name: 'Norton Cyclones',
        age_group_id: 3
      }
    ];
    $scope.ageGroups = {
      1: 'Seniors',
      2: 'Junior',
      3: 'Under 16'
    };
    $scope.addRole = function() {
      return $scope.roles.push({
        type: 'player'
      });
    };
    $scope.removeRole = function(toBeRemoved) {
      return $scope.roles = $scope.roles.filter(function(role) {
        return role !== toBeRemoved;
      });
    };
    saveUser = function() {
      if ($scope.user.email) {
        return users.post($scope.user);
      } else {
        return $q.when({
          id: null
        });
      }
    };
    savePerson = function(user) {
      $scope.person.user_id = user.id;
      if ($scope.state.dateOfBirth) {
        $scope.person.date_of_birth = moment($scope.state.dateOfBirth).format('YYYY-MM-DD');
      }
      return people.post($scope.person);
    };
    saveMember = function(person) {
      $scope.member.person_id = person.id;
      return members.post($scope.member);
    };
    saveRoles = function(member) {
      return $scope.roles.forEach(function(role) {
        role.member_id = member.id;
        return roles.post(role);
      });
    };
    return $scope.save = function() {
      return $scope.successFn();

      /*saveUser()
          .then(savePerson)
          .then(saveMember)
          .then(saveRoles)
       */
    };
  });

}).call(this);
