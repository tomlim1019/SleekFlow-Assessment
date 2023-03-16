import Head from 'next/head';
import {Inter} from 'next/font/google';
import styles from '@/styles/Home.module.css';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const inter = Inter({subsets: ['latin']});

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home({data}: any) {
  const [searchData, setSearchData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const searchDebounced = async () => {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${debouncedSearchTerm}`);
      const newData = await response.json();
      setSearchData(newData);
      setPage(1);
    };

    searchDebounced();
  }, [debouncedSearchTerm]);

  const loadPage = async (pageNum: number, link?: string) => {
    const response = await fetch(link ?? `https://rickandmortyapi.com/api/character/?page=${pageNum}`);
    const newData = await response.json();
    setSearchData(newData);
    setPage(pageNum);
  };

  const Pagination = () => {
    const totalPages = searchData.info?.pages ?? 1;
    const pages = [];

    for (let i = page - 4 > 0 ? page - 4 : 1; i <= totalPages && pages.length < 8; i++) {
      pages.push(i);
    }

    return (
      <div className={styles.pagination}>
        {page > 1 && (
          <button onClick={() => loadPage(page - 1, searchData.info.prev)}>Prev</button>
        )}
        {pages.map((pageNum) => (
          <button key={pageNum} onClick={() => loadPage(pageNum, searchData.info.next)} disabled={page === pageNum}>
            {pageNum}
          </button>
        ))}
        {page < totalPages && (
          <button onClick={() => loadPage(page + 1, searchData.info.next)}>Next</button>
        )}
      </div>
    );
  };

  const handleCharacterClick = (id: string) => {
    router.push(`contact/${id}`);
  };


  return (
    <>
      <Head>
        <title>Contact List - SleekFlow</title>
        <meta name="description" content="View our list of contacts with their related information."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={styles.main}>
        <h1 className={inter.className}>
          Contacts
        </h1>

        <div>
          <input type="text" onInput={handleSearch} placeholder="Search Name"/>
        </div>

        <table className={inter.className}>
          <thead>
          <tr>
            <td>Name</td>
            <td>Gender</td>
            <td>Species</td>
            <td>Origin</td>
            <td>Location</td>
            <td>Status</td>
          </tr>
          </thead>
          <tbody>
          {searchData.results?.length > 0 && searchData.results.map((item: any, index: any) => {
            return (
              <tr key={index} onClick={() => handleCharacterClick(item.id)}>
                <td>{item.name}</td>
                <td>{item.gender}</td>
                <td>{item.species}</td>
                <td>{item.origin.name}</td>
                <td>{item.location.name}</td>
                <td>{item.status}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        <Pagination/>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}
