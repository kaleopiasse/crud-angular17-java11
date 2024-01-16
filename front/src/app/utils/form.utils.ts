import { FormGroup } from "@angular/forms";

export class FormUtils {
    static disableControls(form: FormGroup, controls: string[]){
        controls.forEach(control => {
            form.get(control)?.disable()
        })
    }

    static enableControls(form: FormGroup, controls: string[]){
        controls.forEach(control => {
            form.get(control)?.enable()
        })
    }
}