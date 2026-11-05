import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class TilePropertiesModal extends Component {

    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.activeTile = null;
        this.isSolid = true;
        this.isActive = false;
        this.isVisibleNewTileClass = false;
        this.selectedClass = null;
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

    tilePreview() {
        const preview = this.element.querySelector("#tile-preview");
        const ctx = preview.getContext("2d");
        
        if(!this.activeTile) return;

        ctx.drawImage(
            this.activeTile.image, 
            this.activeTile.sx, this.activeTile.sy,
            this.activeTile.sWidth,this.activeTile.sHeight,
            2, 2,
            preview.width - 4, preview.height - 4
        );

    }

    saveNewTileClass() {
        const form = this.element.querySelector("#new-tile-form");
        const formData = new FormData(form);
        const payload = {
            name: formData.get("name"),
            isSolid: formData.get("isSolid"),
            oneWay: formData.get("oneWay"),
            playerDies: formData.get("playerDies")
        }
        this.props.onNewTileClass(payload);
        this.isVisibleNewTileClass = false;
    }

    handleSelectTileClass(target) {
        this.selectedClass = target.value;
    }

    addTileToClass(){
        const sheetCols = this.props.activeTileSheet.width / this.props.mapData.tileSize;
        const tileCol = Math.floor(this.props.activeTile.sx / this.props.mapData.tileSize);
        const tileRow = Math.floor(this.props.activeTile.sy / this.props.mapData.tileSize);
        const tileId = (tileRow * sheetCols) + tileCol;

        const payload = {
            [tileId]: this.selectedClass
        }
        
        this.props.onAddTileToTileClass(payload);
    }

    onPropsUpdated(){
        this.activeTile = this.props.activeTile ?? null;
        console.log(this.activeTile);
    }

    selectExistent(){
        return ( /*html*/ `
            <div>
                <div class="form-field-vertical">
                    <label>Asign to existent</label>
                    <select data-change="handleSelectTileClass">
                        <option selected>Choose class</option>
                        ${this.props.mapData?.tileClasses.map(tileClass => `
                            <option value=${tileClass.name}>${tileClass.name}</option>
                        `)}
                    </select>
                </div>
                <p data-click="handleShowNewTileClassForm">New tile class...</p>
            </div>
        `);
    }

    formNewTileClass(){
        return ( /*html*/ `
            <form class="modal-form" id="new-tile-form">
                <div class="form-field-vertical">
                    <label>Name: </label>
                    <input class="input-blue" name="name"/>
                </div>
                <div class="radio-container-horizontal">
                    <span>Solid</span>
                    <div>
                        <input type="radio" name="isSolid" value="true"/>
                        <label for="solid">true</label>
                        <input type="radio" name="isSolid" value="false"/>
                        <label for="not_solid">false</label>
                    </div>
                </div>

                <div class="radio-container-horizontal">
                    <span>One way</span>
                    <div>
                        <input type="radio" name="oneWay" value="true"/>
                        <label for="solid">true</label>
                        <input type="radio" name="oneWay" value="false"/>
                        <label for="not_solid">false</label>
                    </div>
                </div>

                <div class="radio-container-horizontal">
                    <span>Player dies</span>
                    <div>
                        <input type="radio" name="playerDies" value="true"/>
                        <label for="solid">true</label>
                        <input type="radio" name="playerDies" value="false"/>
                        <label for="not_solid">false</label>
                    </div>
                </div>
            </form>
        `);
    }

    render(){
        
        this.element.innerHTML = /*html*/ `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>Tile properties</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        
                        <!-- tile preview -->
                        <div style="display: flex; gap: .50rem;">
                            <!-- canvas wraper -->
                            <div>
                                <canvas id="tile-preview" width="64" height="64"></canvas>
                            </div>
                            <!-- tile info wrapper -->
                            <div style="display: flex; flex-direction: column;">
                                <span>Class: ${this.activeTile?.tileClass.name ?? "Not asigned"}</span>
                                <span>x: ${this.activeTile?.sx ?? "0"}</span>
                                <span>y: ${this.activeTile?.sy ?? "0"}</span>
                            </div>
                        </div>
                        ${this.isVisibleNewTileClass ? this.formNewTileClass() : this.selectExistent()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" style="width: 80px" class="button-blue" data-click="toggle">Cancel</button>
                        <button type="button" style="width: 80px" class="button-basic" data-click="saveNewTileClass">Save</button>
                        <button type="button" style="width: 80px" class="button-basic" data-click="addTileToClass">Add</button>
                    </div>
                </div>
            </div>
        `;
        this.tilePreview();
        return this.element;
    }
}