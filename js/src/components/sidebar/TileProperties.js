import Component from "../../../core/component.js";

export default class TileProperties extends Component {

    constructor(props={}) {
        super(props, "div");
        this.props = props;
        this.render();
    }

    handleOpenTilePropertiesModal(target) {
        const { modal } = target.dataset;
        this.props.onOpenTilePropertiesModal(modal);
    }

    onPropsUpdated(){
        this.tileClass = this.props.activeTile?.tileClass || null;
        console.log(this.tileClass);
    }

    render(){
        this.element.innerHTML = /* html */ `
            <div class="sidebar-section-header">
                <span style="font-weight: bold;">Tile properties</span>
                <span data-click="handleOpenTilePropertiesModal" data-modal="tileProperties" style="color: #ff2eb8;">(edit)</span>
            </div>
            <div>
                <div>
                    <span>Class:<span>
                    <span>${this.tileClass?.name ?? "not asigned"}</span>
                </div>
                <div>
                    <span>Solid: <span>
                    <span>${this.tileClass?.isSolid ?? "not asigned"}</span>
                </div>
                <div>
                    <span>One way: <span>
                    <span>${this.tileClass?.oneWay ?? "not asigned"}</span>
                </div>
                <div>
                    <span>Damage: <span>
                    <span>${this.tileClass?.damage ?? "not asigned"}</span>
                </div>
                <div>
                    <span>Player Dies: <span>
                    <span>${this.tileClass?.playerDies ?? "not asigned"}</span>
                </div>
            </div>
        `;
    }
}
