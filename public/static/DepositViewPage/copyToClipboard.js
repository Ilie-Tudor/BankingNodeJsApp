let shareBtn = document.getElementById('share');
let iban = document.getElementsByClassName('iban')[0];
let text = "Example text to appear on clipboard";


shareBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(`${iban.innerHTML}`).then(function() {
        alert(`${iban.innerHTML} copiat in clipboard`);
        console.log('Ibanul a fost copiat in clipboard');
      }, function(err) {
        console.error('Eroare: ', err);
      });
});
