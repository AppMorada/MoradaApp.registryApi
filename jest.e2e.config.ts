import config from './jest.config'

config.testRegex = '.*\\.e2e\\.ts$'
config.setupFilesAfterEnv = ['./.jest/setup/flushall-typeorm.ts']

export default config;
