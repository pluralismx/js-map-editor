export default class Component {

    constructor(tagName = "div"){
        this.element = document.createElement(tagName);
        this.addActions();
    }

    addActions(){
        console.log("added acctions");
        console.log(this.element);
        this.element.addEventListener("click", (e) => { 
            // Primero obtenemos el nodo en donde se registro la accion, esto siempre seria verdadero al momento
            // de hacer clic dentro del dom, de otra forma const target estuviera vacio, y la validacion siguiente
            // nunca llegaria a ejecutarse ya que eso generaria un error de cannot read properties of undefined.
            const target = e.target.closest("[data-action]");
            // console.log(target);
            // por eso no es necesaria la validacion de !target, ya que eso ya hubiera arrojado un error en si const
            // no fue definida. Entonces probablemente deberiamos de quitar el !target. Sin embargo aqui abajo lo que
            // estamos haciendo es verificar que el nodo padre es decir element contenga al nodo hijo, es decir de donde
            // provino el evento
            if(!target || !this.element.contains(target)) return;
            // Ahora hay que verificar que la accion accion exista en el nodo hijo, para eso la vamos a almacenar en una constante
            // aqui data set nos ayuda a encontrar el valor de data-action, de esta forma sabemos cual es el nombre de la funcion
            // que se llamo desde el nodo hijo que la contiene
            const actionName = target.dataset.action;
            // Luego seria bueno validar que la accion exista
            if(typeof this[actionName] === "function") {
                this[actionName](e);
            }else{
                console.warn(`"${actionName}" method does not exists in ${this.constructor.name}`);
            }
        });

        this.element.addEventListener("submit", (e) => {
            const target = e.target.closest("[data-action]");
            if (!target || !this.element.contains(target)) return;
            
            e.preventDefault();
    
            const actionName = target.dataset.action;
            if (typeof this[actionName] === "function") {
                this[actionName](e);
            }
        });
    }

    mount(parent = document.body) {
        if (!this.element.isConnected) {
            parent.appendChild(this.element);
        }
    }

    unmount() {
        if (this.element.isConnected) {
            this.element.remove();
        }
    }

    render(){
        return this.element;
    }

}