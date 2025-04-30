module.exports = {
    apps: [{
        name: "card-tree",
        script: "npm",
        args: "start",
        env: {
            NODE_ENV: "production",
            PORT: 3000
        },
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        time: true,
        error_file: "logs/err.log",
        out_file: "logs/out.log",
        merge_logs: true,
        watch: false,
        max_memory_restart: "1G"
    }]
} 