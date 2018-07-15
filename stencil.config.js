const sass = require('@stencil/sass');

exports.config = {
    namespace: 'formGenerator',
    // generateDistribution: true,
    // serviceWorker: true,
    outputTargets: [{ type: 'www' }, { type: 'dist' }],
    plugins: [sass()]
};
