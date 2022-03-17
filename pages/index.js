import React from 'react';
import cn from 'classnames';
import styles from '../styles/Home.module.css';

export default function Home() {


  return (
    <>
      <Form />
    </>
  )
}

function Form() {
  const registerUser = async event => {
    event.preventDefault()

    const path = event.target.file;

    const formData = new FormData();
    formData.append("file", path.files[0]);

    try {
      const res = await fetch(`https://api-6rvxylw3fq-de.a.run.app/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      // const res = await fetch(`http://127.0.0.1:5000/`, {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Access-Control-Allow-Origin': '*'
      //   }
      // })

      const result = await res.json();
      console.log(result);
      // result.user => 'Ada Lovelace'
    } catch (err) {
      alert(err);
    }
  }

  return (
    <form onSubmit={registerUser}>
      <label htmlFor="name">Name</label>
      <input id="name" name="file" type="file" accept='audio/*' />
      <button type="submit" name='upload'>Register</button>
      <input id="link" name="link" type="text" />
      <button type="submit" name='upload'>Register</button>
    </form>
  )
}