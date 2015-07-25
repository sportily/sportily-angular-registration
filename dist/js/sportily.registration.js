(function() {
  var module;

  module = angular.module('sportily.registration', ['sportily.registration.controller', 'sportily.registration.directive', 'sportily.registration.filters', 'sportily.registration.templates', 'sportily.registration.forms']);

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.controller', ['sportily.api', 'sportily.registration.types', 'sportily.registration.forms']);

  module.controller('SportilyRegistrationCtrl', [
    '$scope', '$q', 'Form', 'AgeGroups', 'Competitions', 'Members', 'People', 'Roles', 'Teams', 'Types', 'Users', function($scope, $q, Form, AgeGroups, Competitions, Members, People, Roles, Teams, Types, Users) {
      var fetchAgeGroups, fetchCompetitions, fetchTeams, saveMember, savePerson, saveRoles, saveUser;
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
      $scope.types = Types;
      $scope.complete = false;
      $scope.state = {
        agreement: false
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
        return Form.isValid($scope).then(saveUser).then(savePerson).then(saveMember).then(saveRoles).then(function() {
          return $scope.complete = true;
        })["catch"](Form.showErrors($scope));
      };
      fetchCompetitions = function() {
        var filter;
        filter = {
          season_id: $scope.seasonId,
          include: 'organisation'
        };
        return Competitions.getList(filter).then(function(competitions) {
          return $scope.competitions = competitions;
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
          season_id: $scope.seasonId
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
      fetchCompetitions();
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
      templateUrl: 'templates/sportily/registration/form.html',
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

  module.filter('forCompetition', function() {
    return function(teams, id) {
      return _.filter(teams, function(team) {
        return _.some(team.competitions.data, {
          id: id
        });
      });
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.forms', []);

  String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  module.directive('serverError', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        model: '=ngModel'
      },
      link: function(scope, element, attrs, ngModel) {
        return scope.$watch('model', function() {
          return _.each(ngModel.$error, function(value, key) {
            if (key.startsWith('validation.')) {
              return ngModel.$setValidity(key, true);
            }
          });
        });
      }
    };
  });

  module.directive('errors', function() {
    return {
      restrict: 'E',
      require: ['^form', '^field'],
      templateUrl: 'templates/sportily/registration/errors.html'
    };
  });

  module.directive('info', function() {
    return {
      restrict: 'E',
      require: ['^form', '^field'],
      transclude: true,
      templateUrl: 'templates/sportily/registration/info.html',
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        scope.form = ctrl[0];
        return scope.name = ctrl[1].name();
      }
    };
  });

  module.directive('field', function() {
    return {
      restrict: 'E',
      require: '^form',
      transclude: true,
      templateUrl: 'templates/sportily/registration/field.html',
      scope: {
        name: '@',
        label: '@'
      },
      link: function(scope, element, attrs, form) {
        scope.form = form;
        return scope.displayLabel = (function() {
          switch (scope.label) {
            case void 0:
              return scope.name.ucfirst().replace('_', ' ');
            case 'empty':
              return '';
            case 'none':
              return '';
            default:
              return scope.label;
          }
        })();
      },
      controller: [
        '$scope', function($scope) {
          this.name = function() {
            return $scope.name;
          };
          this.label = function() {
            return $scope.label;
          };
        }
      ]
    };
  });

  module.factory('Form', function($window, $q) {
    return {
      showErrors: function(scope) {
        return function(response) {
          $window.scrollTo(0, 0);
          if (response.data) {
            scope.error = response.data.error_description;
            return _.each(response.data.validation_messages, function(errors, key) {
              return _.each(errors, function(error) {
                return scope.form[key].$setValidity(error, false);
              });
            });
          } else {
            return scope.error = response;
          }
        };
      },
      isValid: function(scope) {
        if (scope.form.$valid) {
          return $q.when();
        } else {
          return $q.reject('There are errors in the form.');
        }
      }
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.registration.types', []);

  module.constant('Types', {
    player: {
      name: 'Player',
      requiresTeam: true
    },
    player_training: {
      name: 'Player (Training)',
      requiresTeam: true
    },
    player_recreational: {
      name: 'Player (Recreational)',
      requiresTeam: true
    },
    manager: {
      name: 'Manager',
      requiresTeam: true
    },
    coach: {
      name: 'Coach',
      requiresTeam: true
    },
    referee: {
      name: 'Referee'
    },
    timekeeper: {
      name: 'Timekeeper'
    },
    official: {
      name: 'Non-Bench Official'
    },
    committee: {
      name: 'Regional Committee'
    },
    parent: {
      name: 'Parent',
      requiresTeam: true
    }
  });

}).call(this);
