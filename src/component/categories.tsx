import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      description
    }
  }
`;

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

interface Category {
  id: string;
  name: string;
  description: string;
}

const Categories = () => {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);
  const [addCategory] = useMutation(ADD_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCategory({ variables: { name, description } });
    refetch();
    setName("");
    setDescription("");
  };

  const handleDelete = async (id: string) => {
    await deleteCategory({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Categories</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Category Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {data.getCategories.map((category: Category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>: {category.description || "No description"}
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
