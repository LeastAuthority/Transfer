import glob from 'glob';
import fs from 'fs';

import clipboardy from 'clipboardy';

/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on: Function, config: Record<string, any>) => {
  on('task', {
    clearDownloads(): null {
      glob('./cypress/downloads/*', {}, (err, files) => {
        for (const file of files) {
          fs.unlinkSync(file);
        }
      });
      return null;
    },
    readClipboard(): string {
      return clipboardy.readSync();
    },
    writeClipboard(text: string): null {
      clipboardy.writeSync(text);
      return null;
    },
  });

  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js',
  });
};
