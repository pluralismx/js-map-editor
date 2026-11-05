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
            this.dispatchEvent(new CustomEvent("map:change", {detail: this.activeMap}))
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

            Object.assign(map.tileMappings, payload);

            const record = await storageService.put("maps", map);
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", {detail: this.activeMap}))
        } catch (err) {
            console.error("No se pudo asignar la clase al tile", err);
        }
    }

    async exportMapForEngine(mapId) {
        try {
            // 1. Obtener el mapa de la base de datos
            const map = await storageService.getById("maps", mapId);
            if (!map) {
                console.error("Mapa no encontrado");
                return;
            }

            // 2. Obtener el tile sheet de la base de datos para armar la ruta 'src'
            // Tomamos el primer tile sheet (ya que por ahora es uno solo)
            const tileSheetId = map.tileSheets[0];
            const tileSheetData = await storageService.getById("tileSheets", tileSheetId);
            
            if (!tileSheetData) {
                console.error("Tile sheet no encontrado en la base de datos");
                return;
            }

            // Ajusta 'fileName' al nombre de la propiedad real donde guardas el nombre de la imagen (ej. 'bosque.png')
            const fileName = tileSheetData.fileName || `${tileSheetData.name}.png`;

            // 3. Construir el objeto exactamente como lo necesita el motor
            const exportObject = {
                id: map.id,
                name: map.name,
                tileSize: parseInt(map.tileSize),
                width: parseInt(map.width),
                height: parseInt(map.height),
                tileClasses: map.tileClasses || [],
                tileSheets: [
                    {
                        id: tileSheetId,
                        src: `src/world/assets/${fileName}`,
                        // Mueve los mappings que guardaste en el mapa hacia adentro del tilesheet
                        tileMappings: map.tileMappings || {} 
                    }
                ],
                // Como es una sola capa, mandamos el arreglo directamente en la raíz
                // Cambia 'levelData' por el nombre real de tu propiedad donde guardas el arreglo 1D dibujado
                data: map.levelData || [] 
            };

            // 4. Convertir el objeto a formato JSON
            const jsonString = JSON.stringify(exportObject, null, 2);
            
            // 5. Crear un archivo Blob en memoria
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            // 6. Crear un enlace invisible para forzar la descarga en el navegador
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            // Nombra el archivo basándose en el nombre del mapa (ej. "level_1_export.json")
            downloadLink.download = `${map.name.replace(/\s+/g, '_').toLowerCase()}_export.json`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // 7. Limpiar el DOM y la memoria
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            console.log("Mapa exportado con éxito");

        } catch (error) {
            console.error("Error al exportar el mapa:", error);
        }
    }
}

const mapStore = new MapStore();
export default mapStore;


