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

angular.module('sportily.registration.templates', ['templates/sportily/registration/registration.html']);

angular.module("templates/sportily/registration/registration.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/sportily/registration/registration.html",
    "<form>\n" +
    "\n" +
    "    <h1>Registration</h1>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"given_name\">Name</label>\n" +
    "        <div class=\"form-inline\">\n" +
    "            <input type=\"text\" class=\"form-control form-control-xs\" id=\"given_name\" ng-model=\"person.given_name\" placeholder=\"First Name\"/>\n" +
    "            <input type=\"text\" class=\"form-control form-control-sm\" id=\"family_name\" ng-model=\"person.family_name\" size=\"40\" placeholder=\"Surname\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"email_address\">Email Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"email_address\" ng-model=\"user.email_address\"/>\n" +
    "        <p class=\"help-block\">Email address will <em>never</em> be shown publicly.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"email_address_confirm\">Confirm Email Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"email_address_confirm\" ng-model=\"user.email_address_confirm\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"medical_conditions\">Medical Conditions</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"medical_conditions\" ng-model=\"person.medical_conditions\"/>\n" +
    "        <p class=\"help-block\">If none, please state “None”.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"date_of_birth\">Date of Birth</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-xs\" id=\"date_of_birth\" ng-model=\"state.dateOfBirth\" placeholder=\"dd/mm/yyyy\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>League Roles</h2>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-inline form-group form-role\" ng-repeat=\"role in roles\">\n" +
    "\n" +
    "            <label>Role #{{ $index + 1 }}:</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"o.id as o.name for o in organisations\"\n" +
    "                    ng-model=\"role.organisation_id\">\n" +
    "                    <option value=\"\">Region&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"role.organisation_id\">\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"key as label for (key, label) in types\"\n" +
    "                    ng-model=\"role.type\">\n" +
    "                    <option value=\"\">Role&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\" ng-show=\"role.organisation_id && ['player','manager'].indexOf(role.type) !== -1\">\n" +
    "                <span>for &nbsp;</span>\n" +
    "                <select class=\"form-control\"\n" +
    "                    ng-options=\"team.id as team.name + ' (' + ageGroups.lookup[team.age_group_id].name + ')' for team in teams|forOrganisation:role.organisation_id\"\n" +
    "                    ng-model=\"role.team_id\">\n" +
    "                    <option value=\"\">Team&hellip;</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <a ng-click=\"removeRole(role)\"\n" +
    "                ng-if=\"roles.length > 1\">\n" +
    "                Remove\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"addRole()\">Add more roles&hellip;</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>Contact Details</h2>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"street_address\">Street Address</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"street_address\" ng-model=\"person.street_address\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"city\">Town/City</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"city\" ng-model=\"person.city\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"province\">County</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"province\" ng-model=\"person.province\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"postcode\">Postcode</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"postcode\" ng-model=\"person.postcode\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"phone_number\">Phone Number</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"phone_number\" ng-model=\"person.phone_number\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"mobile_number\">Mobile Number</label>\n" +
    "        <input type=\"text\" class=\"form-control form-control-sm\" id=\"mobile_number\" ng-model=\"person.mobile_number\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"save()\">Register</button>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);
