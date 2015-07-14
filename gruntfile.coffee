module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            dist:
                src: 'src/coffee/**/*.coffee'
                dest: 'dist/js/sportily.registration.js'

        concat:
            dist:
                src: [ 'dist/js/sportily.registration.js', 'dist/js/sportily.registration.templates.js' ]
                dest: 'dist/js/sportily.registration.all.js'

        html2js:
            dist:
                src: 'src/templates/**/*.html'
                dest: 'dist/js/sportily.registration.templates.js'
                module: 'sportily.registration.templates'

        uglify:
            options:
                sourceMap: true
            dist:
                files:
                    'dist/js/sportily.registration.min.js': [ 'dist/js/sportily.registration.all.js' ]

        watch:
            coffee:
                files: [ 'src/coffee/**/*.coffee' ]
                tasks: [ 'default' ]

            html2js:
                files: [ 'src/templates/**/*.html' ]
                tasks: [ 'default' ]


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-html2js'

    grunt.registerTask 'default', [ 'coffee', 'html2js', 'concat', 'uglify' ]
