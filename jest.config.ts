import type {Config} from 'jest';

const config: Config = {
    transform: {
        '^.+\\.ts$': ['ts-jest', {}]
    },
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
};

export default config;
