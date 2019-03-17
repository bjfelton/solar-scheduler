const gulp  = require('gulp');
const jest  = require('gulp-jest').default;
const spawn = require('child_process').spawn;

gulp.task('securityScan', done => {
  const child = spawn('retire', ['-p', '-n'], { cwd: process.cwd() });

  child.stdout.setEncoding('utf8');
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('close', (code) => {
    if (code !== 0) {
      process.exit(code);
    }
    done();
  });
});

gulp.task('default', () => {
  gulp.watch(['src/**', 'test/**'], gulp.series('test'));
});

gulp.task('test', () => {
  return gulp.src('.')
    .pipe(jest({
      rootDir: './',
      testDirectoryName: 'test',
      preprocessorIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/']
    }));
});

const commitready = gulp.series('securityScan', 'test');

gulp.task('commitready', commitready);
