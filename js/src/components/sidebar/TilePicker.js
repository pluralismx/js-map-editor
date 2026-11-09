import Component from "../../../core/component.js";

export default class TilePicker extends Component {
    constructor(props = {}) {
        super(props, "div");
        this.props = props;
        
        this.tileSize = props.mapData?.tileSize || 32;
        this.selectedTile = null;
        this.bitmap = null;
        
        this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
        
        this.render();
    }

    onPropsUpdated() {
        if (this.props.mapData?.tileSize) {
            this.tileSize = this.props.mapData.tileSize;
        }
    }

    setupCanvas() {
        const activeSheetId = this.props.activeTileSheet; 
        const tileSheetsDict = this.props.activeMapTileSheets;

        const canvas = this.element.querySelector("canvas");
        if (!canvas) {
            console.warn("No se encontró el elemento canvas en el DOM.");
            return;
        }

        if (!activeSheetId || !tileSheetsDict || !tileSheetsDict[activeSheetId]) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.bitmap = null;
            return;
        }

        this.bitmap = tileSheetsDict[activeSheetId].bitmap;
        canvas.width = this.bitmap.width;
        canvas.height = this.bitmap.height;

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    handleCanvasClick(event) {
        
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
            this.props.onSelectBrush(this.getBrush());
        }
    }

    getBrush() {
        if (!this.selectedTile || !this.bitmap) return null;
        return {
            tileSheetId: this.props.activeTileSheet,
            sx: this.selectedTile.x * this.tileSize,
            sy: this.selectedTile.y * this.tileSize,
            sWidth: this.tileSize,
            sHeight: this.tileSize,
            tileClass: this.getTileClass() 
        };
    }

    getTileId() {
        if (!this.selectedTile || !this.bitmap) return null;
        const sheetCols = this.bitmap.width / this.tileSize;

        return (this.selectedTile.y * sheetCols) + this.selectedTile.x;
    }

    getTileClass() {
        const tileId = this.getTileId();
        const mapData = this.props.mapData;
        const sheetId = this.props.activeTileSheet; 

        if (tileId === null || !mapData?.tileMappings || !sheetId) return null;

        const className = mapData.tileMappings[sheetId]?.[tileId];
        
        if (!className) return null;

        return mapData.tileClasses?.find(c => c.name === className) || null;
    }

    draw() {
        const canvas = this.element.querySelector("canvas");
        if (!canvas || !this.bitmap) return;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.bitmap, 0, 0);

        this.drawGrid(ctx, this.bitmap.width, this.bitmap.height);
        this.drawSelection(ctx);
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = "rgb(111, 111, 111, 0.5)";
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

    render() {
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

        const canvas = this.element.querySelector("canvas");
        canvas.addEventListener("click", this.boundHandleCanvasClick);
        this.setupCanvas();
    }
}