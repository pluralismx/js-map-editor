import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";
import NewSpriteSheetModal from "../modals/NewSpriteSheetModal.js";
import TileTypesModal from "../modals/TileTypesModal.js";
import AddTileSheetModal from "../modals/AddTileSheet.js";

export default class Sidebar extends Component {
    
    constructor(props = {}){
        super("div");
        this.props = props;
        this.newSpriteSheetModal = new NewSpriteSheetModal();
        this.tileTypesModal = new TileTypesModal();
        this.AddTileSheetModal = new AddTileSheetModal();
        this.currentPreviewUrl = "";
        this.mapData = null;
    }

    loadMapData(mapData){
        this.mapData = mapData;
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

    openTileTypesModal() {
        this.tileTypesModal.toggle()
    }

    handleUploadSheet() {
        this.props.onNewSpriteSheetClick();
    }

    handleAddSheet() {
        this.AddTileSheetModal.toggle();
    }

    render() {
        this.element.innerHTML = /*html*/ `
            <div>
                <div class="form-field-vertical">
                    <label>Map name: </label>
                    <input class="input-basic" type="type" value="${this.mapData?this.mapData.name : ""}"/>
                </div>




                <div class="field-set-row">
                    <div class="form-field-vertical">
                        <label>Width: </label>
                        <input class="input-basic" type="number" value="${this.mapData?this.mapData.width + " tiles" : ""}"/>
                    </div>
                    <div class="form-field-vertical">
                        <label>Height: </label>
                        <input class="input-basic" type="number" value="${this.mapData?this.mapData.height + " tiles" : ""}"/>
                    </div>
                </div>

                <div class="form-field-vertical">
                    <label>Tile size: </label>
                    <input class="input-basic" type="number" value="${this.mapData?this.mapData.tileSize+"px" : ""}"/>
                </div>
                
                



                <div class="tile-types-section">
                    <div class="tile-types-container">
                        <label>Tile types:</label>
                        <div class="pills-container">
                            <div class="pill">
                                <span>Dirt<span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="button-basic" data-click="openTileTypesModal">New</button>
                        <button class="button-basic" data-click="openTileTypesModal">Edit</button>
                        <button class="button-basic" data-click="openTileTypesModal">Delete</button>
                    </div>
                </div>





                

                <div class="tile-types-section">
                    <div class="tile-types-container">
                        <label>Tile sheets:</label>
                        <div class="pills-container">
                            <div class="pill">
                                <span>Dirt<span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="button-basic" data-click="handleUploadSheet">Upload</button>
                        <button class="button-basic" data-click="handleAddSheet">Add</button>
                        <button class="button-basic" data-click="handleRemoveSheet">Remove</button>
                    </div>
                </div>
                



                <div class="field-horizontal">
                    <span>Tile sheet: </span>
                </div>
                <div id="tile-sheet-picker-container"></div>
                <div id="tile-type-select"></div>
            
            </div>
        `;

        return this.element;
    }
}