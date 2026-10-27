import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class TileTypesModal extends Component {
    constructor(){
        super("div");
        this.tileType = "";
        this.isSolid = true;
        this.render();
        this.isActive = false;
        this.tyle = {}
    }

    toggle() {
        if (this.isActive == false) {
            this.mount();
            this.isActive = true;
        } else {
            this.unmount();
            this.isActive = false;
        }
    }

    async save(){
        const form = document.querySelector("#new-tile-form");
        const formData = new FormData(form);

        const tileRecord = {
            id: crypto.randomUUID(),
            name: formData.get("name"),
            collision: formData.get("collision")
        }

        try{
            const record = await storageService.put("tiles", tileRecord);
            if(record){
                alert("Se ha guardado el registro");
            }
        }catch(err){
            console.warn(err);
        }
        
    }

    render(){
        this.element.innerHTML = /*html*/ `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New tile type</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="new-tile-form">
                            <div class="form-field-vertical">
                                <label>Name: </label>
                                <input class="input-blue" name="name"/>
                            </div>
                            <div class="radio-container-horizontal">
                                <span>Solid</span>
                                <div>
                                    <input type="radio" name="collision" id="solid" value="true"/>
                                    <label for="solid">true</label>
                                    <input type="radio" name="collision" id="not_solid" value="false"/>
                                    <label for="not_solid">false</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" style="width: 80px" class="button-blue" data-click="toggle">Cancel</button>
                        <button type="button" style="width: 80px" class="button-basic" data-click="save">Save</button>
                    </div>
                </div>
            </div>
        `;

        return this.element;
    }
}