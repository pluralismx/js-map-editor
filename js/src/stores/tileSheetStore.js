import storageService from "../services/storageService.js";

class TileSheetStore extends EventTarget {
    constructor(){
        super();
        this.activeSheet = null;
    }

    async saveSheet({ name, file }) {
        try {

            const bitmap = await createImageBitmap(file);
            const { width, height } = bitmap;
            bitmap.close(); 

            const newSheet = {
                id: crypto.randomUUID(),
                name,
                file,
                width,
                height
            };
    
            const record = await storageService.put("tileSheets", newSheet);
            return record;
        } catch (err) {
            console.error("Error al guardar el tile sheet:", err);
            throw err;
        }
    }

    async getAll(){
        try{
            const records = await storageService.getAll("tileSheets");
            return records;
        }catch(err){
            console.error("No se pudieron obtener los datos: ", err);
        }
    }

    async setSheet(id) {
        try{
            const sheet = await storageService.getById("tileSheets", id);
            if(!sheet){
                alert("No se encontro la hoja de tiles");
                return;
            }
            this.activeSheet = sheet;
            this.dispatchEvent(new CustomEvent("sheet:change", {detail: this.activeSheet}));
        }catch(err){
            console.error(err);
        }
    }
}
const tileSheetStore = new TileSheetStore();
export default tileSheetStore;