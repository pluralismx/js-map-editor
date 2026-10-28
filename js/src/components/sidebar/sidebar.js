import Component from "../../../core/component.js";
import MapProperties from "./MapProperties.js";
import MapAssets from "./MapAssets.js";
import TilePicker from "./TilePicker.js";

export default class Sidebar extends Component {
    
    constructor(){
        super({tagName: "div"});
        this.mapProperties = new MapProperties();
        this.mapAssets = new MapAssets();
        this.tilePicker = new TilePicker();
        this.currentPreviewUrl = "";
        this.mapData = null;
        this.render();
    }

    render() {
        this.element.innerHTML = /*html*/ `
            <section id="sidebar-map-properties-section"></section>
            <section id="sidebar-map-assets-section"></section>
        `;
        return this.element;
    }

    load(){
        this.element
            .querySelector("#sidebar-map-properties-section")
            ?.appendChild(this.mapProperties.render());

        this.element
            .querySelector("#sidebar-map-assets-section")
            ?.appendChild(this.mapAssets.render());

        return this.element;
    }

    loadMapData(mapData){
        this.mapData = mapData;
        this.mapProperties.setProps(mapData);
        this.mapAssets.setProps(mapData);
        this.render();
        this.load();
    }
}