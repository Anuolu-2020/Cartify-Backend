// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
	dsn: "https://0c706e6e3d06766979210f4789b52e38@o4507763422658560.ingest.us.sentry.io/4507822870167552",
	integrations: [nodeProfilingIntegration()],
	// Tracing
	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// Set sampling rate for profiling - this is relative to tracesSampleRate
	profilesSampleRate: 1.0,
});
