const sass = require('@stencil/sass');

exports.config = {
    namespace: 'form-generator',
    // generateDistribution: true,
    // serviceWorker: true,
    outputTargets: [{ type: 'www' }, { type: 'dist' }],
    plugins: [sass()]
};
