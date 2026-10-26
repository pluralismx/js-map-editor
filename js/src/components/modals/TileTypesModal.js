import Component from "../../../core/component.js";

export default class TileTypesModal extends Component {
    constructor(){
        super("div");
        this.tileType = "";
        this.isSolid = true;
        this.render();
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

    render(){
        this.element.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New tile type</span>
                        <span data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-field">
                                <label>Name: </label>
                                <input/>
                            </div>
                            <div>
                                <span>Solid</span>
                                <input type="radio" name="collision" id="solid" value=true/>
                                <label for="solid">true</label>
                                <input type="radio" name="collision" id="not_solid" value=false/>
                                <label for="not_solid">false</label>
                            </div>
                            <div class="form-footer">
                                <button type="button">Cancel</button>
                                <button type="button">OK</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        return this.element;
    }
}