import Component from "../core/component.js"

export default class NewMapModal extends Component {

    constructor(props={}) {
        super("div");
        this.props = props;
        this.mapName = document.querySelector("#map_name");
        this.mapWidth = document.querySelector("#map_width");;
        this.mapHeight = document.querySelector("#map_height");;
        this.tileSize = document.querySelector("#tile_size");;
        this.mapSpriteSheet = "";
        this.isActive = false;
        this.render();
    }

    toggle() {

        if (this.isActive == false) {
            this.mount();
            this.isActive = true;
            console.log(this.isActive);
        } else {
            this.unmount();
            this.isActive = false;
            console.log(this.isActive);
        }
    }

    createMap() {
        const form = this.element.querySelector("#map-form");
        const formData = new FormData(form);
        const mapData = {
            name: formData.get("map_name"),
            width: Number(formData.get("map_width")),
            height: Number(formData.get("map_height")),
            tileSize: Number(formData.get("tile_size"))
        }

        this.props.onCreateMap(mapData);
        this.toggle();
    }

    render() {

        this.element.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New map</span>
                        <span data-action="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="map-form">
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
                            <button type="button" data-action="createMap">OK</button>
                        </form>
                    </div>
                <div>
            </div>
        `;


        return this.element;
    }

}