module = angular.module 'sportily.registration.forms', []


String::ucfirst = ->
    @charAt(0).toUpperCase() + @slice 1


module.directive 'serverError', ->
    restrict: 'A'
    require: '?ngModel'
    scope:
        model: '=ngModel'

    link: (scope, element, attrs, ngModel) ->
        scope.$watch 'model', ->
            _.each ngModel.$error, (value, key) ->
                ngModel.$setValidity key, true if key.startsWith 'validation.'


module.directive 'errors', ->
    restrict: 'E'
    require: [ '^form', '^field' ]
    templateUrl: 'templates/sportily/registration/errors.html'


module.directive 'info', ->
    restrict: 'E'
    require: [ '^form', '^field' ]
    transclude: true
    templateUrl: 'templates/sportily/registration/info.html'
    scope: true

    link: (scope, element, attrs, ctrl) ->
        scope.form = ctrl[0]
        scope.name = ctrl[1].name()


module.directive 'field', ->
    restrict: 'E'
    require: '^form'
    transclude: true
    templateUrl: 'templates/sportily/registration/field.html'
    scope:
        name: '@'
        label: '@'

    link: (scope, element, attrs, form) ->
        scope.form = form
        scope.displayLabel = switch scope.label
            when undefined then scope.name.ucfirst().replace('_', ' ')
            when 'empty' then ''
            when 'none' then ''
            else scope.label

    controller: ['$scope', ($scope) ->
        @name = -> $scope.name
        @label = -> $scope.label
        return
    ]


module.factory 'Form', ($window, $q) ->

    showErrors: (scope) ->
        (response) ->
            $window.scrollTo 0, 0
            if response.data
                scope.error = response.data.error_description
                _.each response.data.validation_messages, (errors, key) ->
                    _.each errors, (error) ->
                        scope.form[key].$setValidity error, false
            else
                scope.error = response


    isValid: (scope) ->
        if scope.form.$valid
            $q.when()
        else
            $q.reject 'There are errors in the form.'
