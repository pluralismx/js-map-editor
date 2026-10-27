import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

import TileTypesModal from "../modals/TileTypesModal.js";
import AddTileSheetModal from "../modals/AddTileSheetModal.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(){
        super("div");
        this.tileTypesModal = new TileTypesModal();

        // Pasamos una funcion como prop para vincular al padre con el hijo
        this.addTileSheetModal = new AddTileSheetModal({
            onSelectSheet: (selectedSheet) => this.handleAddSheet(selectedSheet)
        });
        this.tilePicker = new TilePicker();
        this.currentPreviewUrl = "";
        this.mapData = null;
        this.activeSheet = "";
        this.isEditing = false;
    }

    loadMapData(mapData){
        this.mapData = mapData;
        this.render();
    }

    handleOpenTileTypesModal(){
        this.tileTypesModal.toggle();
    }



    handleOpenAddSheetModal() {
        if(!this.mapData){
            alert("You must open a map first");
            return;
        }
        this.addTileSheetModal.toggle();
    }

    handleEditProperties() {
        if(!this.mapData){
            alert("You must load a map first"); return;
        }

        if (!this.isEditing){
            this.isEditing = true; 
            this.render();
            return;
        }

        if(this.isEditing){
            this.isEditing = false; 
            this.render();
            return;
        }
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
            await storageService.put("maps", this.mapData);
            this.render();
        } catch (err) {
            console.error("Error al actualizar el mapa con la nueva hoja:", err);
        }
    }

    handleSetSheet(target) {        
        this.activeSheet = target.value;
        this.tilePicker.setSheet(this.activeSheet);
    }

    handleUpdateProperties(){
        const form = document.querySelector("#map-properties-form");
        const formData = new FormData(form);
        
        this.mapData.name = formData.get("name");
        this.mapData.width = formData.get("width");
        this.mapData.height = formData.get("height");
        this.mapData.tileSize = formData.get("tileSize");

        try{
            if(storageService.put("maps", this.mapData)){
                alert("Map updated!");
            }
        }catch(err){
            console.warn(err);
        }
    }

    render() {
        this.element.innerHTML = /*html*/ `
        
            <!-- Map properties -->
            <section>
                <div class="sidebar-section-header">
                    <span style="font-weight: bold;">Properties</span>
                </div>
                <form id="map-properties-form">
                    <div class="form-field-vertical">
                        <label>Map name: </label>
                        <input
                            name="name"
                            style="${!this.isEditing ? `color: white` : `color: black`}" 
                            class="input-basic" 
                            type="text" 
                            value="${this.mapData?this.mapData.name : ""}"
                            ${!this.isEditing && `disabled`}
                        />
                    </div>
                    <div class="field-set-row">
                        <div class="form-field-vertical" style="flex-grow: 1;">
                            <label>Width: </label>
                            <input
                                name="width" 
                                style="${!this.isEditing ? `color: white` : `color: black`}" 
                                class="input-basic" 
                                type="number" 
                                value="${this.mapData?this.mapData.width : ""}"
                                ${!this.isEditing && `disabled`}
                            />
                        </div>
                        <div class="form-field-vertical" style="flex-grow: 1;">
                            <label>Height: </label>
                            <input
                                name="height"
                                style="${!this.isEditing ? `color: white` : `color: black`}"  
                                class="input-basic" 
                                type="number" 
                                value="${this.mapData?this.mapData.height : ""}"
                                ${!this.isEditing && `disabled`}
                            />
                        </div>
                    </div>

                    <div class="field-set-row">
                        <div class="form-field-vertical" style="width: 50%;">
                            <label>Tile size: </label>
                            <input
                                name="tileSize"
                                style="${!this.isEditing ? `color: white` : `color: black`}"  
                                class="input-basic" 
                                type="number" 
                                value="${this.mapData?this.mapData.tileSize : ""}"
                                ${!this.isEditing && `disabled`}
                            />
                        </div>
                        <div class="form-field-vertical" style="width: 50%;">
                            <label>Actions</label>
                            <div style="display: flex; justify-content: space-between; height: 100%; gap: 1rem;">
                                <button 
                                    type="button" 
                                    class="button-basic" 
                                    style="width: 50%"
                                    ${!this.mapData && `disabled`}  
                                    data-click="handleEditProperties">${!this.isEditing ? "Edit" : "Cancel"}
                                </button>
                                <button 
                                    type="button" 
                                    class="button-basic" 
                                    style="width: 50%"
                                    ${!this.isEditing && `disabled`} 
                                    data-click="handleUpdateProperties">Update
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>






            <!-- Linked Tile sheets -->
            <section>
                <!-- Header -->
                <div class="sidebar-section-header">
                    <span style="font-weight: bold;">Assets</span>
                </div>

                <!-- Tilesheet select -->
                <div class="field-set-row">
                    <div class="form-field-vertical" style="width: 50%;">
                        <label>Tile sheets:</label>
                        <select
                            data-change="handleSetSheet" 
                            style="padding: .25rem;"
                            ${!this.mapData && `disabled`} 
                        >
                            <option selected>Select a tile sheet</option>
                            ${this.mapData?.tileSheets.map(sheet => `
                                <option value="${sheet.id || sheet}">${sheet}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-field-vertical" style="width: 50%">
                        <label>Actions</label>
                        <div style="display: flex; height: 100%; justify-content: space-between; gap: 1rem;">
                            <button
                                class="button-basic"
                                style="width: 50%;"
                                data-click="handleOpenAddSheetModal"
                                ${!this.mapData && `disabled`}
                            >
                                Add
                            </button>
                            <button
                                class="button-basic"
                                style="width: 50%;"
                                ${!this.mapData && `disabled`} 
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tilepicker -->
                <div class="form-field-vertical">
                    <label>Selected sheet:</label>
                    <div id="tile-picker-container"></div>
                </div>
            </section>



            <!-- tile types -->

        `;

        return this.element;
    }
}