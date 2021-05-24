const btn = document.getElementById('submit');

function sendData( data ) {

  const XHR = new XMLHttpRequest();

  let urlEncodedData = "",
      urlEncodedDataPairs = [],
      name;

  for( name in data ) {
    urlEncodedDataPairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( data[name] ) );
  }
  urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
  XHR.addEventListener( 'load', function(event) {
    let res = JSON.parse(XHR.response)
    console.log(res);
    alert(res.msg);
    if(res.send){
      window.location.href = "/";
    }
    else{
      window.location.href = "/transfer";
    }
  } );
  XHR.addEventListener( 'error', function(event) {
    alert( 'Oops! Something went wrong.' );
    window.location.href = "/";

  } );
  XHR.open( 'POST', '/api/transfer' );
  XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  XHR.send( urlEncodedData );
}



btn.addEventListener( 'click', function() {
    let senderIban = document.getElementById('deposit').value;
    let receiverIban = document.getElementById('receiver-iban').value;
    let amount = document.getElementById('amount').value; 
    let description = document.getElementById('description').value; 
    sendData( {senderIban: senderIban,receiverIban:receiverIban,amount:amount,description:description} );
})