import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class TilePropertiesModal extends Component {

    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.tileProperties = this.props.tileProperties || {} 
        this.isSolid = true;
        this.isActive = false;
        this.isVisibleNewTileClass = false;
        this.render();
    }

    toggle() {
        if (this.isActive == false) {
            this.mount();
            this.isActive = true;
        } else {
            this.isVisibleNewTileClass = false;
            this.unmount();
            this.isActive = false;
            
        }
    }

    handleShowNewTileClassForm(){
        if(!this.isVisibleNewTileClass){
            this.isVisibleNewTileClass = true;
            this.render();
            return;
        }
        this.isVisibleNewTileClass = false;
        this.render();
    }

    selectExistent(){
        return ( /*html*/ `
            <div>
                <div class="form-field-vertical">
                    <label>Use existent</label>
                    <select>
                        <option>Riata</option>
                    </select>
                </div>
                <p data-click="handleShowNewTileClassForm">New tile class...</p>
            </div>
        `);
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
                        ${this.isVisibleNewTileClass ? /*html*/ `
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

                                <div class="radio-container-horizontal">
                                    <span>One way</span>
                                    <div>
                                        <input type="radio" name="collision" id="solid" value="true"/>
                                        <label for="solid">true</label>
                                        <input type="radio" name="collision" id="not_solid" value="false"/>
                                        <label for="not_solid">false</label>
                                    </div>
                                </div>

                                <div class="radio-container-horizontal">
                                <span>Player dies</span>
                                <div>
                                    <input type="radio" name="collision" id="solid" value="true"/>
                                    <label for="solid">true</label>
                                    <input type="radio" name="collision" id="not_solid" value="false"/>
                                    <label for="not_solid">false</label>
                                </div>
                            </form>
                        ` : this.selectExistent()}
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