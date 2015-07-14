module = angular.module 'sportily.registration.directive', []


module.directive 'sportilyRegistration', ->
    restrict: 'E'
    controller: 'SportilyRegistrationCtrl'
    templateUrl: 'templates/sportily/registration/registration.html'
    scope:
        registrationId: '@registration'
        seasonId: '@season'
