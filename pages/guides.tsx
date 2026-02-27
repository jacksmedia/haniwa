import { NextPage } from 'next';
import Layout from '@/layout';
import TitleScreen from "@/components/TitleScreen";

const Guides: NextPage = () => {
  return (
    <Layout>      
      <div className='guides-bg'>
        <h1 className="">SaGa2 "A Haniwa's Contingency" Guides</h1>
          <TitleScreen />
        <p>All docs by the author of this romhack, Lightning Hunter</p>
        <ul className='guides-list'>
			<li>
				<a href="/items">
					Item List
				</a>
			</li>
			<li>
				<a href="/bestiary">
					Bestiary List
				</a>
			</li>
			<li>
				<a href="/treasure">
					Treasure Checklist
				</a>
			</li>
			<li>
				<a href="/meats">
					Monster Evolution List
				</a>
			</li>
			<li>
				<a href="/walkthrough">
					Full Game Walkthrough
				</a>
			</li>
        </ul>
		<h2>
			<a target="_blank" href="FFL2-AHC-Guides.zip" className='special-link'>
				Download all Guides (.docx) in a .zip file
			</a>
		</h2>
      </div>
    </Layout>
  );
};

export default Guides;