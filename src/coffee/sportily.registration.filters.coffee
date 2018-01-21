module = angular.module 'sportily.registration.filters', []


module.filter 'forOrganisation', ->
    (teams, id) ->
        _.filter teams, (team) ->
            _.some team.competitions.data, organisation_id: id


module.filter 'forCompetition', ->
    (teams, id) ->
        _.filter teams, (team) ->
            _.some team.competitions.data, id: id


module.filter 'money', (currencyFilter) ->
    (input) ->
        if input
            currencyFilter input / 100, '£'
        else
            '–'
