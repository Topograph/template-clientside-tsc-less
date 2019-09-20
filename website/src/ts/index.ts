/// <reference types="jquery" />

class lurch {
    constructor() {
        console.log("hello lurch2");
        jQuery("body").on("click", ()=> {
            alert("yeeeehaaw!");
        });

    }
}