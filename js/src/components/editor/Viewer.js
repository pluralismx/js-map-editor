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

        // Control de arrastre
        this.isPanning = false;
        this.isSpacePressed = false;
        this.startX = 0;
        this.startY = 0;

        this.setupControls();
        this.start();
        this.render();
    }

    start() {
        if(!this.props.test){
            console.log("Ha! test data no existe en props");
            return;
        }

        const mapData = this.props.mapData;
        console.log("test", mapData);

        this.cols = Number(mapData.width) || 25;
        this.rows = Number(mapData.height) || 15;
        this.tileSize = Number(mapData.tileSize) || 32;

        this.element.width = this.cols * this.tileSize;
        this.element.height = this.rows * this.tileSize;

        // Centrar el mapa al inicio
        this.centerMap();
        this.updateTransform();
        this.drawTestGrid();
    }

    centerMap() {
        const parent = this.element.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        // Centrado inicial
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

        // 2. Iniciar arrastre (Botón central o Espacio + Clic izquierdo)
        this.element.addEventListener("mousedown", (e) => {
            if (this.isSpacePressed || e.button === 1) { // 1 = botón de la rueda del ratón
                e.preventDefault();
                this.isPanning = true;
                this.startX = e.clientX - this.panX;
                this.startY = e.clientY - this.panY;
                this.element.style.cursor = "grabbing";
            }
        });

        // 3. Mover la cámara
        window.addEventListener("mousemove", (e) => {
            if (!this.isPanning) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.updateTransform();
        });

        // 4. Detener arrastre
        window.addEventListener("mouseup", () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.element.style.cursor = this.isSpacePressed ? "grab" : "default";
            }
        });

        // 5. Zoom In / Zoom Out con la rueda del ratón
        this.element.parentElement?.addEventListener("wheel", (e) => {
            e.preventDefault();

            const zoomFactor = 1.15;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calcular nueva escala (límites entre 0.1x y 10x)
            let newScale = e.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;
            newScale = Math.min(Math.max(0.1, newScale), 10);

            // Zoom centrado hacia la posición actual del cursor
            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;

            this.updateTransform();
        }, { passive: false });
    }

    updateTransform() {
        this.element.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }

    drawTestGrid() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
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
        console.log(this.props);
        this.element.id = "map-canvas";
        return this.element;
    }
}