import React from 'react';
import { Row, Button, Image } from 'react-bootstrap';
import PokemonGoBanner from '../assets/images/banner.jpg';

const Home = ({ history }) => {
  const handleNavigateToLogin = () => {
    history.push('/login');
  };

  const handleNavigateToRegister = () => {
    history.push('/register');
  };

  return (
    <Row className="bg-white py-5 justify-content-center homeContainer">
      <div className="homeContainer__home">
        <h1 className="text-center">PoGo Raid</h1>
        <Image src={PokemonGoBanner} className="homeContainer__image" />
        <div className="text-center m-3">
          <Button
            variant="primary"
            type="submit"
            onClick={handleNavigateToLogin}
          >
            Login
          </Button>
          <Button
            variant="success"
            type="submit"
            onClick={handleNavigateToRegister}
          >
            Register
          </Button>
        </div>
      </div>
    </Row>
  );
};

export default Home;
