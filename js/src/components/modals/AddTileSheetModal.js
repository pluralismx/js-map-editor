import Component from "../../../core/component.js";

export default class AddTileSheetModal extends Component {
    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.isActive = false;
        this.sheets = [];
        this.selectedSheet = {}
    }

    async  toggle() {
        if(this.isActive == false){
            this.sheets = await this.props.fetchTileSheets()
            this.render();
            this.mount();
            this.isActive = true;
        }else {
            this.unmount();
            this.isActive = false;
        }
    }

    handleOpenUploadSheetModal(target) {
        const {modal} = target.dataset;
        this.unmount();
        this.props.onOpenUploadSheet(modal);
    }

    handleSelectSheet(target) {
        this.selectedElement?.classList.remove("active");
        this.selectedElement = target;
        this.selectedElement.classList.add("active");
    
        const sheetId = target.dataset.sheetId;
        this.selectedSheet = this.sheets.find(s => (s.id || s.name) === sheetId);
    }

    handleConfirm(){
        this.props.onSelectSheet(this.selectedSheet);
        this.toggle();
    }

    render(){
        this.element.innerHTML = /*html*/ `
        
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>Add tile sheet</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        
                            <!-- List -->
                            <ul class="modal-list">
                                ${this.sheets.map(sheet => `
                                    <li 
                                        data-sheet-id="${sheet.id}"
                                        data-click="handleSelectSheet"
                                        >
                                        ${sheet.name}
                                    </li>
                                `).join('')}
                            </ul>
                        
                    </div>
                    <div class="modal-footer">
                        <button class="button-blue" style="width: 80px;" data-click="toggle">Cancel</button>
                        <button class="button-basic" style="width: 80px;" data-click="handleOpenUploadSheetModal" data-modal="newTileSheet">Upload</button>
                        <button class="button-basic" style="width: 80px;" data-click="handleConfirm">OK</button>
                    </div>
                </div>
            
            
            </div>

        `;

        return this.element;
    }
}
