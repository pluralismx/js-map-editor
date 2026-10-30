import Component from "../../../core/component.js"

export default class TilePicker extends Component {
    constructor(props = {}) {
        super(props, "div");
        this.props = props;
        this.tileSize =  32;
        this.tileSheet = null;
        this.currentImageUrl = null;
        this.image = null;
    }

    async setSheet() {

        if(!this.props.mapData && !this.props.tileSheetData) return;

        this.mapData = this.props.mapData;
        this.tileSheet = this.props.tileSheetData;

        console.log("se definieron los datos en el metodo: ",this.tileSheet);

        if (this.currentImageUrl) {
            URL.revokeObjectURL(this.currentImageUrl);
        }

        this.currentImageUrl = URL.createObjectURL(this.tileSheet.file);
        
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.draw();
        };
        img.src = this.currentImageUrl;
        this.render();
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
            <canvas>
            </canvas>
        `;
    }
}