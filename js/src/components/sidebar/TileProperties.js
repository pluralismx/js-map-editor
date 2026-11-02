import Component from "../../../core/component.js";

export default class TileProperties extends Component {

    constructor(props={}) {
        super(props, "div");
        this.props = props;
        this.render();
    }

    render(){
        this.element.innerHTML = /* html */ `
            <div class="sidebar-section-header">
                <span style="font-weight: bold;">Tile properties</span>
            </div>
            <form id="tile-properties-form">
                <div class="form-field-vertical">
                    <label>Name: </label>
                    <input class="input-basic"/>
                </div>
            </form>
        `;
    }
}
