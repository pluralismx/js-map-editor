import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js"
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(props = {}){
        super("div");
        this.props = props;
        this.sheets = [];
        this.currentPreviewUrl = "";
        this.loadTileSheets();
        this.mapData = null;
        this.tilePicker = new TilePicker();
    }

    loadMapData(mapData){
        this.mapData = mapData;
        this.render();
    }

    async loadTileSheets() {
        try{
            const sheets = await storageService.getAll("spritesheets");
            if(sheets){
                this.sheets = sheets;
            }
        }catch(err){
            console.warn(err);
        }
        this.render();
    }

    async handleSheetChange(target) {
        const sheetId = target.value;
        try {
            const sheet = await storageService.getById("spritesheets", sheetId);
            if (!sheet?.file) return;
            this.tilePicker.setSheet(sheet.file);
        } catch (err) {
            console.error("Error al cargar la hoja seleccionada:", err);
        }
    }

    render() {
        this.element.innerHTML = `
            <div>
                <div>
                    <span>Map: <span class="pink">${this.mapData?this.mapData.name : ""}</span></span>
                </div>
                <div>
                    <span>Width: <span class="pink">${this.mapData?this.mapData.width + " tiles" : ""}</span></span>
                </div>
                <div>
                    <span>Height: <span class="pink">${this.mapData?this.mapData.height + " tiles" : ""}</span></span>
                </div>
                <div>
                    <span>Tile size: <span class="pink">${this.mapData?this.mapData.tileSize+"px" : ""}</span></span>
                </div>
                <div class="field-horizontal">
                    <span>Tile sheet: </span>
                    <select data-change="handleSheetChange">
                        <option selected>Select tile sheet</option>
                        ${this.sheets.map(sheet => `
                            <option value="${sheet.id || sheet.name}">${sheet.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div id="tile-sheet-picker-container">
                    
                </div>
            
            </div>
        `;

        return this.element;
    }
}