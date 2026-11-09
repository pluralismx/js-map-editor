import Component from "../../../core/component.js";

export default class MapAssets extends Component {
    constructor(props={}){
        super(props, "div");
        this.activeTileSheet = null;
        this.tileSheets = [];
        this.render();
    }

    handleOpenAddSheetModal(target) {
        if(!this.props.mapData){
            alert("You must open a map first");
            return;
        }
        const {modal} = target.dataset;
        this.props.onAddTileSheet(modal);
    }

    handleSetSheet(target) {        
        this.activeTileSheet = target.value;
        this.props.onSelectTileSheet(this.activeTileSheet);
    }

    handleRemoveSheet(){
        alert("This function is not available yet");
    }

    onPropsUpdated() {
        if (this.props.activeMapTileSheets) {
            this.tileSheets = Object.entries(this.props.activeMapTileSheets).map(([id, data]) => ({
                id: id,
                name: data.name
            }));
        } else {
            this.tileSheets = [];
        }
    }

    render(){
        this.element.innerHTML = /*html*/ `
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
                        ${!this.props.mapData ? 'disabled' : ''} 
                    >
                        <option value="">Select a tile sheet</option>
                        ${this.tileSheets.map(sheet => {
                            const isSelected = String(this.activeTileSheet) === String(sheet.id) ? 'selected' : '';
                            return `<option 
                                value="${sheet.id}"
                                ${isSelected}
                            >
                                ${sheet.name}
                            </option>`;
                        }).join('')}
                    </select>
                </div>
                <div class="form-field-vertical" style="width: 50%">
                    <label>Actions</label>
                    <div style="display: flex; height: 100%; justify-content: space-between; gap: 1rem;">
                        <button
                            class="button-basic"
                            style="width: 50%;"
                            data-click="handleOpenAddSheetModal"
                            data-modal="addTileSheet"
                            ${!this.props.mapData ? 'disabled' : ''}
                        >
                            Add...
                        </button>
                        <button
                            class="button-basic"
                            style="width: 50%;"
                            data-click="handleRemoveSheet"
                            ${!this.props.mapData ? 'disabled' : ''} 
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;

        return this.element;
    }
}