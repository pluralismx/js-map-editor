import Component from "../../../core/component.js";
import MapProperties from "./MapProperties.js";
import MapAssets from "./MapAssets.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(props={}){
        super(props, "div");

        this.mapProperties = new MapProperties();
        this.mapAssets = new MapAssets({
            onAddTileSheet: (modal) => this.props.onAddTileSheet(modal)
        });
        this.tilePicker = new TilePicker();
        
        this.initHTML();
    }

    initHTML() {

        this.element.innerHTML = /*html*/ `
            <section id="sidebar-map-properties-section"></section>
            <section id="sidebar-map-assets-section"></section>
            <section id="sidebar-tile-picker-section"></section>
        `;

        this.element.querySelector("#sidebar-map-properties-section")
            .appendChild(this.mapProperties.element);

        this.element.querySelector("#sidebar-map-assets-section")
            .appendChild(this.mapAssets.element);

        this.element.querySelector("#sidebar-tile-picker-section")
            .appendChild(this.tilePicker.element);
    }

    onPropsUpdated() {
        const { mapData, onUpdateMapData, onAddTileSheet } = this.props;
        this.mapProperties.setProps({mapData, onUpdateMapData});
        this.mapAssets.setProps({mapData, onAddTileSheet});
        this.tilePicker.setProps({ mapData: this.props });
    }

}