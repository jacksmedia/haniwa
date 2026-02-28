import { NextPage } from 'next';
import Layout from '@/layout';
import TitleScreen from "@/components/TitleScreen";

const Discord: NextPage = () => {
  return (
    <Layout>      
      <div className='discord-bg'>
        <h2>Join us in Discord</h2>
        <TitleScreen />
        <h1 className="">Discuss SaGa2 AHC</h1>
        <h2>( #lightning-projects channel )</h2>        
        <h2><a href="https://discord.gg/PGMASbSnD9" target='blank'>▶ FF4 Ultima Discord ◀</a></h2>
      </div>
    </Layout>
  );
};

export default Discord;