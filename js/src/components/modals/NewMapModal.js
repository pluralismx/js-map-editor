import Component from "../../../core/component.js"
import storageService from "../../services/storageService.js";

export default class NewMapModal extends Component {

    constructor(props={}) {
        super(props, "div");
        this.props = props;
        this.isActive = false;
    }

    toggle() {
        if (this.isActive == false) {
            this.mount();
            this.render();
            this.isActive = true;
        } else {
            this.unmount();
            this.isActive = false;
        }
    }

    handleSaveMap(){
        const form = document.querySelector("#save-map-form");
        const formData = new FormData(form);
        const mapData = {
            name: formData.get("name"),
            width: formData.get("width"),
            height: formData.get("height"),
            tileSize: formData.get("tileSize")
        }

        this.props.onSaveMap(mapData);
        this.toggle();

    }
    render() {

        this.element.innerHTML = /*html*/ `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New map</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="save-map-form">
                            <div class="form-field-vertical">
                                <label>Map name</label>
                                <input type="text" name="name" id="map_name" class="input-blue"/>
                            </div>

                            <div class="field-set-row">
                                <div class="form-field-vertical">
                                    <label>Width</label>
                                    <input type="number" name="width" id="map_width" class="input-blue"/>
                                </div>
                                <div class="form-field-vertical">
                                    <label>Height</label>
                                    <input type="text" name="height" id="map_height" class="input-blue"/>
                                </div>
                            </div>

                            <div class="form-field-vertical">
                                <label>Tile size</label>
                                <input type="number" name="tileSize" id="tile_size" class="input-blue"/>
                            </div>

                            
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="button-blue" style="width: 80px;" data-click="toggle">Cancel</button>
                        <button type="button" class="button-basic" style="width: 80px;"data-click="handleSaveMap">OK</button>
                    </div>
                <div>
            </div>
        `;


        return this.element;
    }

}