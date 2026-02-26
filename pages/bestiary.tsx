import { NextPage } from 'next';
import Layout from '@/layout';
import MdD from "@/components/MdDisplay";

const Guide: NextPage = () => {
  return (
    <Layout>      
      <div className='guides-bg'>
        <h4>SaGa2 "A Haniwa's Contingency"</h4>
        <p>by Lightning Hunter</p>
        <MdD mdFile='guides/Bestiary.md' />
      </div>
    </Layout>
  );
};

export default Guide;