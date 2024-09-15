import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import dotenv from 'dotenv';

dotenv.config();

firebase.initializeApp({
  // Your web app's Firebase configuration
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
});

const colecaoDefault = 'chat01';
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();
const storage = firebase.storage();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Great Love Players 🔥💬 ♚♛</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}


function SignIn() {

  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const signInWithGoogle = () => {
    let colecaoDefault = value.trim();
    if (colecaoDefault.length > 5 && (colecaoDefault === 'messages' || colecaoDefault === 'chat01' || colecaoDefault === 'chat02' || colecaoDefault === 'chat03')) {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    } 
  }

  return (
    <>
      <div className="form-group">
        <div> <h3>Entre com a chave da sala:</h3></div>
        <input value={value} onChange={onChange} type="password" name="password" className="entrada" />    
      </div>
      <div className="form-group">
        <button className="sign-in" onClick={signInWithGoogle}>Clique e entre com a conta Google</button>
      </div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sair</button>
  )
}


function ChatRoom() {
  
  const dummy = useRef();
  const messagesRef = firestore.collection(colecaoDefault);
  const query = messagesRef.orderBy('createdAt').limit(10000);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');
  const [setFileUrl] = React.useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  } 

  const onFileChange = (e) => {
		// we use the name of our file from the input to create a file name on firestore
		//then we use fileRef to actually add the data
		const file = e.target.files[0];
		const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    

    setFormValue(file.name);
		fileRef.put(file).then(() => {
			console.log('Uploaded a file.');
    });
    setFileUrl(fileRef.getDownloadURL());
	};



  return (<>
    <main>

      {messages?.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <div>
      <form onSubmit={sendMessage}>
        <label htmlFor='selecao-arquivo'>Selecione uma Foto</label>
        <input id='selecao-arquivo' type="file" onChange={onFileChange} >
        </input>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="digite algo aqui e em seguida clique enviar" />
        <button type="submit" disabled={!formValue}>Enviar🕊️</button>
      </form>
    </div>


  </>)
}

// import PropTypes from 'prop-types';

function ChatMessage({ message: { text, uid, photoURL } }) {

  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

  const urlPhoto = 'https://ui-avatars.com/api/?name=' + auth.currentUser.displayName;
        
  return (
      <div className={`message ${messageClass}`}>
        <img src={urlPhoto}/>
        <p>{text}</p>
      </div>
    )
  
}



export default App;
