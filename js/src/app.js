import Aside from "./aside/aside.js";
import Editor from "./editor/Editor.js";
import NewMapModal from "./modals/NewMapModal.js";
import NewSpriteSheetModal from "./modals/NewSpriteSheetModal.js";

export default class App {
    constructor(){
        this.root = document.querySelector("#root");
        this.NewSpriteSheetModal = new NewSpriteSheetModal();
        this.aside = new Aside({
            onNewMapClick: () => this.mapModal.toggle(),
            onNewSpriteSheedClick: () => this.NewSpriteSheetModal.toggle()
        });
        this.editor = new Editor();
        this.mapModal = new NewMapModal({
            onCreateMap: (mapData) => this.editor.initMap(mapData)
        });
        
    }

    load(){
        this.root.appendChild(this.aside.render());
        this.root.appendChild(this.editor.render());
    }
}