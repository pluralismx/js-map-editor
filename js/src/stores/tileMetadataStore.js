import storageService from "../services/storageService";

class TileMedatadaStore extends EventTarget {

    constuctor(){
        super();
    }

    async saveMetadata (metadata) {
        try{
            const record = await storageService.put("tiles", metadata);
            if(!record){
                alert("Could not save record!");
            }
            this.dispatchEvent(new CustomEvent("tileMetadata:change", {detail: record}));
            return;
        }catch(err){
            console.error(err);
        }
    }

    async updateMetadata() {

    }

}
const tileMetadataStore = new TileMedatadaStore();
export default tileMetadataStore;