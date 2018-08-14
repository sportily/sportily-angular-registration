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
          return $scope.agreementMessage = $scope.agreementMessage.replace('SEASON_NAME', season.name);
        })["catch"](Form.showErrors($scope));
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
        var rolePromises;
        $scope.member_id = member.id;
        rolePromises = [];
        $scope.roles.forEach(function(role) {
          role.member_id = member.id;
          return rolePromises.push(Roles.post(role));
        });
        return $q.all(rolePromises);
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
        confirmationMessage: '@'
      }
    };
  });

  module.directive('paymentButton', function($q, StripeService, Organisations, PaymentService, Members) {
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
          return StripeService.getOneTimeToken($scope.total, $scope.email).then(function(stripeToken) {
            return PaymentService.take(stripeToken, $scope.member);
          }).then(function(payment) {
            if (payment.status === 'complete') {
              return Members.one($scope.member.id).get().then(function(member) {
                $scope.member = member;
                return $scope.total = getTotal($scope.member);
              }).then(function() {
                return $scope.message = {
                  type: 'success',
                  message: 'Payment completed successfully.'
                };
              });
            }
          })["catch"](function(error) {
            return $scope.message = {
              type: 'danger',
              message: 'Payment unsuccessful.'
            };
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

  module = angular.module('sportily.registration.services', []);

  module.factory('StripeService', function($q, StripePublishableKey) {
    return {
      getOneTimeToken: function(amount, email) {
        var deferred, handler, options;
        deferred = $q.defer();
        handler = StripeCheckout.configure({
          key: StripePublishableKey,
          name: "Pay League Fees",
          allowRememberMe: false,
          email: email,
          token: function(token, args) {
            return deferred.resolve(token);
          },
          closed: function() {
            return deferred.reject("form.closed");
          }
        });
        options = {
          description: "Sportily League Fees",
          zipCode: true,
          currency: "gbp",
          amount: amount
        };
        handler.open(options);
        return deferred.promise;
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
      take: function(stripeToken, member, amount) {
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
          target_organisation_id: null,
          method: "online"
        });
        promises.push(nationalPromise);
        return $q.all(promises).then(function(transactions) {
          return Payments.post({
            amount: member.financial_summary.owed.total,
            organisation_id: national.id,
            stripe_payment_token: stripeToken.id,
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
