const { notarize } = require('@electron/notarize');
const { build } = require('../../package.json');

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (process.env.CI !== 'true') {
    console.warn('Skipping notarizing step. Packaging is not running in CI');
    return;
  }

  const appleIdPassword =
    process.env.APPLE_APP_SPECIFIC_PASSWORD || process.env.APPLE_ID_PASS;

  if (
    !(
      'APPLE_ID' in process.env &&
      appleIdPassword &&
      'APPLE_TEAM_ID' in process.env
    )
  ) {
    console.warn(
      'Skipping notarizing step. APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD (or APPLE_ID_PASS), and APPLE_TEAM_ID must be set'
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    tool: 'notarytool',
    appBundleId: build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
