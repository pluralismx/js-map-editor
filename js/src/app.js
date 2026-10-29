// Main layout
import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/Sidebar.js";
import Editor from "./components/editor/Editor.js";

// Modals
import NewMapModal from "./components/modals/NewMapModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";
import NewTileSheetModal from "./components/modals/NewTileSheetModal.js"
import AddTileSheetModal from "./components/modals/AddTileSheetModal.js";

// stores
import mapStore from "./stores/mapStore.js";

export default class App {
    constructor(){
        this.mapStore = mapStore;

        this.mapStore.addEventListener("map:change", (e) => {
            this.setState({activeMap: e.detail});
        });

        this.state = {
            activeMap: null
        }

        this.toolbar = new Toolbar({
            onSelectOption: (modal) => this.handleOpenModal(modal)
        });

        this.newMapModal = new NewMapModal({
            onSaveMap: (mapData) => {this.mapStore.saveMap(mapData)}
        });

        this.loadMapModal = new LoadMapModal({
            fetchMaps: () => this.mapStore.loadMaps(),
            onLoadMap: (mapData) => {this.setState({ activeMap: mapData })}
        });

        this.newTileSheetModal = new NewTileSheetModal({
            onAddSheet: (newSheet) => this.handleUpdateMap(newSheet)
        });

        this.addTileSheetModal = new AddTileSheetModal({

        });

        this.sidebar = new Sidebar({
            onUpdateMapData: (updatedMapData) => this.mapStore.updateMap(updatedMapData),
            mapData: this.state.activeMap
        });

        this.editor = new Editor(this.state.activeMap || {});
    }

    setState(nextState = {}) {
        Object.assign(this.state, nextState);
        this.notifyChildren();
    }

    notifyChildren(){
        this.sidebar.setProps({ mapData: this.state.activeMap || null });
        this.editor.setProps({ mapData: this.state.activeMap || null });
    }

    handleOpenModal(modal) {
        switch(modal) {
            case "newMap" :
                this.newMapModal.toggle();
            break;
            case "loadMap" :
                this.loadMapModal.toggle();
            break;
            case "newTileSheet" :
                this.newTileSheetModal.toggle();
            break;
            case "addTileSheet" :
                this.addTileSheetModal.toggle();
            break;
        }
    }

    load(){
        document.querySelector("#toolbar").appendChild(this.toolbar.element);
        document.querySelector("#sidebar").appendChild(this.sidebar.element);
        document.querySelector("#editor").appendChild(this.editor.element);;
    }
}