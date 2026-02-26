import { NextPage } from 'next';
import Image from "next/image";
import Layout from '@/layout';
import MainPatcher from '@/components/MainPatcher';
import Attribution from '@/components/Attribution';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className='plus-patcher-bg container'>
        <div className='flex-row justify-content-around'>
          <p className='col-10 justify-content-center app-title'>

            <Image alt='an egg shaped grey doll with a ghost face and tiny arms' 
              src='/img/favicon.png'
              width={26}
              height={26}
              className='col-1 justify-content-center align-items-center image-sizing'
            />
          
              SaGa2 "A Haniwa's Contingency" Patcher
              
            <Image alt='an egg shaped grey doll with a ghost face and tiny arms' 
              src='/img/favicon.png'
              width={26}
              height={26}
              className='col-1 justify-content-center align-items-center image-sizing' 
            />
          
          </p>
          
        </div>
        <MainPatcher />
        {/* row styling exists in above component*/}
        <Attribution />
      </div>
    </Layout>
  );
};
export default HomePage;
