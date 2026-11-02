import Component from "../../../core/component.js";

export default class Viewer extends Component {
    constructor(props={}) {
        super(props, "canvas");
        this.props = props;
        this.ctx = this.element.getContext("2d");

        // Estado de la cámara
        this.scale = 1;
        this.panX = 0;
        this.panY = 0;

        // Control de arrastre y dibujo
        this.isPanning = false;
        this.isPainting = false;
        this.isSpacePressed = false;
        this.startX = 0;
        this.startY = 0;

        // Brocha actual y datos del mapa
        this.activeBrush = null;
        this.mapTiles = []; 

        this.setupControls();
    }

    onPropsUpdated() {
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

        this.cols = Number(mapData.width) || 25;
        this.rows = Number(mapData.height) || 15;
        this.tileSize = Number(mapData.tileSize) || 32;

        this.element.width = this.cols * this.tileSize;
        this.element.height = this.rows * this.tileSize;

        // Solo inicializar la matriz y centrar la cámara si el mapa es nuevo 
        // o si las dimensiones cambiaron
        const needsInitialization = this.mapTiles.length === 0 || 
                                    this.mapTiles.length !== this.rows || 
                                    this.mapTiles[0].length !== this.cols;

        if (needsInitialization) {
            this.mapTiles = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
            this.centerMap();
        }

        this.updateTransform();
        this.drawMap();
    }

    // Método para recibir la brocha desde tu TilePicker (llámalo desde tu componente principal)
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
        // 1. Detectar Barra Espaciadora para activar la "manita"
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
                this.element.style.cursor = "default";
            }
        });

        // 2. Iniciar arrastre o dibujo
        this.element.addEventListener("mousedown", (e) => {
            if (this.isSpacePressed || e.button === 1) { 
                // Paneo
                e.preventDefault();
                this.isPanning = true;
                this.startX = e.clientX - this.panX;
                this.startY = e.clientY - this.panY;
                this.element.style.cursor = "grabbing";
            } else if (e.button === 0 && !this.isSpacePressed) { 
                // Dibujar (Click izquierdo sin espacio)
                this.isPainting = true;
                this.paintTile(e);
            }
        });

        // 3. Mover la cámara o pintar rastro
        window.addEventListener("mousemove", (e) => {
            if (this.isPanning) {
                this.panX = e.clientX - this.startX;
                this.panY = e.clientY - this.startY;
                this.updateTransform();
            } else if (this.isPainting) {
                this.paintTile(e);
            }
        });

        // 4. Detener arrastre y dibujo
        window.addEventListener("mouseup", () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.element.style.cursor = this.isSpacePressed ? "grab" : "default";
            }
            this.isPainting = false;
        });

        // 5. Zoom In / Zoom Out
        this.element.parentElement?.addEventListener("wheel", (e) => {
            e.preventDefault();

            const zoomFactor = 1.15;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            let newScale = e.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;
            newScale = Math.min(Math.max(0.1, newScale), 10);

            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;

            this.updateTransform();
        }, { passive: false });
    }

    updateTransform() {
        this.element.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }

    paintTile(e) {
        if (!this.activeBrush) return;

        // Calcular posición considerando el transform (Translate y Scale de CSS)
        const rect = this.element.getBoundingClientRect();
        
        const scaleX = this.element.width / rect.width;
        const scaleY = this.element.height / rect.height;

        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        // Obtener la columna y fila del mapa
        const col = Math.floor(canvasX / this.tileSize);
        const row = Math.floor(canvasY / this.tileSize);

        // Validar que el click esté dentro de los límites del mapa
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            // Guardar la brocha en esa posición y redibujar
            this.mapTiles[row][col] = this.activeBrush;
            this.drawMap();
        }
    }

    drawMap() {
        // 1. Limpiar canvas
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);

        // 2. Dibujar todos los tiles guardados
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const brush = this.mapTiles[r][c];
                if (brush) {
                    this.ctx.drawImage(
                        brush.image,
                        brush.sx, brush.sy, brush.sWidth, brush.sHeight, // Origen (Recorte)
                        c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize // Destino
                    );
                }
            }
        }

        // 3. Dibujar la cuadrícula por encima
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
        // Asegurar que el canvas cambie su origen de transformación para que el paneo/zoom sea fluido
        this.element.style.transformOrigin = "0 0"; 
        return this.element;
    }
}