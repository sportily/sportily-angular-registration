module = angular.module 'sportily.registration.controller', [
    'sportily.api'
]


module.controller 'SportilyRegistrationCtrl', [
    '$scope'
    '$q'
    'AgeGroups'
    'Members'
    'Organisations'
    'People'
    'Roles'
    'Teams'
    'Users'

    ($scope, $q, AgeGroups, Members, Organisations, People, Roles, Teams, Users) ->
        $scope.user = {}
        $scope.person = {}
        $scope.member = season_id: $scope.seasonId
        $scope.roles = [ type: null ]
        $scope.state = dateOfBirth: null
        $scope.types =
            player: 'Player'
            manager: 'Manager'
            official: 'Official'


        ##
        ## Add a new, undefined, role to the scope.
        ##
        $scope.addRole = ->
            $scope.roles.push type: null


        ##
        ## Remove the given role from the scope.
        ##
        $scope.removeRole = (toBeRemoved) ->
            $scope.roles = $scope.roles.filter (role) -> role isnt toBeRemoved


        ##
        ## Scope function to submit the form.
        ##
        $scope.save = ->
            saveUser()
                .then(savePerson)
                .then(saveMember)
                .then(saveRoles)


        ##
        ## Fetch a list of all the organisations for the current registration
        ## period.
        ##
        fetchOrganisations = ->
            filter = registration_id: $scope.registrationId
            Organisations.getList(filter).then (organisations) ->
                $scope.organisations = organisations


        ##
        ## Fetch a list of all the age groups for the current season.
        ##
        fetchAgeGroups = ->
            filter = season_id: $scope.seasonId
            AgeGroups.getList(filter).then (ageGroups) ->
                $scope.ageGroups = ageGroups


        ##
        ## Fetch a list of all the teams for the current registration period.
        ##
        fetchTeams = ->
            filter = registration_id: $scope.registrationId
            Teams.getList(filter).then (teams) ->
                $scope.teams = teams


        ##
        ## Save the user defined in the scope, or – if no user is defined in
        ## the scope – then skip this step and return a null user.
        ##
        saveUser = ->
            if $scope.user.email
                Users.post $scope.user
            else
                $q.when id: null


        ##
        ## Save the user defined in the scope, attaching it to the given user.
        ##
        savePerson = (user) ->
            $scope.person.user_id = user.id

            if $scope.state.dateOfBirth
                $scope.person.date_of_birth =
                    moment($scope.state.dateOfBirth).format 'YYYY-MM-DD'

            People.post $scope.person


        ##
        ## Save the member defined in the scope, attaching it to the given
        ## person.
        ##
        saveMember = (person) ->
            $scope.member.person_id = person.id
            Members.post $scope.member


        ##
        ## Save the roles defined in the scope, attaching them to the given
        ## member.
        ##
        saveRoles = (member) ->
            $scope.roles.forEach (role) ->
                role.member_id = member.id
                Roles.post role


        # initialise the scope with necessary data.
        fetchOrganisations()
        fetchAgeGroups()
        fetchTeams()
]
