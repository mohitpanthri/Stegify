<div align="center"> 
  <h1>S T E G I F Y</h1>
</div>
  
This is a group project created for my course **"Number Theory and Cryptology"** during the Semester-6 of my UG Degree in B.Tech CSE.
We have created a website which provides functionality to encode a message in an image and to decode the message from the image.

<br>

<div align="center"> 

## Watch the Live [Demo](https://stegify.netlify.app/)  
<sup>**Status:**</sup>  [![Netlify Status](https://api.netlify.com/api/v1/badges/1a237f2f-9601-4cf7-a1f7-baf667d32663/deploy-status)](https://app.netlify.com/sites/stegify/deploys)
</div> 

<br>


### Screenshot 📸
![StegifyWebsite](https://user-images.githubusercontent.com/99413629/236607719-9c737354-6343-4b64-82cf-4772f848664f.png)
<hr>


### About Steganography 📝
**Steganography** is the practice of concealing a secret message within an ordinary message or file, without anyone else being aware that there is a hidden message. The goal of steganography is to hide the existence of the message, so that it can be transmitted undetected. Unlike cryptography, which relies on encryption to make a message unreadable to anyone who doesn't have the key, steganography does not alter the message in any way. Instead, it hides the message within the data of another file, such as an image or audio file, by subtly changing certain bits of information. Steganography can be used for a variety of purposes, from covert communication to digital watermarking, and has been used throughout history in various forms.
<hr>


### Implementation 
The User chooses an image, then image data is normalized by rounding down the values of any odd-numbered pixels, effectively "nulling" them. It does this by iterating through each pixel's RGBA (red, green, blue, alpha) values, rounding down any odd-numbered value to the nearest even number.
After nulling the original image, the message text is converted to a binary string by iterating through each character and converting it to an 8-bit binary representation. It then pads each binary representation with leading zeros as needed to ensure that each character has 8 bits.
Since the image was normalized, we now know that an **even** r, g or b value is **0** and an **uneven** is a **1**. And this is how the
 message is decoded back from the image.
<hr>

### Additional Layers of Security
While steganography itself is a form of hidden communication, it is not always completely secure. Here are some additional layers of security that can be added to steganography to make it more secure:

1. **Encryption:** Before embedding a secret message within an ordinary message, it can be encrypted to make it even more difficult to decode.

2. **Password protection:** A password or key can be required to access the hidden message, ensuring that only the intended recipient can read it.

3. **File type conversion:** Embedding a message in an image or audio file is common, but it can be further secured by converting the file type to a less common or known format, which can make it more difficult to detect.

4. **Embedding in multiple files:** Rather than embedding a message in a single file, it can be spread out over several files, making it even more difficult to detect and decode.

5. **Steganography within steganography:** It is possible to embed one steganographic message within another, making it even more challenging to detect the hidden message.

By adding these additional layers of security, steganography can become a more effective and secure method of hidden communication. However, it is important to keep in mind that no method of communication can be entirely foolproof, and that constant vigilance and caution are always necessary to ensure the security of sensitive information.

