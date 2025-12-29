// Interactive Terminal for Technical Brutalist Portfolio

class InteractiveTerminal {
    constructor() {
        this.terminal = document.querySelector('.terminal-prompt');
        this.cursor = document.querySelector('.terminal-cursor');
        this.output = document.querySelector('.terminal-output');
        this.commands = [
            'ls -la',
            'cat README.md',
            'git status',
            'npm run build',
            'whoami',
            './deploy.sh',
            'ps aux',
            'tail -f logs/app.log',
            'ssh user@production',
            'docker ps'
        ];
        this.currentCommandIndex = 0;
        this.isTyping = false;
        this.currentText = '';
        this.typingSpeed = 100;

        this.init();
    }

    init() {
        if (!this.terminal) return;

        // Make cursor clickable
        if (this.cursor) {
            this.cursor.style.cursor = 'pointer';
            this.cursor.addEventListener('click', () => this.executeRandomCommand());
        }

        // Add keyboard interaction
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.executeRandomCommand();
            }
        });

        // Auto-cycle commands every 8 seconds
        setInterval(() => {
            if (!this.isTyping) {
                this.executeRandomCommand();
            }
        }, 8000);

        // Initial command after 3 seconds
        setTimeout(() => {
            this.executeRandomCommand();
        }, 3000);
    }

    async executeRandomCommand() {
        if (this.isTyping) return;

        const command = this.commands[Math.floor(Math.random() * this.commands.length)];
        await this.typeCommand(command);
        await this.showOutput(command);
    }

    async typeCommand(command) {
        this.isTyping = true;
        this.currentText = '';

        // Update the command display
        const commandElement = this.terminal.querySelector('.terminal-command');
        if (commandElement) {
            commandElement.textContent = '';
        }

        for (let i = 0; i < command.length; i++) {
            this.currentText += command[i];
            if (commandElement) {
                commandElement.textContent = this.currentText;
            }
            await this.delay(this.typingSpeed);
        }

        this.isTyping = false;
    }

    async showOutput(command) {
        // Simulate command execution with realistic outputs
        const outputs = {
            'ls -la': 'drwxr-xr-x 12 user user 4096 Dec 29 15:30 .\ndrwxr-xr-x  4 user user 4096 Dec 29 14:20 ..\n-rw-r--r--  1 user user  452 Dec 29 15:30 index.html\n-rw-r--r--  1 user user  234 Dec 29 15:25 style.css\n-rw-r--r--  1 user user   89 Dec 29 15:20 package.json\ndrwxr-xr-x  2 user user 4096 Dec 29 15:10 assets/',
            'cat README.md': '# Deepak G - Developer Portfolio\n\nA modern, high-performance portfolio website...\n\n> Building resilient digital systems with precision code.',
            'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges to be committed:\n  (use "git reset HEAD <file>..." to unstage)\n\n\tmodified:   index.html\n\tmodified:   style.css\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\n\tterminal.js',
            'npm run build': '> portfolio@1.0.0 build\n> tailwindcss -i input.css -o style.css --minify\n\n✅ Build complete! Deploying to production...',
            'whoami': 'deepak-g\nFull Stack Developer | System Architect\nCurrently: Available for new opportunities',
            './deploy.sh': '🚀 Deploying to production...\n✅ Code pushed to GitHub\n✅ Vercel deployment triggered\n✅ Site live at: https://deepak-g.vercel.app\n✅ Performance: 98/100 Lighthouse',
            'ps aux': 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nuser      1234  2.1  1.2 456789 23456 pts/0    Sl   10:30   0:15 node server.js\ndeepak    5678  0.8  0.9 345678 19876 pts/1    S    11:45   0:08 tailwindcss --watch\ndeepak    9012  1.5  2.1 567890 45678 pts/2    Sl   12:00   0:22 code',
            'tail -f logs/app.log': '[INFO] Server started on port 3000\n[INFO] Database connected successfully\n[INFO] All systems operational\n[INFO] Portfolio deployed successfully',
            'ssh user@production': 'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)\n\n * Documentation:  https://help.ubuntu.com\n * Management:     https://landscape.canonical.com\n * Support:        https://ubuntu.com/advantage\n\nLast login: Mon Dec 25 08:30:15 2024 from 192.168.1.100\nuser@production:~$ ',
            'docker ps': 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                    NAMES\n1a2b3c4d5e6f   nginx:alpine   "nginx -g \'daemon of…"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp       portfolio-web\n2b3c4d5e6f7a   postgres:15    "docker-entrypoint.s…"   2 hours ago     Up 2 hours     5432/tcp                 portfolio-db\n3c4d5e6f7a8b   redis:7        "docker-entrypoint.s…"   2 hours ago     Up 2 hours     6379/tcp                 portfolio-cache'
        };

        const output = outputs[command] || `Command executed: ${command}\nStatus: Success ✅`;

        if (this.output) {
            this.output.textContent = output;
            this.output.style.display = 'block';

            // Hide output after 5 seconds
            setTimeout(() => {
                if (this.output) {
                    this.output.style.display = 'none';
                }
            }, 5000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveTerminal();
});
