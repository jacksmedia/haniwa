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
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-2.pdf">
					Armor & Items
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-3.pdf">
					Weapons
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-4.pdf">
					Abilities
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-5.pdf">
					Mutant Ability Levels
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-6.pdf">
					Monster Level 11
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-7.pdf">
					MAGI
				</a>
			</li>
			<li>
				<a href="https://github.com/jacksmedia/haniwa/blob/main/public/Guide/AHC-Guide-1.pdf">
					Full Game Walkthrough
				</a>
			</li>
        </ul>
		<h2>
			<a target="_blank" href="https://github.com/jacksmedia/haniwa/blob/main/public/SaGa2-AHC-Guides.zip" className='special-link'>
				Download all Guides (.docx) in a .zip file
			</a>
		</h2>
      </div>
    </Layout>
  );
};

export default Guides;