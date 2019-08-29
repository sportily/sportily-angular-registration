(function() {
  var module;

  module = angular.module('sportily.registration', ['sportily.registration.controller', 'sportily.registration.directive', 'sportily.registration.services', 'sportily.registration.filters', 'sportily.registration.templates', 'sportily.registration.forms']);

}).call(this);

(function() {
  var NO_VALID_ROLES_MESSAGE, module;

  module = angular.module('sportily.registration.controller', ['sportily.api', 'sportily.registration.types', 'sportily.registration.forms']);

  NO_VALID_ROLES_MESSAGE = 'Please select at least one valid role.';

  module.controller('SportilyRegistrationCtrl', [
    '$scope', '$q', 'Form', 'AgeGroups', 'Competitions', 'Members', 'People', 'Roles', 'Seasons', 'Teams', 'Types', 'Users', function($scope, $q, Form, AgeGroups, Competitions, Members, People, Roles, Seasons, Teams, Types, Users) {
      var fetchAgeGroups, fetchCompetitions, fetchMember, fetchSeasons, fetchTeams, roleIsValid, saveMember, savePerson, saveRoles, saveUser, verifyRoles;
      $scope.user = {};
      $scope.person = {
        marketing_opt_in: false
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
        dateOfBirth: '',
        selectedSeason: null
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
        var rule;
        rule = Types[role.type];
        return role.competition_id && role.type && (!rule.requiresTeam || role.team_id);
      };
      verifyRoles = function() {
        var valid;
        valid = _.some($scope.roles, roleIsValid);
        if (!valid) {
          throw NO_VALID_ROLES_MESSAGE;
        }
      };
      $scope.save = function() {
        $scope.saving = true;
        return Form.isValid($scope).then(verifyRoles).then(saveUser).then(savePerson).then(saveMember).then(saveRoles).then(fetchMember).then(function(member) {
          var season;
          $scope.member = member;
          $scope.complete = true;
          $scope.error = null;
          season = _.find($scope.seasons, (function(_this) {
            return function(s) {
              return s.id === $scope.state.selectedSeason;
            };
          })(this));
          $scope.confirmationMessage = $scope.confirmationMessage.replace('SEASON_NAME', season.name);
          return $scope.saving = false;
        })["catch"](function() {
          $scope.saving = false;
          return Form.showErrors($scope);
        });
      };
      fetchSeasons = function() {
        return Seasons.getList({
          'organisation_id': $scope.organisationId
        }).then(function(seasons) {
          return $scope.seasons = seasons.filter(function(s) {
            return s.status === 'open';
          });
        });
      };
      fetchMember = function() {
        return Members.one($scope.member_id).get();
      };
      fetchCompetitions = function() {
        var filter;
        filter = {
          season_id: $scope.state.selectedSeason,
          include: 'organisation'
        };
        return Competitions.getList(filter).then(function(competitions) {
          return $scope.competitions = competitions;
        });
      };
      fetchAgeGroups = function() {
        var filter;
        filter = {
          season_id: $scope.state.selectedSeason
        };
        return AgeGroups.getList(filter).then(function(ageGroups) {
          return $scope.ageGroups = ageGroups;
        });
      };
      fetchTeams = function() {
        var filter;
        filter = {
          season_id: $scope.state.selectedSeason
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
        $scope.member_id = member.id;
        return $scope.roles.reduce((function(_this) {
          return function(p, role) {
            role.member_id = member.id;
            return p.then(function() {
              return Roles.post(role);
            });
          };
        })(this), $q.resolve());
      };
      fetchSeasons();
      $scope.$watch('state.selectedSeason', function(value) {
        if ($scope.state.selectedSeason) {
          $scope.member = {
            season_id: $scope.state.selectedSeason
          };
          fetchCompetitions();
          fetchAgeGroups();
          return fetchTeams();
        }
      });
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
        if ($scope.form['date_of_birth']) {
          return $scope.form['date_of_birth'].$setValidity('date', dob.isValid());
        }
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
        organisationId: '@organisation',
        agreementMessage: '@',
        confirmationMessage: '@',
        adminUrl: '@',
        paid: '='
      }
    };
  });

  module.directive('paymentButton', function($q, StripeService, Organisations, PaymentService, Members, Restangular) {
    var arePaymentsPossible, getNationalId, getTotal;
    getTotal = function(member) {
      if (member.financial_summary) {
        return member.financial_summary.owed.total;
      }
    };
    getNationalId = function(member) {
      var nationalId, orgs;
      orgs = null;
      nationalId = null;
      orgs = member.financial_summary.owed.organisations;
      Object.getOwnPropertyNames(orgs).forEach(function(prop) {
        if (orgs[prop].type === 'national') {
          return nationalId = prop;
        }
      });
      return nationalId;
    };
    arePaymentsPossible = function($scope) {
      var nationalId;
      nationalId = null;
      $scope.paymentsConfigured = false;
      if ($scope.member && $scope.member.financial_summary) {
        nationalId = getNationalId($scope.member);
        if (nationalId) {
          return Organisations.one(nationalId).get().then(function(nationalOrganisation) {
            $scope.nationalOrganisation = nationalOrganisation;
            return $scope.paymentsConfigured = nationalOrganisation.stripe_user_id;
          });
        }
      }
    };
    return {
      restrict: 'E',
      scope: {
        member: '=',
        email: '=',
        message: '='
      },
      template: '<button type="button" ng-if="paymentsConfigured && total > 0" ng-click="pay()" class="btn btn-primary">Pay Now</button>',
      controller: function($scope) {
        arePaymentsPossible($scope);
        $scope.total = getTotal($scope.member);
        return $scope.pay = function() {
          return StripeService.getSession($scope.total, $scope.email, "Sportily League Fees", $scope.nationalOrganisation.name + ' League Registration Fees', $scope.nationalOrganisation).then(function(session) {
            return PaymentService.take(session.id, $scope.member, $scope.amount).then(function() {
              return session;
            });
          }).then(function(session) {
            return StripeService.redirectToPayment($scope.nationalOrganisation.stripe_user_id, session.id);
          });
        };
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

  module.filter('money', function(currencyFilter) {
    return function(input) {
      if (input) {
        return currencyFilter(input / 100, '£');
      } else {
        return '–';
      }
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

  module = angular.module('sportily.registration.services', ['sportily.api']);

  module.factory('StripeService', function($q, StripePublishableKey, SportilyApi) {
    return {
      getSession: function(amount, email, name, description, organisation) {
        return SportilyApi.all('stripe').customGET('', {
          amount: amount,
          email: email,
          name: name,
          source: 'website',
          description: description,
          organisation_id: organisation.id
        });
      },
      redirectToPayment: function(stripeAccountId, sessionId) {
        var stripe;
        stripe = Stripe(StripePublishableKey, {
          stripeAccount: stripeAccountId
        });
        return stripe.redirectToCheckout({
          sessionId: sessionId
        });
      }
    };
  });

  module.factory('PaymentService', function($q, Transactions, Payments) {
    var getNational, getRegionals;
    getNational = function(member) {
      var national, orgs;
      orgs = null;
      national = [];
      orgs = member.financial_summary.owed.organisations;
      Object.getOwnPropertyNames(orgs).forEach(function(prop) {
        if (orgs[prop].type === 'national') {
          orgs[prop].id = prop;
          return national = orgs[prop];
        }
      });
      return national;
    };
    getRegionals = function(member) {
      var orgs, regions;
      orgs = null;
      regions = [];
      orgs = member.financial_summary.owed.organisations;
      Object.getOwnPropertyNames(orgs).forEach(function(prop) {
        if (orgs[prop].type === 'regional') {
          orgs[prop].id = prop;
          return regions.push(orgs[prop]);
        }
      });
      return regions;
    };
    return {
      take: function(stripeSessionId, member, amount) {
        var national, nationalPromise, promises, regions;
        national = getNational(member);
        regions = getRegionals(member);
        promises = regions.map(function(region) {
          return Transactions.post({
            type: 'standard',
            amount: region.total,
            source_id: member.id,
            target_id: null,
            status: 'pending',
            organisation_id: region.id,
            target_organisation_id: national.id,
            method: "online"
          });
        });
        nationalPromise = Transactions.post({
          type: 'standard',
          amount: national.total,
          source_id: member.id,
          target_id: null,
          status: 'pending',
          organisation_id: national.id,
          target_organisation_id: national.id,
          method: "online"
        });
        promises.push(nationalPromise);
        return $q.all(promises).then(function(transactions) {
          return Payments.post({
            amount: member.financial_summary.owed.total,
            organisation_id: national.id,
            stripe_payment_token: stripeSessionId,
            transaction_ids: transactions.map(function(transaction) {
              return transaction.id;
            })
          });
        });
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
      name: 'Non-Bench Official',
      requiresTeam: true
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
    player_cross_registration: {
      index: 10,
      name: 'Player (Cross Registration)',
      requiresTeam: true
    },
    parent: {
      index: 11,
      name: 'Parent',
      requiresTeam: true
    }
  });

}).call(this);
