(function() {
  var module;

  module = angular.module('sportily.registration', ['sportily.registration.controller', 'sportily.registration.directive', 'sportily.registration.filters', 'sportily.registration.templates', 'sportily.registration.forms']);

}).call(this);

(function() {
  var NO_VALID_ROLES_MESSAGE, module;

  module = angular.module('sportily.registration.controller', ['sportily.api', 'sportily.registration.types', 'sportily.registration.forms']);

  NO_VALID_ROLES_MESSAGE = 'Please select at least one valid role.';

  module.controller('SportilyRegistrationCtrl', [
    '$scope', '$q', 'Form', 'AgeGroups', 'Competitions', 'Members', 'People', 'Roles', 'Teams', 'Types', 'Users', function($scope, $q, Form, AgeGroups, Competitions, Members, People, Roles, Teams, Types, Users) {
      var fetchAgeGroups, fetchCompetitions, fetchTeams, roleIsValid, saveMember, savePerson, saveRoles, saveUser, verifyRoles;
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
      $scope.complete = false;
      $scope.types = Types;
      $scope.typeOptions = _(Types).map(function(value, key) {
        return {
          key: key,
          label: value.name,
          index: value.index
        };
      }).sortBy('index').value();
      $scope.state = {
        agreement: false,
        dateOfBirth: null
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
      roleIsValid = function(role) {
        return role.competition_id && role.type;
      };
      verifyRoles = function() {
        var valid;
        valid = _.some($scope.roles, roleIsValid);
        if (!valid) {
          throw NO_VALID_ROLES_MESSAGE;
        }
      };
      $scope.save = function() {
        return Form.isValid($scope).then(verifyRoles).then(saveUser).then(savePerson).then(saveMember).then(saveRoles).then(function() {
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
      fetchTeams();
      return $scope.$watch('state.dateOfBirth', function(value) {
        var dob, input, output;
        input = 'DD/MM/YYYY';
        output = 'YYYY-MM-DD';
        dob = (function() {
          switch (false) {
            case !(value instanceof Date):
              return moment(value);
            default:
              return moment(value, input, true);
          }
        })();
        if (dob.isValid()) {
          $scope.person.date_of_birth = dob.format(output);
        }
        return $scope.form['date_of_birth'].$setValidity('date', dob.isValid());
      });
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
      index: 1,
      name: 'Player',
      requiresTeam: true
    },
    coach: {
      index: 2,
      name: 'Coach',
      requiresTeam: true
    },
    manager: {
      index: 3,
      name: 'Manager',
      requiresTeam: true
    },
    official: {
      index: 4,
      name: 'Non-Bench Official'
    },
    committee: {
      index: 5,
      name: 'Regional Committee'
    },
    referee: {
      index: 6,
      name: 'Referee'
    },
    timekeeper: {
      index: 7,
      name: 'Timekeeper'
    },
    player_training: {
      index: 8,
      name: 'Player (Training)',
      requiresTeam: true
    },
    player_recreational: {
      index: 9,
      name: 'Player (Recreational)',
      requiresTeam: true
    },
    parent: {
      index: 10,
      name: 'Parent',
      requiresTeam: true
    }
  });

}).call(this);
