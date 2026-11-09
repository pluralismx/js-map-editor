import Component from "../../../core/component.js";

export default class EditorToolBar extends Component {
    
    constructor(props={}){
        super(props, "aside");
        this.element.className = "editorToolBar";
        this.selectedTool = "";
        this.render();
    }

    handleSelectTool (target) {
        const { tool } = target.dataset;
        this.props.onSelectTool(tool);
    }

    render(){
        this.element.innerHTML = /*html*/ `

            <ul>
                <li data-click="handleSelectTool" data-tool="brush">B</li>
                <li data-click="handleSelectTool" data-tool="eraser">E</li>
            <ul>

        `;

        return this.element;
    }
}