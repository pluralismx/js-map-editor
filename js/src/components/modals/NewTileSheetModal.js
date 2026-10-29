import Component from "../../../core/component.js";
import storageService from "../../services/storageService.js";

export default class NewTileSheetModal extends Component {
    constructor(props={}){
        super(props, "div");
        this.props = props;
        this.isActive = false;
        this.render();
    }

    toggle() {
        if(this.isActive == false){
            this.mount();
            this.isActive = true;
        }else {
            this.unmount();
            this.isActive = false;
        }
    }

    async save() {
        const form = document.querySelector("#save-sprite-sheet-form");
        const formData = new FormData(form);
        
        const sheetName = formData.get("tile_sheet_name");
        const file = formData.get("sheet_file")
        
        if (!file || file.size === 0) {
            alert("Por favor selecciona un archivo de imagen.");
            return;
        }
    
        if (!sheetName) {
            alert("Ingresa un nombre para la hoja de sprites.");
            return;
        }

        try {
            const dimensions = await this.getImageDimensions(file);
    
            const assetRecord = {
                id: crypto.randomUUID(),
                name: sheetName,
                file: file,
                width: dimensions.width,
                height: dimensions.height,
                createdAt: Date.now()
            };
    
            await storageService.put("spritesheets", assetRecord);
    
    
            form.reset();
            this.toggle();
        } catch (error) {
            console.error("Error al persistir la hoja de sprites:", error);
            alert("Ocurrió un error al procesar el archivo.");
        }
        
    }

    getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("No se pudo leer la imagen"));
            };

            img.src = url;
        });
    }

    render() {
        this.element.innerHTML = /*html*/ `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <span>New sprite sheet</span>
                        <span class="close-button" data-click="toggle">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form class="modal-form" id="save-sprite-sheet-form">
                            <div class="form-field-vertical">
                                <label>Name: </label>
                                <input type="text" class="input-blue" name="tile_sheet_name"/>
                            </div>
                            <div class="form-field-vertical">
                                <label>File: </label>
                                <input type="file"  name="sheet_file"/>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="button-blue" style="width: 80px;" data-click="toggle">Cancel</button>
                        <button type="button" class="button-basic" style="width: 80px;" data-click="save">OK</button> 
                    </div>
                <div>
            </div>
        `;
    }
}