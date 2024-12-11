import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(process.cwd(), '..', '..', '..');

const configFileName = 'ama.rules.json';
const configFilePath = path.join(projectRoot, configFileName);
const defaultConfig = {
  rules: {},
  accessibilityLabelExceptions: [],
};

if (!fs.existsSync(configFilePath)) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
    console.log(`[AMA]: Rules file created at ${configFilePath}`);
  } catch (error) {
    console.error('[AMA]: Error creating rules file:', error);
  }
}
