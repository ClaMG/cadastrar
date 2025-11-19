    // MyComponent.js
    import { useNavigate } from 'react-router-dom';

    function MyComponent() {
      const navigate = useNavigate();

      const goToCreate = () => {
        navigate('/home');
      };
      const goToGet = () => {
        navigate('/users');
      };

      return (
        <>
        <button onClick={goToCreate}>Ir para home</button>
        <button onClick={goToGet}>Ir para Users</button>
        </>
      );
    }

    export default MyComponent;