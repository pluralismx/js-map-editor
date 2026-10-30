// Main layout
import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/Sidebar.js";
import Editor from "./components/editor/Editor.js";

// Modals
import NewMapModal from "./components/modals/NewMapModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";
import NewTileSheetModal from "./components/modals/NewTileSheetModal.js"
import AddTileSheetModal from "./components/modals/AddTileSheetModal.js";

// Repositories
import mapStore from "./stores/mapStore.js";
import tileSheetStore from "./stores/tileSheetStore.js";

export default class App {
    constructor(){
        this.state = {
            activeMap: null,
            activeTileSheet: null
        }

        this.mapStore = mapStore; 
        this.mapStore.addEventListener("map:change", (e) => {
            this.setState({activeMap: e.detail});
        });

        this.tileSheetStore = tileSheetStore;
        this.tileSheetStore.addEventListener("sheet:change", (e) => {
            this.setState({activeTileSheet: e.detail})
        });

        this.toolbar = new Toolbar({
            onSelectOption: (modal) => this.handleOpenModal(modal)
        });

        this.newMapModal = new NewMapModal({
            onSaveMap: (mapData) => {mapStore.saveMap(mapData)}
        });

        this.loadMapModal = new LoadMapModal({
            fetchMaps: () => mapStore.loadMaps(),
            onLoadMap: (mapData) => mapStore.getMap(mapData.id)
        });

        this.newTileSheetModal = new NewTileSheetModal({
            onSaveSheet: (newSheet) => tileSheetStore.saveSheet(newSheet)
        });

        this.addTileSheetModal = new AddTileSheetModal({
            onOpenUploadSheet: (modal) => this.handleOpenModal(modal),
            onSelectSheet: (sheetId) => mapStore.addTileSheetToMap(this.state.activeMap.id, sheetId),
            fetchTileSheets: () => tileSheetStore.getAll()
        });

        this.sidebar = new Sidebar({
            onUpdateMapData: (updatedMapData) => mapStore.updateMap(updatedMapData),
            onAddTileSheet: (modal) => this.handleOpenModal(modal),
            onSelectTileSheet: (tileSheet) => tileSheetStore.setSheet(tileSheet),
            mapData: this.state.activeMap,
            tileSheetData: this.state.activeTileSheet
        });

        this.editor = new Editor(this.state.activeMap || {});
    }

    setState(nextState = {}) {
        Object.assign(this.state, nextState);
        this.notifyChildren();
    }

    notifyChildren(){

        this.sidebar.setProps({
            mapData: this.state.activeMap,
            tileSheetData: this.state.activeTileSheet
        });

        this.editor.setProps({mapData: this.state.activeMap});
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
            default : 
                alert("no se encontro el modal");
            break;
        }
    }

    load(){
        document.querySelector("#toolbar").appendChild(this.toolbar.element);
        document.querySelector("#sidebar").appendChild(this.sidebar.element);
        document.querySelector("#editor").appendChild(this.editor.element);;
    }
}