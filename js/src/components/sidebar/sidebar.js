import Component from "../../../core/component.js";
import MapProperties from "./MapProperties.js";
import MapAssets from "./MapAssets.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(props={}){
        super(props, "div");

        this.mapProperties = new MapProperties({
            onUpdateMapData: (updatedMapDAta) => this.props.onUpdateMapData(updatedMapDAta) 
        });

        this.mapAssets = new MapAssets();
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
        this.mapProperties.setProps(this.props);
        this.mapAssets.setProps(this.props);
        this.tilePicker.setProps({ mapData: this.props });
    }

}