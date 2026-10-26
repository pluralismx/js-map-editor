import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";
export default class LoadMapModal extends Component {
    constructor(props={}){
        super("div");
        this.props = props;
        this.maps = [];
        this.isActive = false;
        this.loadMaps();
        this.selectedElement = null;
        this.selectedMap = "";
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

    async loadMaps() {
        try{
            const maps = await storageService.getAll("maps");
            if(maps){
                this.maps = maps;
                console.log(this.maps);
            }
        }catch(err){
            console.warn(err);
        }

        this.render();
    }

    selectMap(target) {
        this.selectedElement?.classList.remove("active");
        this.selectedElement = target;
        this.selectedElement.classList.add("active");
    
        const mapId = target.dataset.mapId;
        this.selectedMap = this.maps.find(m => (m.id || m.name) === mapId);
    }

    loadMap() {
        this.props.onLoadMap(this.selectedMap);
        this.toggle();
    }

    render(){
        this.element.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>Load Map</span>
                        <span data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="modal-list">
                            ${this.maps.map(map => `
                                <div 
                                    data-map-id="${map.id}" 
                                    data-click="selectMap">${map.name}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" data-click="loadMap">Load</button>
                    </div>
                </div>
            </div>
        `;

        return this.element;
    }
}