import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const GET_SUBCATEGORIES = gql`
  query GetSubcategories {
    getSubcategories {
      id
      name
      description
    }
  }
`;

const ADD_SUBCATEGORY = gql`
  mutation AddSubcategory($name: String!, $description: String) {
    createSubcategory(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const Subcategories = () => {
  const { loading, error, data, refetch } = useQuery(GET_SUBCATEGORIES);
  const [addSubcategory] = useMutation(ADD_SUBCATEGORY);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSubcategory({ variables: { name, description } });
    refetch();
    setName("");
    setDescription("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Subcategories</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Subcategory Name" 
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
        <button type="submit">Add Subcategory</button>
      </form>
      <ul>
        {data.getSubcategories.map((subcategory: any) => (
          <li key={subcategory.id}>
            <strong>{subcategory.name}</strong>: {subcategory.description || "No description"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subcategories;
