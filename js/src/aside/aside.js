import Component from "../core/component.js";

export default class Aside extends Component {
    
    constructor(props = {}){
        super("aside");
        this.props = props;
    }

    render() {
        this.element.innerHTML = `
            <ul>
                <li data-action="newMap">New map</li>
                <li data-action="loadMap">Load map</li>
                <li data-action="loadSpriteSheet">Load sprite sheet</li>
                <li data-action="newSpriteSheet">New sprite sheet</li>
            </ul>
        `;

        return this.element;
    }

    newMap() {
        this.props.onNewMapClick();
    }

    loadMap() {
        alert("Load a saved map");
    }

    loadSpriteSheet() {
        alert("Load a saved sprite sheet");
    }

    newSpriteSheet() {
        this.props.onNewSpriteSheedClick();
    }

    

}