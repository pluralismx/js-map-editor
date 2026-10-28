import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class MapProperties extends Component {
    constructor(props={}) {
        super({tagName: "div"});
        this.props = props;
        this.mapData = props;
        this.isEditing = false;
    }

    handleEditProperties() {
        if(!this.mapData){
            alert("You must load a map first"); 
            return;
        }

        if (!this.isEditing){
            this.isEditing = true; 
            this.render();
            return;
        }

        if(this.isEditing){
            this.isEditing = false; 
            this.render();
            return;
        }
    }

    handleUpdateProperties(){
        const form = document.querySelector("#map-properties-form");
        const formData = new FormData(form);
        
        this.mapData.name = formData.get("name");
        this.mapData.width = formData.get("width");
        this.mapData.height = formData.get("height");
        this.mapData.tileSize = formData.get("tileSize");

        try{
            if(storageService.put("maps", this.mapData)){
                alert("Map updated!");
            }
        }catch(err){
            console.warn(err);
        }
    }

    render() {
        this.element.innerHTML = /*html*/ `
            <div class="sidebar-section-header">
                <span style="font-weight: bold;">Properties</span>
            </div>
            <form id="map-properties-form">
                <div class="form-field-vertical">
                    <label>Map name: </label>
                    <input
                        name="name"
                        style="${!this.isEditing ? `color: white` : `color: black`}" 
                        class="input-basic" 
                        type="text" 
                        value="${this.mapData.name ? this.mapData.name : ""}"
                        ${!this.isEditing && `disabled`}
                    />
                </div>
                <div class="field-set-row">
                    <div class="form-field-vertical" style="flex-grow: 1;">
                        <label>Width: </label>
                        <input
                            name="width" 
                            style="${!this.isEditing ? `color: white` : `color: black`}" 
                            class="input-basic" 
                            type="number" 
                            value="${this.mapData.width ? this.mapData.width : ""}"
                            ${!this.isEditing && `disabled`}
                        />
                    </div>
                    <div class="form-field-vertical" style="flex-grow: 1;">
                        <label>Height: </label>
                        <input
                            name="height"
                            style="${!this.isEditing ? `color: white` : `color: black`}"  
                            class="input-basic" 
                            type="number" 
                            value="${this.mapData.height ? this.mapData.height : ""}"
                            ${!this.isEditing && `disabled`}
                        />
                    </div>
                </div>

                <div class="field-set-row">
                    <div class="form-field-vertical" style="width: 50%;">
                        <label>Tile size: </label>
                        <input
                            name="tileSize"
                            style="${!this.isEditing ? `color: white` : `color: black`}"  
                            class="input-basic" 
                            type="number" 
                            value="${this.mapData.tileSize ? this.mapData.tileSize : ""}"
                            ${!this.isEditing && `disabled`}
                        />
                    </div>
                    <div class="form-field-vertical" style="width: 50%;">
                        <label>Actions</label>
                        <div style="display: flex; justify-content: space-between; height: 100%; gap: 1rem;">
                            <button 
                                type="button" 
                                class="button-basic" 
                                style="width: 50%"
                                ${!this.mapData && `disabled`}  
                                data-click="handleEditProperties">${!this.isEditing ? "Edit" : "Cancel"}
                            </button>
                            <button 
                                type="button" 
                                class="button-basic" 
                                style="width: 50%"
                                ${!this.isEditing && `disabled`} 
                                data-click="handleUpdateProperties">Update
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        `;

        return this.element;
    }
}
