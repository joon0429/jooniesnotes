// Windows 10 screensaver-style background animation with cursor interaction

class BackgroundAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.ribbons = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.repelRadius = 150;
        this.repelStrength = 0.3;
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'background-animation';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.15';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Create ribbons
        this.createRibbons();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRibbons() {
        const numRibbons = 8;
        const colors = [
            { r: 255, g: 235, b: 59 },   // Lightning yellow
            { r: 156, g: 39, b: 176 },   // Purple
            { r: 33, g: 150, b: 243 },    // Blue
            { r: 76, g: 175, b: 80 },    // Green
            { r: 255, g: 152, b: 0 },    // Orange
            { r: 233, g: 30, b: 99 },    // Pink
            { r: 0, g: 188, b: 212 },    // Cyan
            { r: 255, g: 255, b: 255 }   // White
        ];

        for (let i = 0; i < numRibbons; i++) {
            this.ribbons.push({
                points: this.generateRibbonPoints(),
                color: colors[i % colors.length],
                speed: 0.5 + Math.random() * 0.5,
                thickness: 15 + Math.random() * 20
            });
        }
    }

    generateRibbonPoints() {
        const points = [];
        const numPoints = 50;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Start from random edge
        const startEdge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        
        switch(startEdge) {
            case 0: // Top
                x = Math.random() * width;
                y = 0;
                vx = (Math.random() - 0.5) * 2;
                vy = Math.random() * 2 + 1;
                break;
            case 1: // Right
                x = width;
                y = Math.random() * height;
                vx = -(Math.random() * 2 + 1);
                vy = (Math.random() - 0.5) * 2;
                break;
            case 2: // Bottom
                x = Math.random() * width;
                y = height;
                vx = (Math.random() - 0.5) * 2;
                vy = -(Math.random() * 2 + 1);
                break;
            case 3: // Left
                x = 0;
                y = Math.random() * height;
                vx = Math.random() * 2 + 1;
                vy = (Math.random() - 0.5) * 2;
                break;
        }
        
        for (let i = 0; i < numPoints; i++) {
            points.push({ x, y, vx, vy });
            x += vx;
            y += vy;
            // Add some randomness
            vx += (Math.random() - 0.5) * 0.5;
            vy += (Math.random() - 0.5) * 0.5;
            // Normalize velocity
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed > 0) {
                vx = (vx / speed) * (1 + Math.random() * 0.5);
                vy = (vy / speed) * (1 + Math.random() * 0.5);
            }
        }
        
        return points;
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    applyRepulsion(ribbon) {
        ribbon.points.forEach(point => {
            const dx = point.x - this.mouseX;
            const dy = point.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.repelRadius) {
                const force = (this.repelRadius - distance) / this.repelRadius;
                const angle = Math.atan2(dy, dx);
                point.vx += Math.cos(angle) * force * this.repelStrength;
                point.vy += Math.sin(angle) * force * this.repelStrength;
            }
        });
    }

    updateRibbon(ribbon) {
        // Apply cursor repulsion
        this.applyRepulsion(ribbon);
        
        // Update points
        ribbon.points.forEach((point, index) => {
            point.x += point.vx;
            point.y += point.vy;
            
            // Add some smooth movement
            point.vx += (Math.random() - 0.5) * 0.1;
            point.vy += (Math.random() - 0.5) * 0.1;
            
            // Damping
            point.vx *= 0.98;
            point.vy *= 0.98;
            
            // Wrap around edges
            if (point.x < 0) point.x = this.canvas.width;
            if (point.x > this.canvas.width) point.x = 0;
            if (point.y < 0) point.y = this.canvas.height;
            if (point.y > this.canvas.height) point.y = 0;
        });
    }

    drawRibbon(ribbon) {
        const points = ribbon.points;
        if (points.length < 2) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        // Draw smooth curve through points
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1] || curr;
            
            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y + (curr.y - prev.y) * 0.5;
            const cp2x = curr.x - (next.x - curr.x) * 0.5;
            const cp2y = curr.y - (next.y - curr.y) * 0.5;
            
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y);
        }
        
        // Create gradient for ribbon
        const gradient = this.ctx.createLinearGradient(
            points[0].x, points[0].y,
            points[points.length - 1].x, points[points.length - 1].y
        );
        
        const c = ribbon.color;
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.3)`);
        gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`);
        gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0.3)`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = ribbon.thickness;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        // Add glow effect
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.5)`;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ribbons.forEach(ribbon => {
            this.updateRibbon(ribbon);
            this.drawRibbon(ribbon);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize background animation
let backgroundAnimation = null;

function initBackgroundAnimation() {
    if (!backgroundAnimation) {
        backgroundAnimation = new BackgroundAnimation();
        backgroundAnimation.init();
    }
}

function destroyBackgroundAnimation() {
    if (backgroundAnimation) {
        backgroundAnimation.destroy();
        backgroundAnimation = null;
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
    initBackgroundAnimation();
}

