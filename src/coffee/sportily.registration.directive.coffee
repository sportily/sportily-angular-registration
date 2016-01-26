module = angular.module 'sportily.registration.directive', []


module.directive 'sportilyRegistration', ->
    restrict: 'E'
    controller: 'SportilyRegistrationCtrl'
    templateUrl: 'templates/sportily/registration/form.html'
    scope:
        registrationId: '@registration'
        seasonId: '@season'
        agreementMessage: '@'
        confirmationMessage: '@'
