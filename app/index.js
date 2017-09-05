/* global __dirname */

'use strict';

var path        = require('path'),
    yo          = require('yeoman-generator'),
    yosay       = require('yosay'),
    chalk       = require('chalk'),
    moment      = require('moment');

module.exports = yo.generators.Base.extend({
    constructor: function(arg, options) {
        yo.generators.Base.apply(this, arguments);

        this.on('end', function() {
            var _this  = this;

            this.installDependencies({
                npm: true,
                bower: false,
                yarn: false,
                skipInstall: this.options['skip-install'],
                callback: function () {
                    console.log(chalk.green.underline.bold('\nNpm install dependencies has completed.\n'));

                    console.log(
                        '\nRunning ' + chalk.yellowBright('composer install') +
                        ' for you to install the required dependencies. If this fails, try running the command yourself.\n'
                    );

                    this.spawnCommand('composer', ['install'])
                        .on('close', function () {
                            console.log(chalk.green.underline.bold('\nComposer install dependencies has completed.\n'));
                            console.log(chalk.redBright.bgYellowBright('\n\nStart grunt build and watch\n'));

                            _this.spawnCommand('grunt', ['live']);
                        });
                }.bind(this) // bind the callback to the parent scope
            });
        });

        this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the generator APP frontend!'
        ));
    },

    askFor: function() {
        var cb  = this.async(),
            now = new Date();

        var userName = process.env.USERNAME || process.env['USERPROFILE'].split(path.sep)[2];

        var prompts = [
            {
                name: 'projectName',
                message: 'Project Name',
                'default': path.basename(process.cwd())
            },
            {
                name: 'description',
                message: 'Project Description',
                'default': path.basename(process.cwd())
            },
            {
                name: 'deployDate',
                message: 'Deploy date',
                'default': moment().format('YYYY-MM-DD'),
                validate: function (input) {
                    if (!moment(input, 'YYYY-M-D', true).isValid()) {
                        console.log('\nInvalid date');
                        return false;
                    }

                    return true;
                }
            },
            {
                name: 'author',
                message: 'Author',
                'default': userName
            }
        ];

        this.prompt(prompts, function(props) {
            for (var prop in props) {
                if (props.hasOwnProperty(prop)) {
                    this[prop] = props[prop];
                }
            }

            cb();
        }.bind(this));

    },

    scaffold: function() {
        this.deployDate = moment(this.deployDate, 'YYYY-M-D').format('YYYYMMDD');

        this.directory('app/', 'app/');

        var deployDir   = 'deploys/' + this.deployDate;

        this.mkdir('app/fonts');
        this.mkdir('app/img');

        this.copy('_index.php', 'index.php');
        this.copy('gitignore', '.gitignore');
        this.copy('editorconfig', '.editorconfig');
        this.copy('csslintrc', '.csslintrc');
        this.copy('jshintrc', '.jshintrc');

        this.template('_package.json', 'package.json');
        this.template('_Gruntfile.js', 'Gruntfile.js');
        this.template('_composer.json', 'composer.json');
        this.template('deploys/development/.env', '.env');
        this.template('deploys/development/.env', deployDir + '/development/.env');
        this.template('deploys/production/.env', deployDir + '/production/.env');
    }
});
