import { useState, useEffect } from 'react';
import { database, storage, auth } from '/firebase-config'; // Assurez-vous d'avoir importé correctement ces références
import { ref, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export function Myaddarticle() {
  const [productType, setProductType] = useState('seeds'); // 'seeds', 'clone', 'service'
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityPerPack, setQuantityPerPack] = useState('');
  const [gender, setGender] = useState(''); // Pour seeds et clone
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hlvdTested, setHlvdTested] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [fileInputs, setFileInputs] = useState(['']); // Gérer plusieurs champs de téléchargement de fichiers

  // Ajoutez un état pour stocker l'ID de l'utilisateur
  const [sellerId, setSellerId] = useState('');
  // Pour réinitialise le champs input file
  const [formKey, setFormKey] = useState(Date.now());


  const handleFileChange = (event, index) => {
    const files = [...fileInputs];
    files[index] = event.target.files[0];
    setFileInputs(files);
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, '']);
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (const file of fileInputs) {
      const storagePath = storageRef(storage, `productImages/${file.name}`);
      const snapshot = await uploadBytes(storagePath, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      uploadedUrls.push(downloadURL);
    }
    return uploadedUrls;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mettez à jour l'état avec l'ID de l'utilisateur actuel
        setSellerId(user.uid);
      }
    });

    // Nettoyez l'abonnement à l'écouteur d'événements
    return () => unsubscribe();
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageUrls = await uploadImages(); // Téléchargez d'abord les images et récupérez les URL
    const productData = {
      sellerId,
      name,
      description,
      price: Number(price),
      shippingPrice: Number(shippingPrice),
      quantity: Number(quantity),
      quantityPerPack: Number(quantityPerPack),
      gender, // Utilisez gender pour les seeds et les clones
      hlvdTested,
      photos: imageUrls,
      state: quantity > 0 ? 'disponible' : 'vendu',
      createDate: new Date().toISOString(),

    };

    // Enregistrez productData dans Firebase Realtime Database
    const productRef = ref(database, `products/${productType}`);
    const newProductRef = push(productRef);
    await set(newProductRef, productData);
    setConfirmationMessage(`Votre produit ${name} a bien été ajouté.`);
    //Réinitialiser le formulaire ici si nécessaire
    setName('');
    setDescription('');
    setProductType('seeds'); // 'seeds', 'clone', 'service'
    setName('');
    setDescription('');
    setPrice('');
    setShippingPrice('');
    setQuantity('');
    setQuantityPerPack('');
    setGender('');
    setHlvdTested(false);
    setPhotos([]);
    setFileInputs(['']);
    setFormKey(Date.now());


  };

  return (
    <div id='myaddarticle'>

      {/* Le reste de votre formulaire ici */}
      <form onSubmit={handleSubmit} id="add-article-form" key={formKey}>
        <h2 className='manrope'>ADD NEW PRODUCT</h2>
        {/* Sélecteur de type de produit */}
        <label htmlFor="">Type of product:</label>
        <select value={productType} onChange={(e) => setProductType(e.target.value)}>
          <option value="seeds">Seeds</option>
          <option value="clone">Clone</option>
          <option value="service">Service</option>
        </select>

        {/* Champs communs */}
        <label htmlFor="">Product Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />

        <label htmlFor="">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>

        <label htmlFor="">Price: (CHF)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />


        {productType !== 'service' && (
          <>
            <label htmlFor="">Shipping price: (CHF)</label>
            <input type="number" value={shippingPrice} onChange={(e) => setShippingPrice(e.target.value)} placeholder="Shipping Price" />
          </>

        )}


        {/* Champs conditionnels pour les seeds */}
        {productType === 'seeds' && (
          <>
            <label htmlFor="">Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />

            <label htmlFor="">Quantity of seeds per pack:</label>
            <input type="number" value={quantityPerPack} onChange={(e) => setQuantityPerPack(e.target.value)} placeholder="Quantity per Pack" />

            <label htmlFor="">Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="regular">Regular</option>
              <option value="feminized">Feminized</option>
              <option value="auto-flowering">Auto-flowering</option>
            </select>
          </>
        )}

        {/* Champs conditionnels pour les clones */}
        {productType === 'clone' && (
          <>
            <label htmlFor="">Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </>

        )}

        {/* Champs conditionnels pour les seeds et clone incluant le test HLVD */}
        {productType !== 'service' && (
          <label>
            HLVD Tested:
            <input type="checkbox" checked={hlvdTested} onChange={(e) => setHlvdTested(e.target.checked)} />
          </label>
        )}

        {/* Gestion de l'ajout de photos */}
        {fileInputs.map((input, index) => (
          <div key={index}>
            <input type="file" key={formKey} onChange={(e) => handleFileChange(e, index)} />
            {index === fileInputs.length - 1 && (
              <button type="button" onClick={addFileInput} className="add-photo-btn">Add another photo</button>
            )}
          </div>
        ))}

        <button type="submit">Submit</button>
        <br />
        {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}
      </form>
    </div>


  )


}