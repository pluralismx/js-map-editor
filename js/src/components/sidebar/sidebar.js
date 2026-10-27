import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";
import NewTileSheetModal from "../modals/NewTileSheetModal.js";
import TileTypesModal from "../modals/TileTypesModal.js";
import AddTileSheetModal from "../modals/AddTileSheet.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(){
        super("div");
        this.newTileSheetModal = new NewTileSheetModal();
        this.tileTypesModal = new TileTypesModal();

        // Pasamos una funcion como prop para vincular al padre con el hijo
        this.addTileSheetModal = new AddTileSheetModal({
            onSelectSheet: (selectedSheet) => this.handleAddSheet(selectedSheet)
        });
        this.tilePicker = new TilePicker();
        this.currentPreviewUrl = "";
        this.mapData = null;
        this.activeSheet = "";
    }

    loadMapData(mapData){
        this.mapData = mapData;
        this.render();
    }

    handleOpenTileTypesModal(){
        this.tileTypesModal.toggle();
    }

    handleOpenUploadSheetModal() {
        this.newTileSheetModal.toggle()
    }

    handleOpenAddSheetModal() {
        if(!this.mapData){
            alert("You must open a map first");
            return;
        }
        this.addTileSheetModal.toggle();
    }

    async handleAddSheet(sheet) {
        if (!this.mapData) {
            console.warn("No hay un mapa cargado actualmente.");
            return;
        }
    
        // 1. Inicializar el array de hojas en el mapa si aún no existe
        this.mapData.tileSheets = this.mapData.tileSheets || [];
    
        // 2. Evitar agregar la misma hoja dos veces (verificar por ID)
        const alreadyExists = this.mapData.tileSheets.some(
            sheetId => (sheetId.id || sheetId) === sheet.id
        );
    
        if (alreadyExists) {
            alert("Esta hoja ya está asociada al mapa.");
            return;
        }
    
        // 3. Guardar solo el ID de la hoja en el mapa (referencia limpia)
        this.mapData.tileSheets.push(sheet.id);
    
        try {
            // 5. Persistir el mapa actualizado en IndexedDB
            await storageService.put("maps", this.mapData);
            
            // 6. Actualizar la vista
            this.render();
        } catch (err) {
            console.error("Error al actualizar el mapa con la nueva hoja:", err);
        }
    }

    handleActiveSheet(target) {
        this.activeSheet = target.id;
        this.tilePicker.setSheet(this.activeSheet);
        
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
                        <input class="input-basic" type="number" value="${this.mapData?this.mapData.width : ""}"/>
                    </div>
                    <div class="form-field-vertical">
                        <label>Height: </label>
                        <input class="input-basic" type="number" value="${this.mapData?this.mapData.height : ""}"/>
                    </div>
                </div>

                <div class="form-field-vertical">
                    <label>Tile size: </label>
                    <input class="input-basic" type="number" value="${this.mapData?this.mapData.tileSize : ""}"/>
                </div>
                
                
                <div class="tile-types-section">
                    <div class="tile-types-container">
                        <label>Tile sheets:</label>
                        <div class="pills-container">
                        ${this.mapData?.tileSheets?.length > 0 
                            ? this.mapData.tileSheets.map(sheet => `
                                <span class="pill">
                                    <span data-click="handleActiveSheet" id="${sheet}">${sheet.name || sheet}</span>
                                </span>
                            `).join('') 
                            : ''}
                        </div>
                    </div>
                    <div>
                        <button class="button-basic" data-click="handleOpenUploadSheetModal">Upload</button>
                        <button class="button-basic" data-click="handleOpenAddSheetModal">Add</button>
                        <button class="button-basic" data-click="handleRemoveSheet">Remove</button>
                    </div>
                </div>

                </div>
                <div class="field-horizontal">
                    <span>Tile sheet: </span>
                    </div>
                    <div id="tile-sheet-picker-container"></div>
                </div>


                <div class="tile-types-section">
                    <div class="tile-types-container">
                        <label>Tile types:</label>
                        <div class="pills-container">
                            <span class="pill">
                                <span>Dirt<span>
                            </span>
                        </div>
                    </div>
                    <div>
                        <button class="button-basic" data-click="handleOpenTileTypesModal">New</button>
                        <button class="button-basic" data-click="openTileTypesModal">Edit</button>
                        <button class="button-basic" data-click="openTileTypesModal">Delete</button>
                    </div>
                </div>

                <div>
                
                
                

            
            </div>
        `;

        return this.element;
    }
}