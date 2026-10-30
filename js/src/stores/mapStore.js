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
                this.dispatchEvent(new CustomEvent("map:change", {detail: this.activeMap}));
                alert("Map updated!");
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

    async getMap(mapId){
        try{
            const map = await storageService.getById("maps", mapId);
            if(!map){
                alert("No se encontro el mapa!");
            }
            if (map.tileSheets && map.tileSheets.length > 0) {
                const promises = map.tileSheets.map(id => 
                    storageService.getById("tileSheets", id)
                );
                const tileSheetsData = await Promise.all(promises);
                map.tileSheets = tileSheetsData.map(ts => ({ id: ts.id, name: ts.name }));
            }

            this.activeMap = map;
            this.dispatchEvent(new CustomEvent("map:change", {detail: map}));

        }catch(err){
            console.error("Hubo un error al buscar el mapa: ", err);
        }
    }

    async addTileSheetToMap(mapId, tileSheet){
        try{
            const map = await storageService.getById("maps", mapId);
            if(!map){
                console.error("No se encontro el mapa con el id: ", mapId);
            }
            if(!map.tileSheets){
                map.tileSheets = [];
            }

            if(map.tileSheets.find((sheet) => sheet == tileSheet)) {
                alert("Esa hoja ya esta asignada al mapa");
                return;
            }
            map.tileSheets.push(tileSheet);
            const record = await storageService.put("maps", map);
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", {detail: this.activeMap}));
        }catch(err){
            console.error("Fallo la asignacion de la hoja de tiles al mapa: ", err);
        }
    }
}

const mapStore = new MapStore();
export default mapStore;


