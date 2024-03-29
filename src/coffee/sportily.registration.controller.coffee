module = angular.module 'sportily.registration.controller', [
    'sportily.api'
    'sportily.registration.forms'
]

NO_VALID_ROLES_MESSAGE = 'Please select at least one valid role.'

module.controller 'SportilyRegistrationCtrl', [
    '$scope'
    '$q'
    'Form'
    'AgeGroups'
    'Organisations'
    'Members'
    'People'
    'Roles'
    'Seasons'
    'Teams'
    'RegistrationRoles'
    'Users',
    'CustomRegistrationFields',
    'SportilyApi'
    ($scope, $q, Form, AgeGroups, Organisations, Members, People, Roles, Seasons, Teams, RegistrationRoles, Users, CustomRegistrationFields, SportilyApi) ->
        $scope.user = {}
        $scope.person =
          marketing_opt_in:false
        $scope.roles = [ type: null ]
        $scope.complete = false

        fetchRoles = () ->
            RegistrationRoles.one('register').get({
              'organisation_id': $scope.organisationId,
              'email': $scope.user.email,
              'season_id': $scope.state.selectedSeason
              }).then (roles) ->
                $scope.typeOptions = roles
                $scope.requestedRoles = false

        $scope.state =
            agreement: false
            dateOfBirth: ''
            selectedSeason: null
            selectedRegionId: null
            selectedAgeGroupId: null

        $scope.findUser = ->
          Users.getList({email: $scope.user.email}).then (response) ->
            $scope.state.userExists = _.first(response).exists
            $scope.user.id = _.first(response).id
          fetchRoles()
          return false

        findRole = (type) ->
           return _($scope.typeOptions[$scope.state.selectedRegionId].data).find (t) ->
            return t.system_role == type

        $scope.requiresTeam = (type) ->
          role = findRole(type)
          return role && role.requires_team

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
            rule = findRole(role.type)
            role.type && (!rule.requires_team || role.team_id)
        verifyRoles = ->
            valid =  _.some $scope.roles, roleIsValid
            throw NO_VALID_ROLES_MESSAGE unless valid


        ##
        ## Scope function to submit the form.
        ##
        $scope.save = ->
            $scope.saving = true
            Form.isValid($scope)
                .then(verifyRoles)
                .then saveAll
                .then (member) ->
                  $scope.member = member
                  $scope.complete = true
                  $scope.error = null
                  season = _.find($scope.seasons, (s) => s.id == $scope.state.selectedSeason)
                  $scope.confirmationMessage = $scope.confirmationMessage.replace('SEASON_NAME', season.name)
                  $scope.saving = false
                  window.parent.postMessage('scroll_top', '*')
                  window.scrollTo(0,0);
                .catch (response) ->
                  $scope.saving = false
                  (Form.showErrors($scope))(response)

        fetchSeasons = ->
          Seasons.getList({'organisation_id': $scope.organisationId}).then (seasons) ->
            $scope.seasons = seasons.filter (s) -> s.status == 'open'

        ##
        ## Fetch a list of all the age groups for the current season.
        ##
        fetchMember = ->
            Members.one($scope.member_id).get({'includes': 'customRegistrationFields'})

        ##
        ## Fetch a list of all the organisations for the current registration
        ## period.
        ##
        fetchOrganisation = ->
            Organisations.one($scope.organisationId).get({include: 'regions'}).then (organisation) ->
                $scope.regions = organisation.regions.data.map (r) ->
                  id: r.id, name: r.name
                $scope.regions.unshift id: organisation.id, name: organisation.name
                $scope.activeCompetitionId = organisation.active_competition_id
                $scope.state.selectedRegionId = organisation.id if !organisation.regions.data.length
                CustomRegistrationFields.getList({
                    'organisation_id': organisation.id,
                    'parent_organisation_id': organisation.parent_id,
                    'show_on_registration_form': 1
                }).then (fields) ->
                    $scope.customRegistrationFields = fields


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
        fetchTeams = (ageGroupId, roles)->
            filter = age_group_id: ageGroupId, organisation_id: $scope.state.selectedRegionId
            Teams.getList(filter).then (teams) ->
                roles.teams = teams.filter (t) ->
                  t.competitions.data.length

        ##
        ## Post all data at once
        saveAll = ->
            roles = $scope.roles.map (r) ->
                rule = findRole(r.type)
                r.competition_id = $scope.activeCompetitionId if rule && !rule.requires_team
                r

            data = 
                user: $scope.user,
                person: $scope.person,
                member: $scope.member,
                roles: roles
            SportilyApi.all('members').customPOST(data,'register')

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

            # rolePromises = []
            # $scope.roles.forEach (role) ->
            #     role.member_id = member.id
            #     rolePromises.push(Roles.post(role))
            # return $q.all(rolePromises);


        # initialise the scope with necessary data.
        fetchSeasons();

        $scope.getTeams = (role) ->
          fetchTeams(role.selectedAgeGroupId, role)

        $scope.$watch 'state.selectedSeason', (value) ->
            if $scope.state.selectedSeason
              $scope.member = season_id: $scope.state.selectedSeason, customRegistrationFields: data: []
              fetchOrganisation()
              fetchAgeGroups()


        $scope.findCustomField = (field) ->
            f = _.find $scope.member.customRegistrationFields.data, (c) ->
                c.custom_registration_field_id == field.id
            
            moment(f.answer, 'DD/MM/YYYY', true).toDate() if f && field.type == 'date'
            return f if f
            f = custom_registration_field_id: field.id, answer: "", member_id: $scope.member.id
            $scope.member.customRegistrationFields.data.push f
            return f

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
