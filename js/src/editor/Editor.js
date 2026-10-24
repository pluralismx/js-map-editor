import Component from "../core/component.js";
import Viewer from "./Viewer.js";

export default class Editor extends Component{
    constructor(){
        super("section");
        this.mapData = null;
        this.viewer = new Viewer();
        this.viewer.mount(this.element);
        this.render();
    }

    initMap(mapData) {
        this.mapData = mapData;
        this.viewer.start(this.mapData);
    }

    render(){
        this.element.id = "editor";
        return this.element;
    }
}