(() => {

  /*
  Store the calculated ciphertext here, so we can decrypt the message later.
  */
  let ciphertext;

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#rsa-oaep-message");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
  async function encryptMessage(key) {
    let encoded = getMessageEncoding();
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encoded
    );

    let buffer = new Uint8Array(ciphertext, 0);
    const ciphertextValue = document.querySelector(".rsa-oaep .ciphertext-value");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    });
    // mengubah output buffer(desimal) menjadi karakter ascii
    let siperteks = String(`${buffer}`); //memasukkan output buffer ke variabel terpisah
    let char = '';
    arr = siperteks.split(','); // memisah output dari buffer
    for (i = 0; i < arr.length; i++) { // perulangan sepanjang array
      char += String.fromCharCode(arr[i]); // String.fromCharCode --> mengubah jadi ascii
    }
    // ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
    // ciphertextValue.textContent = `${buffer}`;
    ciphertextValue.textContent = `${char}`;
    // untuk membandingkan hasil desimal dan karakternya
    // window.alert(char+"\n DECIMAL:\n"+`${buffer}`);
  }

  /*
  Fetch the ciphertext and decrypt it.
  Write the decrypted message into the "Decrypted" box.
  */
  async function decryptMessage(key) {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      ciphertext
    );

    let dec = new TextDecoder();
    const decryptedValue = document.querySelector(".rsa-oaep .decrypted-value");
    decryptedValue.classList.add('fade-in');
    decryptedValue.addEventListener('animationend', () => {
      decryptedValue.classList.remove('fade-in');
    });
    decryptedValue.textContent = dec.decode(decrypted);
  }

  /*
  Generate an encryption key pair, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
  window.crypto.subtle.generateKey(
    {
    name: "RSA-OAEP",
    // Consider using a 4096-bit key for systems that require long-term security
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  ).then((keyPair) => {
    const encryptButton = document.querySelector(".rsa-oaep .encrypt-button");
    encryptButton.addEventListener("click", () => {
      encryptMessage(keyPair.publicKey);
      let keypub = String(keyPair.publicKey);
      const key2 = document.querySelector(".pubKey");
      key2.textContent = keypub;
    });

    const decryptButton = document.querySelector(".rsa-oaep .decrypt-button");
    decryptButton.addEventListener("click", () => {
      decryptMessage(keyPair.privateKey);
      let keypriv = String(keyPair.publicKey);
      const key1 = document.querySelector(".privKey");
      key1.textContent = keypriv;
    });
  });

})();
