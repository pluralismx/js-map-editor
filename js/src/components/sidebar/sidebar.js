import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

import MapProperties from "./MapProperties.js";
import TileTypesModal from "../modals/TileTypesModal.js";
import AddTileSheetModal from "../modals/AddTileSheetModal.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(){
        super("div");
        this.addTileSheetModal = new AddTileSheetModal({
            onSelectSheet: (selectedSheet) => this.handleAddSheet(selectedSheet)
        });
        this.mapProperties = new MapProperties();
        this.tilePicker = new TilePicker();
        this.tileTypesModal = new TileTypesModal();
        this.currentPreviewUrl = "";
        this.mapData = null;
        this.isEditing = false;
        this.activeSheet = "";
        
    }

    loadMapData(mapData){
        this.mapData = mapData;
        this.mapProperties({mapData: this.mapData});
        this.render();
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
        this.mapData.tileSheets = this.mapData.tileSheets || [];
        const alreadyExists = this.mapData.tileSheets.some(
            sheetId => (sheetId.id || sheetId) === sheet.id
        );
        if (alreadyExists) {
            alert("Esta hoja ya está asociada al mapa.");
            return;
        }
        // corregir
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



    render() {
        this.element.innerHTML = /*html*/ `
        







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