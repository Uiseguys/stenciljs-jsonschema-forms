import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
    namespace: 'form-generator',
    // generateDistribution: true,
    // serviceWorker: true,
    outputTargets: [{ type: 'www' }, { type: 'dist' }],
    plugins: [sass()]
};
