module = angular.module 'sportily.registration.types', []


module.constant 'Types',

    player:
        name: 'Player'
        requiresTeam: true

    player_training:
        name: 'Player (Training)'
        requiresTeam: true

    player_recreational:
        name: 'Player (Recreational)'
        requiresTeam: true

    manager:
        name: 'Manager'
        requiresTeam: true

    coach:
        name: 'Coach'
        requiresTeam: true

    referee:
        name: 'Referee'

    timekeeper:
        name: 'Timekeeper'

    official:
        name: 'Non-Bench Official'

    committee:
        name: 'Regional Committee'

    parent:
        name: 'Parent'
        requiresTeam: true
