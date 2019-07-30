module = angular.module 'sportily.registration.directive', []


module.directive 'sportilyRegistration', ->
    restrict: 'E'
    controller: 'SportilyRegistrationCtrl'
    templateUrl: 'templates/sportily/registration/form.html'
    scope:
        organisationId: '@organisation'
        agreementMessage: '@'
        confirmationMessage: '@'
        adminUrl: '@'
        paid: '='


module.directive('paymentButton', ($q, StripeService, Organisations, PaymentService, Members, Restangular) ->
    getTotal = (member) ->
       member.financial_summary.owed.total if member.financial_summary


    getNationalId = (member) ->
        orgs = null
        nationalId = null
        orgs = member.financial_summary.owed.organisations;
        Object.getOwnPropertyNames(orgs).forEach((prop) ->
             nationalId = prop if (orgs[prop].type == 'national')
        );
        return nationalId;

    arePaymentsPossible = ($scope) ->
        nationalId = null
        $scope.paymentsConfigured = false;
        if ($scope.member && $scope.member.financial_summary)
            nationalId = getNationalId($scope.member);
            if (nationalId)
                Organisations.one(nationalId).get().then((nationalOrganisation) ->
                    $scope.nationalOrganisation = nationalOrganisation;
                    $scope.paymentsConfigured = nationalOrganisation.stripe_user_id;
                );

    return {
        restrict: 'E',
        scope: {
            member: '=',
            email: '=',
            message: '='
        },
        template: '<button type="button" ng-if="paymentsConfigured && total > 0" ng-click="pay()" class="btn btn-primary">Pay Now</button>',
        controller: ($scope) ->
          arePaymentsPossible($scope);
          $scope.total = getTotal($scope.member);


          $scope.pay = ->

              return StripeService.getSession($scope.total, $scope.email, "Sportily League Fees", $scope.nationalOrganisation.name + ' League Registration Fees', $scope.nationalOrganisation
              ).then((session) ->
                  return PaymentService.take(session.id, $scope.member, $scope.amount).then(() ->
                      return session;
                  )
              ).then((session) ->
                  return StripeService.redirectToPayment($scope.nationalOrganisation.stripe_user_id, session.id)
              )

      }
);
