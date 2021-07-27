module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['src/main.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
		reporterOutput: "",
		jshintrc: '.jshintrc.js',
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
	postcss: {
		options: {
		  map: true,
	 
		  processors: [
			require('pixrem')(),
			require('autoprefixer')({browsers: 'last 2 versions'}),
		  ]
		},
		dist: {
		  src: 'style.css',
		  dest: 'dist/style.css'
		}
	},
	cssmin: {
	  target: {
		files: [{
		  expand: true,

		  src: ['<%= postcss.dist.dest %>', '!*.min.css'],
		  dest: 'dist/',
		  ext: '.min.css'
		}]
	  }
	},
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint','uglify', 'postcss', 'cssmin']);

};