import Component from "../../../core/component.js";

export default class TileProperties extends Component {

    constructor(props={}) {
        super(props, "div");
        this.props = props;
        this.tileProperties = this.props.tileProperties || {} 
        this.render();
    }

    handleOpenTilePropertiesModal(target) {
        const { modal } = target.dataset;
        console.log( modal );
        this.props.onOpenTilePropertiesModal(modal);
    }

    render(){
        this.element.innerHTML = /* html */ `
            <div class="sidebar-section-header">
                <span style="font-weight: bold;">Tile properties</span>
                <span data-click="handleOpenTilePropertiesModal" data-modal="tileProperties" style="color: #ff2eb8;">(edit)</span>
            </div>
            <div>
                <div>
                    <span>Class: <span>
                    <span>Dirt</span>
                </div>
                <div>
                    <span>Solid: <span>
                    <span>true</span>
                </div>
                <div>
                    <span>One way: <span>
                    <span>true</span>
                </div>
                <div>
                    <span>Damage: <span>
                    <span>20</span>
                </div>
                <div>
                    <span>Player Dies: <span>
                    <span>false</span>
                </div>
            </div>
        `;
    }
}
