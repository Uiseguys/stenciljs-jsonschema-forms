const sass = require('@stencil/sass');

exports.config = {
    namespace: 'JsonSchema',
    generateDistribution: true,
    // serviceWorker: true,
    outputTargets: [
        { type: 'www' },
        { type: 'dist' }
    ],
    bundles: [],
    plugins: [
        sass()
    ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
