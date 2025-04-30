module.exports = {
    apps: [{
        name: "card-tree",
        script: "npm",
        args: "start",
        env: {
            NODE_ENV: "production",
            PORT: 3000,
            HOST: "0.0.0.0"
        },
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        time: true,
        error_file: "logs/err.log",
        out_file: "logs/out.log",
        merge_logs: true,
        watch: false,
        max_memory_restart: "1G",
        exp_backoff_restart_delay: 100,
        wait_ready: true,
        kill_timeout: 3000,
        max_restarts: 10
    }]
} 