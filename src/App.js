
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDt7iBW0Lvkaz37gjAdXUNjBuvshBPT-lE",

  authDomain: "superchat-dd9cc.firebaseapp.com",

  projectId: "superchat-dd9cc",

  storageBucket: "superchat-dd9cc.appspot.com",

  messagingSenderId: "526388341241",

  appId: "1:526388341241:web:24bc73418e8e29f722b528",

  measurementId: "G-HMJZPT4LWN"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </header>
    </div>
  );
}

function SignIn(){
      
    const signInwithGoogle = () =>{
            const provider = new firebase.auth.GoogleAuthProvider();
                  auth.signInwithPopup(provider);
      }
  return (
            <button onClick={signInwithGoogle}>Sign In with Google</button>
  )
}

function SignOut(){
      return auth.currentUser && (
          <button onClick={() => auth.signOut()}>Sign Out</button>
      )
}

function ChatRoom(){

        const dummy = useRef()
        const messageRef = firebase.collection('messages');
        const query = messageRef.orderBy('createdAt').limit(25);

        const[messages] = useCollectionData(query ,{idField: 'id'});
        const [formvalue,setFormValue] = useState('');

          const sendMessage = async (e) => {
                e.preventDefault();

                const {uid, photoURL} = auth.currentUser;
                  //create new document in firestore
                  await messagesRef.add({

                        text: formValue,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        uid,
                        photoURL
                  })
                  setFormValue('');
 
                  dummy.current.scrollIntoView({behavior: 'smooth'});
              }
        return(
          <>
              
                <main >
                      {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
                      <div ref={dummy}></div>

                </main>
              
                <form onSubmit={sendMessage}>
                
                  <input value={formvalue} onChange={(e) => setFormValue(e.target.value)}/>
                  <button type="submit">Send</button>
                </form>
          </>
        )
}

function ChatMessage(props){

    const {text,uid} = props.message;
    //conditinal CSS
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

     return (
     
            <div className={`message ${messageClass}`}> 
                     <img src={photoUrl} />
                     <p>{text}</p>
            </div>
     )
    
}
export default App;
