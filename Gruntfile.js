/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`,
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function (grunt) {

  var path = require('path');

  var PUBLIC_PATH = '.tmp/public';
  var ASSETS_PATH = 'assets';

  /**
   * CSS files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails also supports LESS in development and production.
   * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task
   * below for more options.  For this to work, you may need to install new
   * dependencies, e.g. `npm install grunt-contrib-sass`
   */

  var cssFilesToInject = [
    'css/buildCss.css'
  ];

  /**
   * Javascript files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * To use client-side CoffeeScript, TypeScript, etc., edit the
   * `sails-linker:devJs` task below for more options.
   */

  var jsFilesToInject = [

    // Below, as a demonstration, you'll see the built-in dependencies 
    // linked in the proper order order

    // First must loaded require js lib
    'js/require.js',

    // Than all vendor libs
    'js/requireJsBuild.js',

    // Than at the and our application files
    'js/applicationBuild.js'
  ];

  /**
   * Client-side HTML templates are injected using the sources below
   * The ordering of these templates shouldn't matter.
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails uses JST templates and precompiles them into
   * functions for you.  If you want to use jade, handlebars, dust, etc.,
   * edit the relevant sections below.
   */

  var templateFilesToInject = [
    //'linker/**/*.html'
  ];

  /** ///////////////////////////////////////////////////////////////
  * DANGER:
  * With great power comes great responsibility.
  ///////////////////////////////////////////////////////////////// */

  // Modify css file injection paths to use 
  cssFilesToInject = cssFilesToInject.map(function (path) {
    return PUBLIC_PATH + '/' + path;
  });

  // Modify js file injection paths to use 
  jsFilesToInject = jsFilesToInject.map(function (path) {
    return PUBLIC_PATH + '/' + path;
  });

  templateFilesToInject = templateFilesToInject.map(function (path) {
    return ASSETS_PATH + '/' + path;
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');

  // Add task from npm
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  /*******************************************
  * Project configuration.
  *******************************************/
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Install bower dependencies
    bower: {
      install: {
        options: {
          targetDir: PUBLIC_PATH,
          layout: function(type, component) {
            return path.join(type);
          },
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          include: 'js/boot.js',
          baseUrl: ASSETS_PATH,
          mainConfigFile: ASSETS_PATH + "/js/boot.js",
          optimize: 'none',
          generateSourceMaps: true,
          out: PUBLIC_PATH + "/js/requireJsBuild.js"
        }
      }
    },

    less: {
      compile: {
        options: {
          concat: false
        },
        src:  ASSETS_PATH + '/styles/**/*.less',
        dest: PUBLIC_PATH + '/css/lessBuild.css'
      }
    },

    handlebars: {
      compile: {
        options: {
          processName: function(filePath) {
            return filePath.replace(ASSETS_PATH + '/js/application/templates/', '');
          },
          namespace: 'tpl',
          amd: true
        },
        src:  ASSETS_PATH + '/js/application/templates/**/*.hbs',
        dest: PUBLIC_PATH + '/js/templatesBuild.js'
      }
    },

    copy: {
      images:{
        src: [ASSETS_PATH + '/images/**/*.(png|jpeg|gif)'],
        dest: PUBLIC_PATH + '/images/'
      }
    },

    clean: {
      public: [PUBLIC_PATH + '/**']
    },

    concat: {
      devCss: {
        src: [PUBLIC_PATH + '/build/**/*.css'],
        dest: PUBLIC_PATH + '/css/build.css'
      },
      devJs: {
        src: [ASSETS_PATH +'/application/**/*.js', ASSETS_PATH +'/lib/**/*.js'],
        dest: PUBLIC_PATH + '/js/applicationBuild.js'
      },
      js: {
        src: jsFilesToInject,
        dest: PUBLIC_PATH + '/concat/production.js'
      },
      css: {
        src: cssFilesToInject,
        dest: PUBLIC_PATH + '/concat/production.css'
      }
    },

    uglify: {
      dist: {
        src: [PUBLIC_PATH + '/concat/production.js'],
        dest: PUBLIC_PATH + '/min/production.js'
      }
    },

    cssmin: {
      dist: {
        src: [PUBLIC_PATH + '/concat/production.css'],
        dest: PUBLIC_PATH + '/min/production.css'
      }
    },

    /*******************************************
    * Jade linkers
    *******************************************/
    'sails-linker': {

      devJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: PUBLIC_PATH
        },
        files: {
          'views/**/*.jade': jsFilesToInject
        }
      },

      prodJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: PUBLIC_PATH
        },
        files: {
          'views/**/*.jade': [PUBLIC_PATH + '/min/production.js']
        }
      },

      devStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: PUBLIC_PATH
        },
        files: {
          'views/**/*.jade': cssFilesToInject
        }
      },

      prodStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: PUBLIC_PATH
        },
        files: {
          'views/**/*.jade': [PUBLIC_PATH + '/min/production.css']
        }
      }


    },
    /************************************
    * Jade linker end
    ************************************/

    /************************************
    * Watch start
    ************************************/
    watch: {
      js: {
        // Assets to watch:
        files: ['assets/js/application/**/*.js', 'assets/js/libs/**/*.js'],

        // When assets are changed:
        tasks: ['concat:devJs']
      },
      images: {
        // Assets to watch:
        files: ['assets/images/**/*.(gif|png|jpeg)'],

        // When assets are changed:
        tasks: ['copy:images']
      },
      less: {
        // Assets to watch:
        files: ['assets/styles/**/*.less'],

        // When assets are changed:
        tasks: ['less:compile']
      },
      hbs: {
        // Assets to watch:
        files: ['assets/application/templates/**/*.hbs'],

        // When assets are changed:
        tasks: ['handlebars:compile']
      }
    }
  });

  /************************************
  * Register tasks
  ************************************/

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  // This work must do only when grunt start
  grunt.registerTask('compileAssets', [
    'clean:public',
    'bower:install',
    'requirejs:compile',
    'less:compile',
    'handlebars:compile',
    'concat:devJs',
    'concat:devCss',
    'copy:images'
  ]);

  // Set links to jade template, only on start
  grunt.registerTask('linkAssets', [
    // Update link/script/template references in `assets` index.html
    'sails-linker:devJsJADE',
    'sails-linker:devStylesJADE'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:public',
    'compileAssets',
    'concat:js',
    'concat:css',
    'uglify',
    'cssmin',
    'sails-linker:prodJsJADE',
    'sails-linker:prodStylesJADE'
  ]);
};
