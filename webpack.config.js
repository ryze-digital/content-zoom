import path from 'path';

/**
 * @param {string} env
 * @param {object} argv
 * @returns {object}
 */
export default function(env, argv) {
    const mode = argv.watch ? 'development' : 'production';

    return {
        mode,
        devtool: false,
        entry: './index.js',
        output: {
            path: path.resolve('./demos/build'),
            filename: 'demo.js',
            library: {
                type: 'module',
            }
        },
        experiments: {
            outputModule: true
        }
    };
};