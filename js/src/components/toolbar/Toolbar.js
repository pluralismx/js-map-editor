import Component from "../../../core/component.js"

export default class Toolbar extends Component{
    constructor(props={}){
        super("div");
        this.props = props;
        this.render();
    }

    newMap() {
        this.props.onNewMapClick();
    }

    loadMap() {
        this.props.onLoadMapClick();
    }

    loadSpriteSheet() {
        alert("Load a saved sprite sheet");
    }

    newSpriteSheet() {
        this.props.onNewSpriteSheedClick();
    }

    render(){
        this.element.innerHTML = `
            <ul class="toolbar-options">
                <li data-click="newMap">New map</li>
                <li data-click="loadMap">Load map</li>
                <li data-click="newSpriteSheet">New tile sheet</li>
                <li data-click="loadSpriteSheet">Load tile sheet</li>
            </ul>
        `;

        return this.element;
    }
}