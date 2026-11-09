// Main layout
import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/Sidebar.js";
import Editor from "./components/editor/Editor.js";

// Modals
import NewMapModal from "./components/modals/NewMapModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";
import NewTileSheetModal from "./components/modals/NewTileSheetModal.js"
import AddTileSheetModal from "./components/modals/AddTileSheetModal.js";
import TilePropertiesModal from "./components/modals/TilePropertiesModal.js";

// Stores
import mapStore from "./stores/mapStore.js";
import tileSheetStore from "./stores/tileSheetStore.js";

export default class App {
    constructor(){
        this.state = {
            activeMap: null,
            activeMapTileSheets: null,
            activeTileSheet: null,
            activeTile: null
        }

        this.mapStore = mapStore; 
        this.mapStore.addEventListener("map:change", (e) => {
            this.setState(
                {
                    activeMap: e.detail.activeMap,
                    activeMapTileSheets: e.detail.activeMapTileSheets
                }
            );
        });

        this.tileSheetStore = tileSheetStore;
        this.tileSheetStore.addEventListener("sheet:change", (e) => {
            this.setState({activeTileSheet: e.detail})
        });

        this.toolbar = new Toolbar({
            onSelectOption: (modal) => this.handleOpenModal(modal),
            onExportMap: () => mapStore.exportMapForEngine(this.state.activeMap),
            onSaveChanges: () => mapStore.updateMap(this.state.activeMap)
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
            onSelectSheet: (sheetId) => mapStore.addTileSheetToMap(this.state.activeMap, sheetId),
            fetchTileSheets: () => tileSheetStore.getAll()
        });

        this.tilePropertiesModal = new TilePropertiesModal({
            onNewTileClass: (payload) => mapStore.addTileClassToMap(this.state.activeMap.id, payload),
            onAddTileToTileClass: (payload) => mapStore.addTileToTileClass(this.state.activeMap.id, payload)
        });

        this.sidebar = new Sidebar({
            onUpdateMapData: () => mapStore.updateMap(this.state.activeMap),
            onAddTileSheet: (modal) => this.handleOpenModal(modal),
            onOpenTilePropertiesModal: (modal) => this.handleOpenModal(modal),
            onSelectTileSheet: (tileSheet) => tileSheetStore.setSheet(tileSheet),
            onSelectBrush: (brush) => this.setState({activeTile: brush}),
        });

        this.editor = new Editor({
            
        });
    }

    setState(nextState = {}) {
        Object.assign(this.state, nextState);
        this.notifyChildren();
    }

    notifyChildren(){

        this.sidebar.setProps({
            mapData: this.state.activeMap,
            activeMapTileSheets: this.state.activeMapTileSheets,
            activeTileSheet: this.state.activeTileSheet,
            activeTile: this.state.activeTile
        });

        this.editor.setProps({
            mapData: this.state.activeMap,
            activeMapTileSheets: this.state.activeMapTileSheets,
            activeBrush: this.state.activeTile
        });

        this.tilePropertiesModal.setProps({
            mapData: this.state.activeMap,
            activeMapTileSheets: this.state.activeMapTileSheets,
            activeTileSheet: this.state.activeTileSheet,
            activeTile: this.state.activeTile,
        })
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
            case "tileProperties" :
                this.tilePropertiesModal.toggle();
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