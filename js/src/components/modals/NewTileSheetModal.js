import Component from "../../../core/component.js";

export default class NewTileSheetModal extends Component {
    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.isActive = false;
        this.render();
    }

    toggle() {
        if(this.isActive == false){
            this.mount();
            this.isActive = true;
        }else {
            this.unmount();
            this.isActive = false;
        }
    }

    handleSaveTileSheet() {
        const form = this.element.querySelector("#save-sprite-sheet-form");
        const formData = new FormData(form);
        
        const tileSheet = {
            name: formData.get("name"),
            file: formData.get("file")
        }
        
        this.props.onSaveSheet(tileSheet);
    }

    render() {
        this.element.innerHTML = /*html*/ `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New sprite sheet</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="save-sprite-sheet-form">
                            <div class="form-field-vertical">
                                <label>Name: </label>
                                <input type="text" class="input-blue" name="name"/>
                            </div>
                            <div class="form-field-vertical">
                                <label>File: </label>
                                <input type="file"  name="file"/>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="button-blue" style="width: 80px;" data-click="toggle">Cancel</button>
                        <button type="button" class="button-basic" style="width: 80px;" data-click="handleSaveTileSheet">OK</button> 
                    </div>
                <div>
            </div>
        `;
    }
}