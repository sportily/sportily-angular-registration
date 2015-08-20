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
      $scope.types = Types;
      $scope.complete = false;
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

angular.module('sportily.registration.templates', ['templates/sportily/registration/errors.html', 'templates/sportily/registration/field.html', 'templates/sportily/registration/form.contact.html', 'templates/sportily/registration/form.html', 'templates/sportily/registration/form.personal.html', 'templates/sportily/registration/form.roles.html', 'templates/sportily/registration/info.html']);

angular.module("templates/sportily/registration/errors.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/errors.html",
    "<p class=\"help-block error\"\n" +
    "    ng-if=\"form[name].$touched || form.$submitted\"\n" +
    "    ng-repeat=\"(key, value) in form[name].$error\"\n" +
    "    ng-switch=\"key\">\n" +
    "\n" +
    "    <!-- client-side -->\n" +
    "    <span ng-switch-when=\"date\">Dates must be in the dd/mm/yyyy format</span>\n" +
    "    <span ng-switch-when=\"email\">Invalid email address</span>\n" +
    "    <span ng-switch-when=\"required\">Required field</span>\n" +
    "\n" +
    "    <!-- server-side -->\n" +
    "    <span ng-switch-when=\"validation.email\">Invalid email address</span>\n" +
    "    <span ng-switch-when=\"validation.required\">Required field</span>\n" +
    "    <span ng-switch-when=\"validation.unique\">{{:: label }} is already taken</span>\n" +
    "\n" +
    "    <!-- default for any we missed -->\n" +
    "    <span ng-switch-default>{{:: key }}</span>\n" +
    "\n" +
    "</p>\n" +
    "");
}]);

angular.module("templates/sportily/registration/field.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/field.html",
    "<div class=\"form-group\" ng-class=\"{ 'has-error': form[name].$invalid && (form[name].$touched || form.$submitted) }\">\n" +
    "    <label for=\"{{ name }}\" ng-if=\"label != 'none'\">{{ displayLabel }}&nbsp;</label>\n" +
    "    <ng-transclude></ng-transclude>\n" +
    "    <errors name=\"{{ name }}\"></errors>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.contact.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.contact.html",
    "<h3>Contact Details</h3>\n" +
    "\n" +
    "<!-- email address -->\n" +
    "<field name=\"email\" label=\"Email address\">\n" +
    "    <input type=\"email\" class=\"form-control\"\n" +
    "        name=\"email\"\n" +
    "        ng-model=\"user.email\"\n" +
    "        required\n" +
    "        autocomplete=\"off\"\n" +
    "        server-error>\n" +
    "    <info>Email address will <em>never</em> be shown publicly.</info>\n" +
    "</field>\n" +
    "\n" +
    "<field name=\"street_address\">\n" +
    "    <input type=\"text\" class=\"form-control\" name=\"street_address\" ng-model=\"person.street_address\">\n" +
    "</field>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"city\">Town/city</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"city\" ng-model=\"person.city\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"province\">County/region</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"province\" ng-model=\"person.province\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"postcode\">Postcode</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"postcode\" ng-model=\"person.postcode\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"phone_number\">Phone number</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"phone_number\" ng-model=\"person.phone_number\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"mobile_number\">Mobile number</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"mobile_number\" ng-model=\"person.mobile_number\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.html",
    "<form name=\"form\" novalidate>\n" +
    "\n" +
    "    <div class=\"alert alert-danger\" ng-if=\"error\">{{ error }}</div>\n" +
    "\n" +
    "    <div ng-if=\"!complete\">\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.personal.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.roles.html'\"></div>\n" +
    "        <div ng-include=\"'templates/sportily/registration/form.contact.html'\"></div>\n" +
    "\n" +
    "        <field name=\"agreement\" label=\"none\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"state.agreement\">\n" +
    "                I agree to abide by BIPHA Rules, Byelaws, Code of Conduct and\n" +
    "                Child Protection Policy.\n" +
    "            </label>\n" +
    "        </field>\n" +
    "\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"save()\" ng-disabled=\"!state.agreement\">Register</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"complete\">\n" +
    "        <p>Thank you for registering to participate in the 2015-2015 season.\n" +
    "        We've just sent you a confirmation email containing instructions of how\n" +
    "        to verify your account to complete the registration process.</p>\n" +
    "    </div>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.personal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.personal.html",
    "<!-- name -->\n" +
    "<field name=\"given_name\" label=\"Forename\" class=\"form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"given_name\"\n" +
    "        ng-model=\"person.given_name\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "<field name=\"family_name\" label=\"Surname\" class=\"form-group\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"family_name\"\n" +
    "        ng-model=\"person.family_name\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "\n" +
    "\n" +
    "<!-- date of birth -->\n" +
    "<field name=\"date_of_birth\">\n" +
    "    <input type=\"date\" class=\"form-control\"\n" +
    "        name=\"date_of_birth\"\n" +
    "        ng-model=\"state.dateOfBirth\"\n" +
    "        placeholder=\"dd/mm/yyyy\"\n" +
    "        required\n" +
    "        server-error>\n" +
    "</field>\n" +
    "\n" +
    "<!-- medical conditions -->\n" +
    "<field name=\"medical_conditions\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"medical_conditions\"\n" +
    "        ng-model=\"person.medical_conditions\"\n" +
    "        placeholder=\"e.g. Asthma\"\n" +
    "        server-error>\n" +
    "    <info>If member has no relevant medical conditions, please indicate 'None'.</info>\n" +
    "</field>\n" +
    "\n" +
    "<!-- dbs number -->\n" +
    "<field name=\"dbs number\" label=\"DBS registration number\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "        name=\"dbs_number\"\n" +
    "        ng-model=\"person.dbs_number\"\n" +
    "        server-error>\n" +
    "    <info>A valid DBS registration is required for all officials aged 16 year or older.</info>\n" +
    "</field>\n" +
    "");
}]);

angular.module("templates/sportily/registration/form.roles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/form.roles.html",
    "<h3>League Roles</h3>\n" +
    "\n" +
    "<div class=\"form-inline form-group\" ng-repeat=\"role in roles\">\n" +
    "\n" +
    "    <label>Role #{{ $index + 1 }}:</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"c.id as c.organisation.name for c in competitions\"\n" +
    "            ng-model=\"role.competition_id\">\n" +
    "            <option value=\"\">Region&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"role.competition_id\">\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"key as type.name for (key, type) in types\"\n" +
    "            ng-model=\"role.type\">\n" +
    "            <option value=\"\">Role&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"role.competition_id && types[role.type].requiresTeam\">\n" +
    "        <span>for</span>\n" +
    "        <select class=\"form-control\"\n" +
    "            ng-options=\"team.id as team.name + ' (' + ageGroups.lookup[team.age_group_id].name + ')' for team in teams|forCompetition:role.competition_id\"\n" +
    "            ng-model=\"role.team_id\">\n" +
    "            <option value=\"\">Team&hellip;</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <a ng-click=\"removeRole(role)\" ng-if=\"roles.length > 1\">Remove</a>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <a ng-click=\"addRole()\">Add more roles&hellip;</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/sportily/registration/info.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/info.html",
    "<p class=\"help-block\" ng-hide=\"form[name].$invalid && (form[name].$touched || form.$submitted)\" ng-transclude></p>\n" +
    "");
}]);
