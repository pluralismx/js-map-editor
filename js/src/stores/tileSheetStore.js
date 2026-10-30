import storageService from "../services/storageService.js";

class TileSheetStore extends EventTarget {
    constructor(){
        super();
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
    
}
const tileSheetStore = new TileSheetStore();
export default tileSheetStore;