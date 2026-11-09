import storageService from "../services/storageService.js";

class MapStore extends EventTarget {
    constructor() {
        super();
        this.activeMap = null;
        this.activeMapTileSheets = null;
    }

    async saveMap(mapData){
        const newMap = {
            id: crypto.randomUUID(),
            metadata: mapData,
        }
        try {
            const record = await storageService.put("maps", newMap);
            if(record){
                this.activeMap = record;
                this.dispatchEvent(new CustomEvent("map:change", 
                    {
                        detail: { 
                            activeMap: this.activeMap
                        }
                    }
                ));
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
                this.dispatchEvent(new CustomEvent("map:change", 
                    {
                        detail: {
                            activeMap: this.activeMap
                        }
                    }
                ));
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

    async getMap(mapId) {
        if (this.activeMapTileSheets) {
            Object.values(this.activeMapTileSheets).forEach(sheet => {
                if (sheet.bitmap) {
                    sheet.bitmap.close();
                }
            });
        }

        this.activeMap = null;
        this.activeMapTileSheets = null;
        
        try {
            const map = await storageService.getById("maps", mapId);
            if (!map) {
                alert("No se encontro el mapa!");
                return; 
            }

            if (map.tileSheets && map.tileSheets.length > 0) {
                const promises = map.tileSheets.map(async (id) => {
                    const ts = await storageService.getById("tileSheets", id);
                    
                    const bitmap = await createImageBitmap(ts.file); 
                    
                    return {
                        id: ts.id,
                        name: ts.name,
                        bitmap: bitmap
                    };
                });
                
                const loadedSheets = await Promise.all(promises);
                
                this.activeMapTileSheets = loadedSheets.reduce((acc, sheet) => {
                    acc[sheet.id] = {
                        name: sheet.name,
                        bitmap: sheet.bitmap
                    };
                    return acc;
                }, {});
            } else {
                this.activeMapTileSheets = {};
            }

            this.activeMap = map;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));

        } catch(err) {
            console.error("Hubo un error al buscar el mapa: ", err);
        }
    }

    async addTileSheetToMap(activeMap, tileSheet){
        try{
            if(!activeMap.tileSheets){
                activeMap.tileSheets = [];
            }

            if(activeMap.tileSheets.find((sheet) => sheet == tileSheet)) {
                alert("Esa hoja ya esta asignada al mapa");
                return;
            }

            activeMap.tileSheets.push(tileSheet);

            const record = await storageService.put("maps", activeMap);
            this.activeMap = record;


            const newSheetData = await storageService.getById("tileSheets", tileSheet);
            
            if (newSheetData && newSheetData.file) {
                const bitmap = await createImageBitmap(newSheetData.file);
                
                if (!this.activeMapTileSheets) {
                    this.activeMapTileSheets = {};
                }

                this.activeMapTileSheets[tileSheet] = {
                    name: newSheetData.name,
                    bitmap: bitmap
                };
            }
            
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));

        }catch(err){
            console.error("Fallo la asignacion de la hoja de tiles al mapa: ", err);
        }
    }

    async addTileClassToMap(mapId, newTileClass){
        try{
            const map = await storageService.getById("maps", mapId);
            if(!map){
                console.log("Map not found");
            }
            if(!map.tileClasses){
                map.tileClasses = [];
            }

            if(map.tileClasses.find((tileClass) => tileClass.name  == newTileClass.name)){
                alert("Tile class names cannot be duplicated")
                return;
            }

            map.tileClasses.push(newTileClass);
            const record = await storageService.put("maps", map);
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap
                    }
                }
            ))
        }catch(err){
            console.error("Couldn't add tile class to map: ", err);
        }
        
    }

    async addTileToTileClass(mapId, payload) {
        try {
            const map = await storageService.getById("maps", mapId);
            if (!map) {
                console.error("Map not found");
                return;
            }

            if (!map.tileMappings) {
                map.tileMappings = {};
            }

            if (!map.tileMappings[payload.sheetId]) {
                map.tileMappings[payload.sheetId] = {};
            }

            map.tileMappings[payload.sheetId][payload.tileId] = payload.className;

            const record = await storageService.put("maps", map);
            
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));
            
        } catch (err) {
            console.error("No se pudo asignar la clase al tile", err);
        }
    }

    async exportMapForEngine(mapId) {
        try {
            const map = await storageService.getById("maps", mapId.id);
            if (!map) {
                console.error("Mapa no encontrado");
                return;
            }
    

            const tileSheetsPromises = map.tileSheets.map(sheetId => 
                storageService.getById("tileSheets", sheetId)
            );
            
            const tileSheetsData = await Promise.all(tileSheetsPromises);
    
            const exportTileSheets = tileSheetsData.map(tsData => {
                if (!tsData) return null;
                const fileName = tsData.fileName || `${tsData.name}.png`;
                return {
                    id: tsData.id,
                    src: `src/world/assets/${fileName}`,
                    tileMappings: map.tileMappings ? (map.tileMappings[tsData.id] || {}) : {}
                };
            }).filter(ts => ts !== null); 
    
            const mapName = map.metadata?.name || "Mapa_Sin_Nombre";
    
            const exportObject = {
                id: map.id,
                name: mapName,
                tileSize: parseInt(map.metadata?.tileSize || 32),
                width: parseInt(map.metadata?.width || 0),
                height: parseInt(map.metadata?.height || 0),
                tileClasses: map.tileClasses || [],
                tileSheets: exportTileSheets,
                data: map.mapTiles || [] 
            };
    
            const jsonString = JSON.stringify(exportObject, null, 2);
            
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
    
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `${mapName.replace(/\s+/g, '_').toLowerCase()}_export.json`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
    
            alert("Map exported!");
    
        } catch (error) {
            console.error("Error al exportar el mapa:", error);
        }
    }
}

const mapStore = new MapStore();
export default mapStore;


