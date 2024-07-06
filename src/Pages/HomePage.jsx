import React from 'react';
import FloatContent from '../Components/Float';
import RoleSelectionComponent from '../Components/RoleSelectionComponent';
import Navigation from '../Components/Navigation';
import NavBarComponent from '../Components/NavigationBar';
const HomePage = () => {
    return ( <div>
        <NavBarComponent/>
        <FloatContent/>
        <RoleSelectionComponent/>
        <Navigation/>

    </div>

     );
}
 
export default HomePage;