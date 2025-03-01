import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      description
      price
      category {
        id
        name
      }
      subcategory {
        id
        name
      }
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String
    $price: Float!
    $categoryId: ID!
    $subcategoryId: ID
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      categoryId: $categoryId
      subcategoryId: $subcategoryId
    ) {
      id
      name
      description
      price
      category {
        id
        name
      }
      subcategory {
        id
        name
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

const GET_SUBCATEGORIES = gql`
  query GetSubcategories {
    getSubcategories {
      id
      name
    }
  }
`;

const Products = () => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: subcategoriesData } = useQuery(GET_SUBCATEGORIES);
  const [addProduct] = useMutation(ADD_PRODUCT);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({ variables: { name, description, price: parseFloat(price), categoryId, subcategoryId } });
    refetch();
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setSubcategoryId("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        
        {/* Category Dropdown */}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select Category</option>
          {categoriesData?.getCategories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        {/* Subcategory Dropdown */}
        <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
          <option value="">Select Subcategory (Optional)</option>
          {subcategoriesData?.getSubcategories.map((sub: any) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        
        <button type="submit">Add Product</button>
      </form>

      {/* Display Product List */}
      <ul>
        {data.getProducts.map((product: any) => (
          <li key={product.id}>
            <strong>{product.name}</strong>: {product.description || "No description"}, 
            <strong> ${product.price}</strong><br />
            <em>Category:</em> {product.category ? product.category.name : "No Category"}<br />
            <em>Subcategory:</em> {product.subcategory ? product.subcategory.name : "No Subcategory"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
