module = angular.module 'sportily-registration', [ 'sportily-registration-templates' ]


module.directive 'sportilyRegistration', ->
    restrict: 'E'
    controller: 'SportilyRegistrationCtrl'
    templateUrl: 'templates/registration.html'
    scope:
        successFn: '&success'


module.controller 'SportilyRegistrationCtrl', ($scope) ->
    $scope.user = {}
    $scope.person = {}
    $scope.roles = [ type: null ]

    $scope.types =
        player: 'Player'
        manager: 'Manager'
        official: 'Official'

    $scope.organisations = [
        { id: 1, name: 'BIPHA South' }
        { id: 2, name: 'BIPHA Central' }
    ]

    $scope.teams = [
        { id: 1, organisation_id: 1, name: 'Crusaders', age_group_id: 1 }
        { id: 2, organisation_id: 1, name: 'Valley Commandoes', age_group_id: 1 }
        { id: 3, organisation_id: 1, name: 'Farnborough Arrows', age_group_id: 2 }
        { id: 4, organisation_id: 1, name: 'Farnborough Arrows', age_group_id: 3 }
        { id: 5, organisation_id: 2, name: 'Khaos', age_group_id: 1 }
        { id: 6, organisation_id: 2, name: 'Hallamshire Cyclones', age_group_id: 1 }
        { id: 7, organisation_id: 2, name: 'Norton Cyclones', age_group_id: 2 }
        { id: 8, organisation_id: 2, name: 'Norton Cyclones', age_group_id: 3 }
    ]

    $scope.ageGroups = { 1: 'Seniors', 2: 'Junior', 3: 'Under 16' }

    $scope.addRole = ->
        $scope.roles.push type: 'player'

    $scope.removeRole = (toBeRemoved) ->
        $scope.roles = $scope.roles.filter (role) -> role isnt toBeRemoved

    saveUser = ->
        if $scope.user.email then users.post $scope.user else $q.when id: null

    savePerson = (user) ->
        $scope.person.user_id = user.id
        if $scope.state.dateOfBirth
            $scope.person.date_of_birth = moment($scope.state.dateOfBirth).format 'YYYY-MM-DD'
        people.post $scope.person

    saveMember = (person) ->
        $scope.member.person_id = person.id
        members.post $scope.member

    saveRoles = (member) ->
        $scope.roles.forEach (role) ->
            role.member_id = member.id
            roles.post role

    $scope.save = ->
        $scope.successFn()
        ###saveUser()
            .then(savePerson)
            .then(saveMember)
            .then(saveRoles)###
