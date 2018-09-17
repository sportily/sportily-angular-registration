module = angular.module 'sportily.registration.controller', [
    'sportily.api'
    'sportily.registration.types'
    'sportily.registration.forms'
]

NO_VALID_ROLES_MESSAGE = 'Please select at least one valid role.'

module.controller 'SportilyRegistrationCtrl', [
    '$scope'
    '$q'
    'Form'
    'AgeGroups'
    'Competitions'
    'Members'
    'People'
    'Roles'
    'Seasons'
    'Teams'
    'Types'
    'Users'

    ($scope, $q, Form, AgeGroups, Competitions, Members, People, Roles, Seasons, Teams, Types, Users) ->
        $scope.user = {}
        $scope.person =
          marketing_opt_in:false
        $scope.roles = [ type: null ]
        $scope.complete = false

        $scope.types = Types
        $scope.typeOptions = _(Types)
            #quick hack to remove cross registration from leagues other than brha
            .filter (t) -> t.name != 'Player (Cross Registration)' || $scope.organisationId == "36"
            .map (value, key) -> key: key, label: value.name, index: value.index
            .sortBy 'index'
            .value()

        $scope.state =
            agreement: false
            dateOfBirth: ''
            selectedSeason: null



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
        ## Verify that at least one of the roles is valid.
        ##
        roleIsValid = (role) ->
            rule = Types[role.type]
            role.competition_id && role.type && (!rule.requiresTeam || role.team_id)
        verifyRoles = ->
            valid =  _.some $scope.roles, roleIsValid
            throw NO_VALID_ROLES_MESSAGE unless valid


        ##
        ## Scope function to submit the form.
        ##
        $scope.save = ->
            Form.isValid($scope)
                .then verifyRoles
                .then saveUser
                .then savePerson
                .then saveMember
                .then saveRoles
                .then fetchMember
                .then (member) ->
                  $scope.member = member
                  $scope.complete = true
                  $scope.error = null
                  season = _.find($scope.seasons, (s) => s.id == $scope.state.selectedSeason)
                  $scope.confirmationMessage = $scope.confirmationMessage.replace('SEASON_NAME', season.name)
                .catch Form.showErrors($scope)

        fetchSeasons = ->
          Seasons.getList({'organisation_id': $scope.organisationId}).then (seasons) ->
            $scope.seasons = seasons.filter (s) -> s.status == 'open'

        ##
        ## Fetch a list of all the age groups for the current season.
        ##
        fetchMember = ->
            Members.one($scope.member_id).get()

        ##
        ## Fetch a list of all the organisations for the current registration
        ## period.
        ##
        fetchCompetitions = ->
            filter = season_id: $scope.state.selectedSeason, include: 'organisation'
            Competitions.getList(filter).then (competitions) ->
                $scope.competitions = competitions


        ##
        ## Fetch a list of all the age groups for the current season.
        ##
        fetchAgeGroups = ->
            filter = season_id: $scope.state.selectedSeason
            AgeGroups.getList(filter).then (ageGroups) ->
                $scope.ageGroups = ageGroups


        ##
        ## Fetch a list of all the teams for the current registration period.
        ##
        fetchTeams = ->
            filter = season_id: $scope.state.selectedSeason
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
            $scope.member_id = member.id
            $scope.roles.reduce (p, role) =>
                role.member_id = member.id
                p.then () => Roles.post(role)
            , $q.resolve()
                        # [ ...chainResults, currentResult ]
            # rolePromises = []
            # $scope.roles.forEach (role) ->
            #     role.member_id = member.id
            #     rolePromises.push(Roles.post(role))
            # return $q.all(rolePromises);


        # initialise the scope with necessary data.
        fetchSeasons();

#

        $scope.$watch 'state.selectedSeason', (value) ->
            if $scope.state.selectedSeason
              $scope.member = season_id: $scope.state.selectedSeason
              fetchCompetitions()
              fetchAgeGroups()
              fetchTeams()

        # watch the date of birth for changes, and update the person model
        # ensuring that we support dates as Date objects (as provided by date
        # inputs) and strings (as provided by fallback text inputs).
        $scope.$watch 'state.dateOfBirth', (value) ->
            input = 'DD/MM/YYYY'
            output = 'YYYY-MM-DD'
            dob = switch
                when value instanceof Date then moment(value)
                else moment(value, input, true)

            $scope.person.date_of_birth = dob.format output if dob.isValid()
            $scope.form['date_of_birth'].$setValidity 'date', dob.isValid() if $scope.form['date_of_birth']
]
