import Head from 'next/head';
import {Inter} from 'next/font/google';
import styles from '@/styles/Home.module.css';
import Image from "next/image";
import {useEffect, useState} from "react";

const inter = Inter({subsets: ['latin']});

export default function Details({character}: any) {
  const [loading, setLoading] = useState(true);
  const [episodeData, setEpisodeData] = useState<any>([]);

  useEffect(() => {
    const getEpisodeData = async () => {
      for (let i = 0; i < character.episode.length; i++) {
        try {
          const episodeResponse = await fetch(character.episode[i]);
          const episode = await episodeResponse.json();

          episodeData.push(episode);
          if (episodeData.length === character.episode.length) {
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    };

    getEpisodeData();
  }, []);
  
  return (
    <>
      <Head>
        <title>{character.name} - SleekFlow</title>
        <meta name="description" content={`View information about ${character.name}`}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={styles.detailsContainer}>
        <div className={styles.topContainer}>
          <Image src={character.image} alt={character.name} width={150} height={150}/>
          <h1 className={inter.className}>
            {character.name}
          </h1>
        </div>

        <h2 className={inter.className}>Personal Info</h2>
        <div className={`${styles.contentContainer} ${inter.className}`}>
          <p>Gender: {character.gender}</p>
          <p>Species: {character.species}</p>
          <p>Location: {character.location.name}</p>
          <p>Origin: {character.origin.name}</p>
          <p>Status: {character.status}</p>
        </div>
        <h2 className={inter.className}>Episodes</h2>
        <table className={inter.className}>
          <thead>
          <tr>
            <td>Name</td>
            <td>Episode</td>
            <td>Air Date</td>
          </tr>
          </thead>
          <tbody>
          {episodeData?.length > 0 && !loading && episodeData.map((item: any, index: any) => {
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.episode}</td>
                <td>{item.air_date}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const data = await response.json();

  const paths = data.results.map((item: any) => {
    return {
      params: {id: item.id.toString()}
    };
  });

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({params}: any) {
  const response = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`);
  const data = await response.json();

  return {
    props: {
      character: data,
    },
  };
}
