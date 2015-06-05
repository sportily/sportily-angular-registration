module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            dist:
                files:
                    'dist/registration.js': 'src/registration.coffee'

        html2js:
            dist:
                src: 'src/templates/**/*.html'
                dest: 'dist/registration-templates.js'
                module: 'sportily-registration'


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-html2js'

    grunt.registerTask 'default', [ 'coffee', 'html2js' ]
