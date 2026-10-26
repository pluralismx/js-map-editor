export default class Component {

    constructor(tagName = "div"){
        this.element = document.createElement(tagName);
        this.addActions();
    }

    addActions() {
        const supportedEvents = ["click", "change", "submit"];
    
        supportedEvents.forEach(eventType => {
            this.element.addEventListener(eventType, (e) => {
                const target = e.target.closest(`[data-${eventType}]`);
                if (!target || !this.element.contains(target)) return;
    
                if (eventType === "submit") {
                    e.preventDefault();
                }
    
                const actionName = target.dataset[eventType];
                if (typeof this[actionName] === "function") {
                    this[actionName](target, e);
                } else {
                    console.warn(`"${actionName}" method does not exist in ${this.constructor.name}`);
                }
            });
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