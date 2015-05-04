module.exports = function(grunt) {
    grunt.initConfig({
        express: {
            build: {
                options: {
                    server: ('server.js')
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'server.js', 'scripts/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        less: {
            default: {
                files: {
                    'assets/css/style.css': [
                        'assets/less/style.less'
                    ],
                    'assets/css/print.css': [
                        'assets/less/print.less'
                    ],
                }
            }
        },
        watch: {
            less: {
                files: ['assets/less/*.less', 'node_modules/bootstrap/less/*.less'],
                tasks: ['less']
            }
        },
        jsbeautifier: {
            files: ["scripts/**/*.js", '*.js', 'index.html', 'assets/css/*.css', 'assets/css/*.less'],
            options: {
                css: {
                    indentSize: 4
                },
                html: {
                    indentSize: 4
                },
                js: {
                    indentSize: 4
                }
            }
        }
    });

    grunt.registerTask('default', ['jshint',
        'jsbeautifier',
        'express',
        'less',
        'express-keepalive',
    ]);

    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-jsbeautifier');
};
