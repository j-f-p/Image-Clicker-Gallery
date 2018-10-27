/*  Local node initialization commands and file initialization
 *  npm init
 *  npm install --save-dev gulp
 *  npm install browser-sync
 *
 *  initialize gulpfile.js:
 */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('default', function() {
  browserSync.init({ server: './' });
  gulp.watch(['index.html', 'app.css', 'app.js'])
      .on('change', browserSync.reload);
});
