import config from './jest.config'

config.setupFilesAfterEnv = []
config.testRegex = '.*\\.spec\\.ts$'
config.testTimeout = 5000

export default config;
