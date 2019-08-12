export default {
    dom: new Proxy({}, {
        get (target: any, property: string, receiver: any) {
            return function (attribute: any, ...children: HTMLElement[]) {
                let doc = document.createElement(property as any) as HTMLElement;
                for (let a in attribute) {
                    doc.setAttribute(a, attribute[a]);
                }
                for (let e of children) {
                    doc.appendChild(e);
                }
                return doc;
            }
        }
    })
}