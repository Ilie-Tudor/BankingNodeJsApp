let email_Input = document.getElementById('email');
let username_Input = document.getElementById('username');
let password_Input = document.getElementById('password');
let retype_Input = document.getElementById('retype');
let iban_Input = document.getElementById('iban');
let depostiName_Input = document.getElementById('depostiName');
let sendBtn = document.getElementById('submit');


let ValidationArray = [0,0,0,0,0,0];
function  verifyValidationArray(ValidationArray){
    for(let i=0;i<5;i++){
        if(ValidationArray[i]==0)   return false;
    }
    return true;
}
function ButtonActivate(){
    if(verifyValidationArray(ValidationArray)){
        sendBtn.removeAttribute('disabled');
    }
    else{
        sendBtn.setAttribute('disabled', true);
    }

}

function isEmail(email){
    if(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email ))
    return "";
    return "Introduceti un email valid";
}
function isUsername(username){
    if(username.length< 5)
        return "Username-ul trebuie sa aiba mai mult de 5 caractere";
    return ""
}
function isPassword(password){
    if(password.length< 10)
        return "Parola trebuie sa aiba mai mult de 10 caractere";
    return ""
}
function isRetype(retype){
    if(password_Input.value!=retype)
        return "Parola si retype-ul nu sunt identice";
    return ""
}
function isIban(iban){
    if(iban.length>0)   return ""
    else    return "Intrdouceti Ibanul";
}
function isDepositName(depositName){
    if(depositName.length>0)   return ""
    else    return "Intrdouceti numele depositului";
}

Validation_event_funtion =(e , regexValidator, validMsg = "Valid", validationIndex)=>{
    if(regexValidator(e.target.value).length == 0){
        e.target.parentElement.children[1].innerHTML = validMsg;
        e.target.parentElement.children[1].style.color = "green";
        ValidationArray[validationIndex] = 1;
    }
    else{
        e.target.parentElement.children[1].innerHTML = regexValidator(e.target.value);
        e.target.parentElement.children[1].style.color = "red";
        ValidationArray[validationIndex] = 0;
    }
}
email_Input.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isEmail,"Email Valid",0);
    ButtonActivate()
});
username_Input.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isUsername,"Username Valid",1);
    ButtonActivate()
});
password_Input.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isPassword,"Parola Valida",2);
    ButtonActivate()
});
retype_Input.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isRetype,"Reintroducera parolei este valida",3);
    ButtonActivate()
});
iban_Input.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isIban,"Ibanul este valid",4);
});
depostiName.addEventListener('input',(e)=>{
    Validation_event_funtion(e,isDepositName,"Numele depozitului este valid",5);
    ButtonActivate()
});