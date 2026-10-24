import Component from "../core/component.js";

export default class newSpriteSheetModal extends Component {
    constructor(){
        super("div");
        this.render();
        this.fileLocation = "";
        this.isActive = false;
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

    render() {
        this.element.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New sprite sheet</span>
                        <span data-action="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form">
                            <div class="form-field">
                                <label>Map name</label>
                                <input type="text" name="map_name"/>
                            </div>
                            <div class="form-field">
                                <label>Width</label>
                                <input type="number" name="map_width"/>
                            </div>
                            <div class="form-field">
                                <label>Height</label>
                                <input type="text" name="map_height"/>
                            </div>
                        </form>
                    </div>
                <div>
            </div>
        `;
    }
}