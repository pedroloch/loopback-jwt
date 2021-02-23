// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  apps: [
    {
      name: 'Backend',
      script: 'dist/index.js',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
