import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class AddTileSheetModal extends Component {
    constructor(props={}){
        super("div");
        this.props = props;
        this.isActive = false;
        this.sheets = [];
        this.selectedSheet = {}
    }

    toggle() {
        if(this.isActive == false){
            this.loadTileSheets();
            this.mount();
            this.isActive = true;
        }else {
            this.unmount();
            this.isActive = false;
        }
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

    render(){
        this.element.innerHTML = /*html*/ `
        
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>Add tile sheet</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <!-- list container -->
                        
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
                        <button class="button-basic" style="width: 80px;" data-click="handleConfirm">OK</button>
                    </div>
                </div>
            
            
            </div>

        `;

        return this.element;
    }
}
