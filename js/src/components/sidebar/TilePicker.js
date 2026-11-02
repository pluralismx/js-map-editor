import Component from "../../../core/component.js"

export default class TilePicker extends Component {
    constructor(props = {}) {
        super(props, "div");
        this.props = props;
        this.tileSize = 32;
        this.tileSheet = null;
        this.currentImageUrl = null;
        this.image = null;
        this.selectedTile = null;
        this.sheetDebug = 0;
        this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
        this.render();
    }

    async setupCanvas() {
        console.log("app state has changed");

        const sheetSet = await this.setSheet();

        if (!sheetSet || !this.image) return;

        const canvas = this.element.querySelector("canvas");
        if (!canvas) return;

        canvas.width = this.image.naturalWidth;
        canvas.height = this.image.naturalHeight;

        if (!this.hasClickEvent) {
            canvas.addEventListener("click", this.boundHandleCanvasClick);
            this.hasClickEvent = true;
        }

        this.draw();
    }

    async setSheet() {
        if (!this.props.tileSheetData) return false;

        if (this.tileSheet === this.props.tileSheetData && this.image) {
            return true;
        }

        this.tileSheet = this.props.tileSheetData;

        if (this.currentImageUrl) {
            URL.revokeObjectURL(this.currentImageUrl);
        }

        this.currentImageUrl = URL.createObjectURL(this.tileSheet.file);
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                resolve(true); 
            };
            img.onerror = () => {
                resolve(false); 
            };
            img.src = this.currentImageUrl;
        });
    }

    handleCanvasClick(event) {
        console.log("Entrada a la funcion handleCanvasClick");
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        const tileCol = Math.floor(clickX / this.tileSize);
        const tileRow = Math.floor(clickY / this.tileSize);

        this.selectedTile = { x: tileCol, y: tileRow };

        this.draw();

        if (this.props.onSelectBrush) {
            console.log("Ya se aviso al componente padre que se selecciono una brocha nueva: ", this.selectedTile);
            this.props.onSelectBrush(this.getBrush());
        }
    }

    draw() {
        const canvas = this.element.querySelector("canvas");
        if (!canvas || !this.image) return;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, 0, 0);

        this.drawGrid(ctx, canvas.width, canvas.height);
        this.drawSelection(ctx);
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

    drawSelection(ctx) {
        if (!this.selectedTile) return;

        const xPosition = this.selectedTile.x * this.tileSize;
        const yPosition = this.selectedTile.y * this.tileSize;

        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(xPosition, yPosition, this.tileSize, this.tileSize);
        
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(xPosition, yPosition, this.tileSize, this.tileSize);
    }

    getBrush() {
        if (!this.selectedTile || !this.image) return null;

        return {
            image: this.image,
            sx: this.selectedTile.x * this.tileSize,
            sy: this.selectedTile.y * this.tileSize,
            sWidth: this.tileSize,
            sHeight: this.tileSize
        };
    }

    onPropsUpdated(){
        this.setupCanvas()
    }

    render(){
        this.hasClickEvent = false; 

        this.element.innerHTML = /*html*/ `
            <div class="sidebar-section-header">
                <span style="font-weight: bold;">Tile picker</span>
            </div>
            <div class="form-field-vertical">
                <label>Active sheet:</label>
                <div id="tile-picker-container" style="overflow: auto; max-width: 100%; max-height: 400px;">
                    <canvas class="tile-sheet-canvas" style="cursor: crosshair;"></canvas>
                </div>
            </div>
        `;
    }
}