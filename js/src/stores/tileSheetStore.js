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
            alert("Tile sheet has been stored, you can now asing it to a map!");
            return record;
        } catch (err) {
            console.error("Error al guardar el tile sheet:", err);
            throw err;
        }
    }

    // this will populate the add tile sheet modal
    async getAll(){
        try{
            const records = await storageService.getAll("tileSheets");
            return records;
        }catch(err){
            console.error("No se pudieron obtener los datos: ", err);
        }
    }


    // this is for the dropdown
    setSheet(id) {
        this.activeSheetId = id;
        this.dispatchEvent(new CustomEvent("sheet:change", { detail: this.activeSheetId }));
    }
}
const tileSheetStore = new TileSheetStore();
export default tileSheetStore;