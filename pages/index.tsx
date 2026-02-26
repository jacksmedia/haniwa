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

            <Image alt='a black tadpole person in a brown hooded robe with large yellow eyes, pixel art style' 
              src='https://ff6asc.vercel.app/img/favicon.png'
              width={20}
              height={20}
              className='col-1 justify-content-center align-items-center image-sizing'
            />
          
              SaGa2 "A Haniwa's Contingency" Patcher
              
            <Image alt='a black tadpole person in a brown hooded robe with large yellow eyes, pixel art style' 
              src='https://ff6asc.vercel.app/img/favicon.png'
              width={20}
              height={20}
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
