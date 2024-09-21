const { override, useBabelRc, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
    useBabelRc(),
    addWebpackModuleRule({
        test: /\.config$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    }),
);
