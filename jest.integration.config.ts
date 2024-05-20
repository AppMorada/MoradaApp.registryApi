import config from './jest.config'

config.setupFilesAfterEnv = []
config.testRegex = '.*\\.test\\.ts$'

export default config;
