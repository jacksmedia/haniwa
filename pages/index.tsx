import { NextPage } from 'next';
import Image from "next/image";
import Layout from '@/layout';
import MainPatcher from '@/components/MainPatcher';
import Attribution from '@/components/Attribution';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className='plus-patcher-bg container'>
        <div className='flex-col justify-content-around col-10'>

            <h1 className='app-title'>SaGa2 "A Haniwa's Contingency"</h1>
            <div className='flex-row justify-content-center col-4'>
              <Image alt='an egg shaped grey doll with a ghost face and tiny arms' 
                src='/img/favicon.png'
                width={26}
                height={26}
                className='col-1 justify-content-center align-items-center image-sizing'
              />
              <h1 className='app-title'>Patcher</h1>
              <Image alt='an egg shaped grey doll with a ghost face and tiny arms' 
                src='/img/favicon.png'
                width={26}
                height={26}
                className='col-1 justify-content-center align-items-center image-sizing' 
              />
            </div>
          
        </div>
        <MainPatcher />
        {/* row styling exists in above component*/}
        <Attribution />
      </div>
    </Layout>
  );
};
export default HomePage;
