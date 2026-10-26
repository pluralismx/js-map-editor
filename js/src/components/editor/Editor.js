import Component from "../../../core/component.js";
import Viewer from "./Viewer.js";

export default class Editor extends Component{
    constructor(){
        super("div");
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
        return this.element;
    }
}