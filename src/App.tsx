import { ApolloClient, InMemoryCache,ApolloProvider } from '@apollo/client'
import Categories from './component/categories';
import Subcategories from './component/Subcategories';
import Products from './component/Products';

const client = new ApolloClient({
  uri: "https://backend-1-dboj.onrender.com/graphql",  // Replace localhost with the Render URL
  cache: new InMemoryCache(),
});
function App() {  

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Product Store</h1>
        <Categories />
        <Subcategories />
        <Products />
      </div>
    </ApolloProvider>
  );
}

export default App
