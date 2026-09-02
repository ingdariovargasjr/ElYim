const os = require('node:os')

// Capacitor 8 queries os.userInfo() on startup. This fallback keeps the CLI
// usable in the managed Windows runtime when that system call reports ENOMEM.
os.userInfo = () => ({ username: process.env.USERNAME || 'developer' })

require('@capacitor/cli/dist/index').run()
