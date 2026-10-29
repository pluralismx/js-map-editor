import storageService from "../services/storageService.js";

class MapStore extends EventTarget {
    constructor() {
        super();
        this.activeMap = null;
    }

    async saveMap(mapData){
        const newMap = {
            ...mapData,
            id: crypto.randomUUID()
        }
        try {
            const record = await storageService.put("maps", newMap);
            if(record){
                this.activeMap = record;
                this.dispatchEvent(new CustomEvent("map:change", {detail: record}));
                alert("Map saved");
            }
        }catch(err){
            console.warn("Error al guardar el mapa: ", err);
        }
    }

    async updateMap(updatedMapData) {
        try{
            const record = await storageService.put("maps", updatedMapData);
            if(record){
                this.activeMap = record;
                this.dispatchEvent(new CustomEvent("map:change", {detail: record}));
                alert("Map updated!");
            }
        }catch(err){
            console.warn(err);
        }
    }

    async uploadTileSheet(newSheet) {
        try{
            const record = await storageService.put("tileSheets", newSheet);
            if(record){
                alert("Saved Tile Sheet");
                return record;
            }
        }catch(err){
            console.warn(err);
        }
    }

    async loadMaps() {
        try{
            const records = await storageService.getAll("maps");
            if(records){
                return records;
            }
        }catch(err){
            console.warn(err);
        }
    }
}

const mapStore = new MapStore();
export default mapStore;


