import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(process.cwd(), '..', '..', '..');

const configFileName = 'ama.config.json';
const configFilePath = path.join(projectRoot, configFileName);
const defaultConfig = {
  rules: {},
  accessibilityLabelExceptions: [],
  log: 'inspect',
};

if (!fs.existsSync(configFilePath)) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
    console.log(`[AMA]: Config file created at ${configFilePath}`);
  } catch (error) {
    console.error('[AMA]: Error creating config file:', error);
  }
}
