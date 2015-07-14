(function() {
  var module;

  module = angular.module('sportily.registration', ['sportily.registration.controller', 'sportily.registration.directive', 'sportily.registration.filters', 'sportily.registration.templates']);

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.controller', ['sportily.api']);

  module.controller('SportilyRegistrationCtrl', [
    '$scope', '$q', 'AgeGroups', 'Members', 'Organisations', 'People', 'Roles', 'Teams', 'Users', function($scope, $q, AgeGroups, Members, Organisations, People, Roles, Teams, Users) {
      var fetchAgeGroups, fetchOrganisations, fetchTeams, saveMember, savePerson, saveRoles, saveUser;
      $scope.user = {};
      $scope.person = {};
      $scope.member = {
        season_id: $scope.seasonId
      };
      $scope.roles = [
        {
          type: null
        }
      ];
      $scope.state = {
        dateOfBirth: null
      };
      $scope.types = {
        player: 'Player',
        manager: 'Manager',
        official: 'Official'
      };
      $scope.addRole = function() {
        return $scope.roles.push({
          type: null
        });
      };
      $scope.removeRole = function(toBeRemoved) {
        return $scope.roles = $scope.roles.filter(function(role) {
          return role !== toBeRemoved;
        });
      };
      $scope.save = function() {
        return saveUser().then(savePerson).then(saveMember).then(saveRoles);
      };
      fetchOrganisations = function() {
        var filter;
        filter = {
          registration_id: $scope.registrationId
        };
        return Organisations.getList(filter).then(function(organisations) {
          return $scope.organisations = organisations;
        });
      };
      fetchAgeGroups = function() {
        var filter;
        filter = {
          season_id: $scope.seasonId
        };
        return AgeGroups.getList(filter).then(function(ageGroups) {
          return $scope.ageGroups = ageGroups;
        });
      };
      fetchTeams = function() {
        var filter;
        filter = {
          registration_id: $scope.registrationId
        };
        return Teams.getList(filter).then(function(teams) {
          return $scope.teams = teams;
        });
      };
      saveUser = function() {
        if ($scope.user.email) {
          return Users.post($scope.user);
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
        return People.post($scope.person);
      };
      saveMember = function(person) {
        $scope.member.person_id = person.id;
        return Members.post($scope.member);
      };
      saveRoles = function(member) {
        return $scope.roles.forEach(function(role) {
          role.member_id = member.id;
          return Roles.post(role);
        });
      };
      fetchOrganisations();
      fetchAgeGroups();
      return fetchTeams();
    }
  ]);

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.directive', []);

  module.directive('sportilyRegistration', function() {
    return {
      restrict: 'E',
      controller: 'SportilyRegistrationCtrl',
      templateUrl: 'templates/sportily/registration/registration.html',
      scope: {
        registrationId: '@registration',
        seasonId: '@season'
      }
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.filters', []);

  module.filter('forOrganisation', function() {
    return function(teams, id) {
      return _.filter(teams, function(team) {
        return _.some(team.competitions.data, {
          organisation_id: id
        });
      });
    };
  });

}).call(this);
