import Component from "../../../core/component.js"
import storageService from "../../services/storageService.js";

export default class NewMapModal extends Component {

    constructor(props={}) {
        super("div");
        this.props = props;
        this.mapSpriteSheet = "";
        this.isActive = false;
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

    async save(){
        const form = document.querySelector("#save-map-form");
        const formData = new FormData(form);
        
        const mapRecord = {
            id: crypto.randomUUID(),
            name: formData.get("map_name"),
            width: formData.get("map_width"),
            height: formData.get("map_height"),
            tileSize: formData.get("tile_size")
        }

        try {
            const record = await storageService.put("maps", mapRecord);
            
            if(!record){
                alert("Error al crear el mapa");
                return;
            } 
            
            this.toggle();
            this.createMap(formData);
            

        }catch(err){
            console.warn("Error al guardar el mapa: ", err);
        }
    }

    async createMap(formData) {
        const mapData = {
            name: formData.get("map_name"),
            width: Number(formData.get("map_width")),
            height: Number(formData.get("map_height")),
            tileSize: Number(formData.get("tile_size"))
        }
        this.props.onCreateMap(mapData);
        
    }

    render() {

        this.element.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New map</span>
                        <span data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="save-map-form">
                            <div class="form-field">
                                <label>Map name</label>
                                <input type="text" name="map_name" id="map_name"/>
                            </div>
                            <div class="form-field">
                                <label>Width</label>
                                <input type="number" name="map_width" id="map_width"/>
                            </div>
                            <div class="form-field">
                                <label>Height</label>
                                <input type="text" name="map_height" id="map_height"/>
                            </div>
                            <div class="form-field">
                                <label>Tile size</label>
                                <input type="number" name="tile_size" id="tile_size"/>
                            </div>
                            <button type="button" data-click="save">OK</button>
                        </form>
                    </div>
                <div>
            </div>
        `;


        return this.element;
    }

}