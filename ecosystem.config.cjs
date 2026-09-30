module.exports = {
  apps: [
    {
      name: "white-board-app",
      script: "npm",
      args: "start",
      cwd: "/home/ubuntu/douxdev/white-board-app",
      instances: 1,
      exec_mode: "fork",
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT || 4440,
      },
    },
  ],
}
