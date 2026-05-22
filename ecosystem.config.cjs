module.exports = {
  apps: [
    {
      name: 'b2samifoods-api',
      script: 'server.js',
      instances: 1,          // increase to 'max' if CPU-bound; keep 1 for Socket.io
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
}
