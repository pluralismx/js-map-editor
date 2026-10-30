import Component from "../../../core/component.js";

export default class MapAssets extends Component {
    constructor(props={}){
        super(props, "div");
        this.render();
    }

    handleOpenAddSheetModal(target) {
        console.log(this.props);
        if(!this.props.mapData){
            alert("You must open a map first");
            return;
        }

        const {modal} = target.dataset;
        console.log(modal);
        this.props.onAddTileSheet(modal);
    }

    handleSetSheet(target) {        
        this.activeSheet = target.value;
        this.tilePicker.setSheet(this.activeSheet);
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
                        ${!this.props.mapData && `disabled`} 
                    >
                        <option selected>Select a tile sheet</option>
                        ${this.props.mapData?.tileSheets?.map(sheet => `
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
                            data-modal="addTileSheet"
                            ${!this.props.mapData && `disabled`}
                        >
                            Add
                        </button>
                        <button
                            class="button-basic"
                            style="width: 50%;"
                            ${!this.props.mapData && `disabled`} 
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

        `;

        return this.element;
    }
}