import Component from "../../../core/component.js";
import Viewer from "./Viewer.js";
import EditorToolBar from "./EditorToolBar.js";

export default class Editor extends Component{
    constructor(props={}){
        super(props, "section");
        this.props = props;
        this.element.id = "canva-container"
        this.activeTool = null;
        this.viewer = new Viewer();
        this.editorToolBar = new EditorToolBar();
        this.initHTML();
    }

    onPropsUpdated() {
        this.viewer.setProps({ 
            ...this.props, 
            onControlStop: () => this.setCursor() 
        });
        this.editorToolBar.setProps({
            onSelectTool: (tool) => {
                this.activeTool = tool;
                this.viewer.setProps({ activeTool: this.activeTool });
                this.setCursor()
            }
        });
    }

    setCursor() {
        this.viewer.element.classList.remove("brush-cursor", "eraser-cursor");

        if(this.activeTool == "brush"){
            this.viewer.element.classList.add("brush-cursor");
        }else{
            this.viewer.element.classList.add("eraser-cursor");
        }
    }

    initHTML(){
        document.querySelector("#editor").appendChild(this.editorToolBar.element);
        this.element.appendChild(this.viewer.element);
    }
}