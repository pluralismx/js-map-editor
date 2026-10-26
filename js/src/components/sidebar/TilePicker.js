import Component from "../../../core/component.js"

export default class TilePicker extends Component {
    constructor(props = {}) {
        super("div");
        this.props = props;
        this.tileSize = props.tileSize || 32;
        this.currentImageUrl = null;
        this.image = null;
    }

    // Método que Sidebar invoca cuando el usuario cambia el select
    async setSheet(fileBlob) {
        if (this.currentImageUrl) {
            URL.revokeObjectURL(this.currentImageUrl);
        }

        this.currentImageUrl = URL.createObjectURL(fileBlob);
        
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.draw();
        };
        img.src = this.currentImageUrl;
    }

    draw() {
        const canvas = this.element.querySelector("canvas");
        if (!canvas || !this.image) return;

        const ctx = canvas.getContext("2d");
        canvas.width = this.image.naturalWidth;
        canvas.height = this.image.naturalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, 0, 0);

        this.drawGrid(ctx, canvas.width, canvas.height);
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += this.tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += this.tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    render(){
        this.element.innerHTML = `
            <canvas id="tilesheet-canvas"></canvas>
        `;
    }
}