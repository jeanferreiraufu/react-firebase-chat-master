import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <main className="welcome">
      <h2>Bem Vindo ao Great Love Players ???? ??</h2>
      <img src="/logo512.png" alt="ReactJs logo" width={50} height={50} />
      <p>Faça login no Google para conversar com seus colegas desenvolvedores do React.</p>
      <button className="sign-in">
        <img
          onClick={googleSignIn}
          src={GoogleSignin}
          alt="faça login com o google"
          type="button"
        />
      </button>
    </main>
  );
};

export default Welcome;
