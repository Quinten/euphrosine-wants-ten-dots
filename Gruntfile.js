module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 2051,
                    base: 'pub'
                }
            }
        },
        concat: {
            dist: {
                src: [  "src/lib/phaser.min.js",
                        "src/game/states/**/*.js",
                        "src/game/substates/**/*.js",
                        "src/game/main.js"
                     ],
                dest: 'pub/code/game.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            src_target: {
                files: {
                    'pub/code/game.min.js': ['pub/code/game.js']
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:2051/'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat', 'uglify:src_target']
        },
    });

    grunt.registerTask('default', ['concat', 'uglify:src_target', 'connect', 'open', 'watch']);
};
