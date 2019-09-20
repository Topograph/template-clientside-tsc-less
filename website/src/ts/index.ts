/// <reference types="jquery" />

class lurch {
    constructor() {
        console.log("hello lurch2");
        jQuery("body").on("click", ()=> {
            alert("yeeeehaaw!");
        });

        let testvar = true;

        testvar = false;

        this.tryFunctionname(testvar);

    }

    private tryFunctionname(kokolores: boolean) {
        console.log(kokolores);
    }
}