module = angular.module 'sportily.registration.types', []


module.constant 'Types',

    player:
        index: 1
        name: 'Player'
        requiresTeam: true

    coach:
        index: 2
        name: 'Coach'
        requiresTeam: true

    manager:
        index: 3
        name: 'Manager'
        requiresTeam: true

    official:
        index: 4
        name: 'Non-Bench Official'
        requiresTeam: true

    committee:
        index: 5
        name: 'Regional Committee'

    referee:
        index: 6
        name: 'Referee'

    timekeeper:
        index: 7
        name: 'Timekeeper'

    player_training:
        index: 8
        name: 'Player (Training)'
        requiresTeam: true

    player_recreational:
        index: 9
        name: 'Player (Recreational)'
        requiresTeam: true

    player_cross_registration:
        index: 10
        name: 'Player (Cross Registration)'
        requiresTeam: true

    parent:
        index: 11
        name: 'Parent'
        requiresTeam: true
