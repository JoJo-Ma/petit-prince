import React from 'react';
import Navbar from '../Navbar/Navbar'
import { listOfStringsInArray } from '../Util/text_util';
import useFetchLanguages from '../LanguageSelector/useFetchLanguages';
import { Link } from 'react-router-dom';

import './Home.css'

const Home = () => {
  const { languages } = useFetchLanguages()


  return (
    <>
      <Navbar />
      <div className="home">
      <h1>Welcome!</h1>
      <p>Practice your reading and listening skills in <b>{listOfStringsInArray(languages.map(language => language.name))}</b> with the Little Prince!</p>
      <p>From <a href='https://en.wikipedia.org/wiki/The_Little_Prince'>Wikipedia</a>:</p>
      <blockquote>
      The Little Prince is a novella by French aristocrat, writer, and military aviator Antoine de Saint-Exupéry.
       It was first published in English and French in the United States by Reynal & Hitchcock in April 1943 and was published posthumously in France following liberation; 
       Saint-Exupéry's works had been banned by the Vichy Regime. 
       The story follows a young prince who visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss. 
       Despite its style as a children's book, The Little Prince makes observations about life, adults and human nature.
      </blockquote>
      <p>Head over to <Link to="/translation">Translation</Link> to start reading the book in the language of your choice now.</p>
      <p>Registered users can also submit a <Link to="/newtranslation">new translation</Link> in a different language or <Link to="/record">record</Link> their own audiobook of the book in any language already available.</p>
      </div>
    </>
  )
}

export default Home;
