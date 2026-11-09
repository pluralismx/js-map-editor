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

    exportMap(){
        this.props.onExportMap()
    }

    saveChanges(){
        this.props.onSaveChanges();
    }

    render(){
        this.element.innerHTML = /*html*/ `
            <ul class="toolbar-options">
                <li data-click="openModal" data-modal="newMap">New map</li>
                <li data-click="saveChanges">Save map</li>
                <li data-click="openModal" data-modal="loadMap">Load map</li>
                <li data-click="exportMap">Export map</li>
            </ul>
        `;

        return this.element;
    }
}