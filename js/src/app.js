import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/sidebar.js";
import Editor from "./components/editor/Editor.js";
import NewMapModal from "./components/modals/NewMapModal.js";
import NewSpriteSheetModal from "./components/modals/NewTileSheetModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";

export default class App {
    constructor(){
        this.toolbarLayout = document.querySelector("#toolbar");
        this.sidebarLayout = document.querySelector("#sidebar");
        this.editorLayout = document.querySelector("#editor");
        
        
        
        
        this.toolbar = new Toolbar({
            onNewMapClick: () => this.mapModal.toggle(),
            onLoadMapClick: () => this.LoadMapModal.toggle()
        });
        
        this.sidebar = new Sidebar();
        this.editor = new Editor();
        
        this.LoadMapModal = new LoadMapModal({
            onLoadMap: (mapData) => {
                this.sidebar.loadMapData(mapData);
                this.editor.initMap(mapData);
            }
        });
        this.mapModal = new NewMapModal({
            onCreateMap: (mapData) => {
                this.editor.initMap(mapData);
                this.sidebar.loadMapData(mapData);
            }
        });
        
    }

    load(){
        this.toolbarLayout.appendChild(this.toolbar.render());
        this.sidebarLayout.appendChild(this.sidebar.render());
        this.editorLayout.appendChild(this.editor.render());
    }
}