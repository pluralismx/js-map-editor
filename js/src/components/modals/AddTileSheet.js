import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class AddTileSheetModal extends Component {
    constructor(){
        super("div");
        this.isActive = false;
        this.sheets = [];
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
                        <div class="modal-list">
                            <!-- List -->
                            <ul>
                                ${this.sheets.map(sheet => `
                                    <li>${sheet.name}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="button-blue" style="width: 80px;" data-click="toggle">Cancel</button>
                        <button class="button-basic" style="width: 80px;">OK</button>
                    </div>
                </div>
            
            
            </div>

        `;

        return this.element;
    }
}
