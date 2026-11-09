import Component from "../../../core/component.js";

export default class Viewer extends Component {
    constructor(props={}) {
        super(props, "canvas");
        this.props = props;
        this.ctx = this.element.getContext("2d");

        this.scale = 1;
        this.panX = 0;
        this.panY = 0;

        this.isPanning = false;
        this.isInteracting = false;
        this.isSpacePressed = false;
        this.startX = 0;
        this.startY = 0;

        this.activeBrush = null;
        this.tileSheets = {};
        this.mapTiles = [];
        this.tileMatrix = [];

        this.setupControls();
    }

    onPropsUpdated() {
        this.tileSheets = this.props.activeMapTileSheets || {};
        this.start();

        if (this.props.activeBrush !== undefined) {
            this.setBrush(this.props.activeBrush);
        }
    }

    start() {
        if(!this.props.mapData){
            return;
        }

        const mapData = this.props.mapData;

        this.cols = Number(mapData.metadata.width) || 1;
        this.rows = Number(mapData.metadata.height) || 1;
        this.tileSize = Number(mapData.metadata.tileSize) || 32;

        this.element.width = this.cols * this.tileSize;
        this.element.height = this.rows * this.tileSize;

        const needsInitialization = this.mapTiles.length === 0 || 
                                    this.mapTiles.length !== this.rows || 
                                    this.mapTiles[0].length !== this.cols ||
                                    this.tileMatrix[0].length !== this.cols;

        if (needsInitialization) {
            this.mapTiles = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
            this.tileMatrix = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
            this.centerMap();
        }

        if(!this.props.mapData.mapTiles){
            this.updateTransform();
            this.drawMap();
            return;
        }
        
        this.mapTiles = this.props.mapData.mapTiles;

        this.updateTransform();
        this.drawMap();
    }

    setBrush(brush) {
        this.activeBrush = brush;
    }

    centerMap() {
        const parent = this.element.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        this.panX = (parentWidth - this.element.width * this.scale) / 2;
        this.panY = (parentHeight - this.element.height * this.scale) / 2;
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" && !this.isSpacePressed) {
                this.isSpacePressed = true;
                this.element.style.cursor = "grab";
            }
        });
    
        window.addEventListener("keyup", (e) => {
            if (e.code === "Space") {
                this.isSpacePressed = false;
                this.isPanning = false;
                
                this.element.style.cursor = ""; 
    
                if (this.props && typeof this.props.onControlStop === "function") {
                    this.props.onControlStop();
                }
            }
        });

        this.element.addEventListener("mousedown", (e) => {
            if (this.isSpacePressed || e.button === 1) { 
                e.preventDefault();
                this.isPanning = true;
                this.startX = e.clientX - this.panX;
                this.startY = e.clientY - this.panY;
                this.element.style.cursor = "grabbing";
            } else if (e.button === 0 && !this.isSpacePressed) { 
                this.isInteracting = true;
                this.handleToolAction(e);
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (this.isPanning) {
                this.panX = e.clientX - this.startX;
                this.panY = e.clientY - this.startY;
                this.updateTransform();
            } else if (this.isInteracting) {
                this.handleToolAction(e); 
            }
        });

        window.addEventListener("mouseup", () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.element.style.cursor = this.isSpacePressed ? "grab" : "default";
            }
            this.isInteracting = false; 
        });
    }

    zoom(e){

        // console.log("tools from state", this.activeTool);
        const rect = this.element.getBoundingClientRect();
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.15;
        
        let newScale = null;

        if(this.activeTool == "zoomIn"){
            newScale = this.scale * zoomFactor;
        }else if(this.activeTool == "zoomOut "){
            newScale = this.scale / zoomFactor;
        }

        newScale = Math.min(Math.max(0.1, newScale), 10);

        this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
        this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
        this.scale = newScale;

        this.updateTransform();

    }

    updateTransform() {
        this.element.style.transformOrigin = "0 0";
        this.element.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }

    handleToolAction(e) {
        
        this.activeTool = this.props.activeTool;
;

        if (!this.activeTool) return;

        const rect = this.element.getBoundingClientRect();

        const scaleX = this.element.width / rect.width;
        const scaleY = this.element.height / rect.height;

        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        const col = Math.floor(canvasX / this.tileSize);
        const row = Math.floor(canvasY / this.tileSize);

        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            
            let cellData = null;

            if (this.activeTool === "brush") {
                cellData = {
                    tileSheetId: this.activeBrush.tileSheetId,
                    sHeight: this.activeBrush.sHeight,
                    sWidth: this.activeBrush.sWidth,
                    sx: this.activeBrush.sx,
                    sy: this.activeBrush.sy,
                    tileClass: this.activeBrush.tileClass
                };
            }

            if(this.activeTool == "zoomIn" || this.activeTool == "zoomOut"){
                this.zoom(e);
            }

            this.mapTiles[row][col] = cellData;
            
            // quitar
            this.tileMatrix[row][col] = cellData;
            this.props.mapData.mapTiles = this.mapTiles;
            this.drawMap();
        }
    }

    drawMap() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.mapTiles[r][c];
                const bitmap = cell && this.tileSheets[cell.tileSheetId]?.bitmap;
                if (bitmap) {
                    this.ctx.drawImage(
                        bitmap,
                        cell.sx, cell.sy, cell.sWidth, cell.sHeight,
                        c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize
                    );
                }
            }
        }

        this.drawTestGrid();
    }

    drawTestGrid() {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.element.width; x += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, this.element.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.element.height; y += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(this.element.width, y + 0.5);
            this.ctx.stroke();
        }
    }

    render() {
        this.element.id = "map-canvas";
        this.element.style.transformOrigin = "0 0"; 
        return this.element;
    }
}