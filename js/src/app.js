import Toolbar from "./components/toolbar/Toolbar.js";
import Sidebar from "./components/sidebar/sidebar.js";
import Editor from "./components/editor/Editor.js";
import NewMapModal from "./components/modals/NewMapModal.js";
import LoadMapModal from "./components/modals/LoadMapModal.js";

export default class App {
    constructor(){
        this.toolbarLayout = document.querySelector("#toolbar");
        this.sidebarLayout = document.querySelector("#sidebar");
        this.editorLayout = document.querySelector("#editor");
        this.sidebar = new Sidebar();
        this.editor = new Editor();
        
        this.toolbar = new Toolbar({
            onNewMap: () => this.newMapModal.toggle(),
            onLoadMap: () => this.LoadMapModal.toggle()
        });

        this.newMapModal = new NewMapModal({
            onCreateMap: (mapData) => {
                this.editor.initMap(mapData);
                this.sidebar.loadMapData(mapData);
            }
        });

        this.LoadMapModal = new LoadMapModal({
            onLoadMap: (mapData) => {
                this.sidebar.loadMapData(mapData);
                this.editor.initMap(mapData);
            }
        });

    }

    load(){
        this.toolbarLayout.appendChild(this.toolbar.render());
        this.sidebarLayout.appendChild(this.sidebar.load());
        this.editorLayout.appendChild(this.editor.render());
    }
}