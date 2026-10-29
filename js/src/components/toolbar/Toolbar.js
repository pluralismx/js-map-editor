import Component from "../../../core/component.js"

export default class Toolbar extends Component{
    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.render();
    }

    openModal(target) {
        const modal = target.dataset.modal;
        this.props.onSelectOption(modal);
    }

    render(){
        this.element.innerHTML = `
            <ul class="toolbar-options">
                <li data-click="openModal" data-modal="newMap">New map</li>
                <li data-click="openModal" data-modal="loadMap">Load map</li>
            </ul>
        `;

        return this.element;
    }
}