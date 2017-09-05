'use strict';

var path    = require('path'),
    moment  = require('moment'),
    helpers = require('yeoman-generator').test;

describe('app generator', function() {
    this.timeout(10000);

    beforeEach(function(done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function(err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('frontend-create:app', [
                '../../app'
            ]);

            this.app.options['skip-install'] = true;

            done();
        }.bind(this));
    });

    it('creates expected files', function(done) {
        var dateNow = moment().format('YYYYMMDD');

        var expected = [
            'app/js/script.js',
            'app/scss/style.scss',
            'index.php',
            '.gitignore',
            '.editorconfig',
            '.csslintrc',
            '.jshintrc',
            'package.json',
            'Gruntfile.js',
            'composer.json',
            '.env',
            'deploys/' + dateNow + '/development/.env',
            'deploys/' + dateNow + '/production/.env'
        ];

        helpers.mockPrompt(this.app, {
            projectName: 'temp',
            description: 'temp'
        });

        this.app.run({}, function() {
            helpers.assertFile(expected);
            done();
        });
    });

    it('replaces templates variables', function(done) {
        var expected = [
            ['index.php', /<title>Temp<\/title>/],
            ['package.json', /"name": "temp"/]
        ];

        helpers.mockPrompt(this.app, {
            projectName: 'temp'
        });

        this.app.run({}, function() {
            helpers.assertFileContent(expected);
            done();
        });
    });
});
