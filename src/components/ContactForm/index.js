import { useState } from 'react';

import s from "./contact.module.css";


export default function ContactForm({children}) {
    let [contactSuccess, setContactSuccess] = useState(null);
    let [contactResultMessage, setContactResultMessage] = useState('');
  
    const handleContactSubmit = async (e) => {
      e.preventDefault();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;
      const message = document.getElementById("message").value;
      try {
        if (!email || !name || !message) {
          throw new Error('Please fill all fields')
        }
        if (!emailRegex.test(email)) {
          throw new Error('Please use a valid email')
        }
        setContactSuccess('sending')
        setContactResultMessage('Sending Email')
        const contactRequest = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({email, name, message}),
        }); 
        if (contactRequest.status >= 400) {
          const netError = new Error(contactRequest.statusText);
          netError.status = contactRequest.status;
          throw netError;
      }
        setContactSuccess(true)
        setContactResultMessage('Message Sent')
      } catch (err) {
        console.log(err)
        setContactSuccess(false)
        setContactResultMessage(err.message)
        setTimeout(() => {
            setContactSuccess(null)
            setContactResultMessage('')
        }, 5000)
      }
    }
    let buttonColor = 'primary';
    // ContactSuccess can be 'sending', null, true, false
    if (contactSuccess === false) {
        buttonColor = 'danger'
    } else if (contactSuccess === true) {
        buttonColor = 'success';
    }
    return (
        <div 
            id='contact'
            className={`col-12 row justify-content-center align-items-center align-content-start position-relative pt-4 pt-md-5 px-2`}>
            <div className='col-12 col-md-10 col-xl-8 row position-relative'>
              {children}
            </div>
        <div className='col-12 col-md-10 col-xl-8 row justify-content-center position-relative py-5 my-2'>
          <form className='col-12 col-md-10 row' onSubmit={handleContactSubmit} style={{zIndex: 20}}>
            <div className='col-12 row'>
              <div className='col-md-6 col-12 px-2 pb-md-0 pb-2'>
                <div
                  className={`p-1 px-3 rounded-3 w-100 ${s.contactInput}`}>
                  <input 
                    type="email" 
                    placeholder='Email'
                    className="form-control shadow-none p-0 m-0 bg-transparent w-100 border-0 rounded-0 fs-5" 
                    id="email" />
                </div>
              </div>
              <div className='col-md-6 col-12 px-2'>
                <div
                  className={`p-1 px-3 rounded-3 w-100 ${s.contactInput}`}>
                  <input 
                    type="name" 
                    placeholder='Name'
                    className="form-control shadow-none p-0 m-0 bg-transparent w-100 border-0 rounded-0 fs-5" 
                    id="name" />
                </div>
              </div>
            </div>

            <div className='col-12 row p-2'>
              <div
                className={`p-1 px-3 rounded-3 w-100 ${s.contactInput}`}>
              <textarea 
                placeholder="What's on your mind?"
                className="form-control shadow-none p-0 m-0 bg-transparent w-100 border-0 rounded-0 fs-5" 
                id="message" 
                row={4} 
                maxLength={512} />
              </div>
            </div>

            <div className='col-12 row'>
              <div className='col-md-6 col-12 px-2 pb-2'>
                <span className='text-dark p-0 fs-small'>
                    Say something nice!
                </span>
              </div>
              <div className='col-md-6 col-12 px-2'>
                <div
                  className={`p-1 px-3 rounded-3 w-100 btn btn-${buttonColor}`}>
                  <input 
                    type="submit" 
                    disabled={contactSuccess === true}
                    value={contactSuccess === null ? 'Send' : contactResultMessage}
                    className="form-control shadow-none p-0 m-0 bg-transparent text-light w-100 border-0 rounded-0 fs-5" />
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    )
};
