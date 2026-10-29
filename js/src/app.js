import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/sidebar.js";
import Editor from "./components/editor/Editor.js";
import NewMapModal from "./components/modals/NewMapModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";
import storageService from "./services/storageService.js";

export default class App {
    constructor(){
        this.state = {
            activeMap: null
        }

        this.toolbarLayout = document.querySelector("#toolbar");
        this.sidebarLayout = document.querySelector("#sidebar");
        this.editorLayout = document.querySelector("#editor");
        
        this.toolbar = new Toolbar({
            onNewMap: () => this.newMapModal.toggle(),
            onLoadMap: () => this.LoadMapModal.toggle()
        });

        this.newMapModal = new NewMapModal({
            onSaveMap: (mapData) => {this.handleSaveMap(mapData)}
        });

        this.LoadMapModal = new LoadMapModal({
            onLoadMap: (mapData) => {this.setState({ activeMap: mapData })}
        });

        this.sidebar = new Sidebar({
            onUpdateMapData: (updatedMapData) => this.handleUpdateMap(updatedMapData),
            mapData: this.state.activeMap
        });
        this.editor = new Editor(this.state.activeMap || {});
    }

    setState(nextState = {}) {
        Object.assign(this.state, nextState);
        this.notifyChildren();
    }

    notifyChildren(){
        this.sidebar.setProps({mapData: this.state.activeMap || null});
        this.editor.setProps(this.state.activeMap || null);
    }

    async handleSaveMap(mapData){
        const newMap = {
            ...mapData,
            id: crypto.randomUUID()
        }
        try {
            const record = await storageService.put("maps", newMap);
            console.log(record);
            if(!record){
                alert("Error al crear el mapa");
                return;
            }
            this.setState({ activeMap: record })
            this.newMapModal.unmount();
        }catch(err){
            console.warn("Error al guardar el mapa: ", err);
        }
    }

    async handleUpdateMap(updatedMapData) {
        try{
            const record = await storageService.put("maps", updatedMapData);
            if(record){
                this.setState({ activeMap: record });
                alert("Map updated!");
            }

        }catch(err){
            console.warn(err);
        }
    }

    load(){
        this.toolbarLayout.appendChild(this.toolbar.element);
        this.sidebarLayout.appendChild(this.sidebar.element);
        this.editorLayout.appendChild(this.editor.element);
    }
}