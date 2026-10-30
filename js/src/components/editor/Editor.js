import Component from "../../../core/component.js";
import Viewer from "./Viewer.js";

export default class Editor extends Component{
    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.viewer = new Viewer();
        this.initHTML();
    }

    onPropsUpdated() {
        this.viewer.setProps(this.props);
    }

    initHTML(){
        this.element.innerHTML = /*html*/ `
            <section id="canva-container"></section>
        `;
        
        this.element.querySelector("#canva-container")
            .appendChild(this.viewer.element); 
    }
}